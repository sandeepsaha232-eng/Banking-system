const mongoose = require('mongoose');
const User = require('../models/user.model');
const transaction = require('../models/transaction.model');
const wallet = require('../models/wallet.model');
const {transactionMail} = require('../services/email.services');


const sendMoney = async (req, res) => {

    const session = await mongoose.startSession(); // initializing session for transaction tracking to rollback in case of failure

    try {

        // In invalid cases, return response with error instead of throwing and using one handler : easier to identify the errr
        session.startTransaction(); // start of transaction

        const {receiverEmail,amount : rawAmount,note} = req.body; // reciever mail and amount from the input
                                                                        // optional description for note
        const senderId = req.user.id; // sender Id from the cookies

        if(!senderId){
            await session.abortTransaction();
            return res.status(401).json({message:"unauthorized user"});
        }

        const amount = Number(rawAmount); // conversion of amount from string to number

        if(!receiverEmail || !amount){
            await session.abortTransaction();
            return res.status(400).json({message:"all fields are required"}); // if any of the field is missing error should be thrown
        }

        if(amount<=0){ // amount validation
            await session.abortTransaction();
            return res.status(400).json({message:"invalid amount"});
        }

        // search for recievers id
        const receiver = await User.findOne({email:receiverEmail}).session(session);

        if(!receiver){
            await session.abortTransaction();
            return res.status(404).json({message:"user not found"});
        }

        const receiverId = receiver._id;

        // verify if the sender and receiver are the same
        if(receiverId.toString() === senderId.toString()){
            await session.abortTransaction();
            return res.status(400).json({message:"cannot send money to same accounts"});
        }

        const senderWallet = await wallet.findOne({userId:senderId}).session(session);
        const receiverWallet = await wallet.findOne({userId:receiverId}).session(session);

        if(!senderWallet || !receiverWallet){
            await session.abortTransaction();
            return res.status(404).json({message:"wallet not found"});
        }

        // check for senders wallet before transaction
        if(senderWallet.balance < amount){
            await session.abortTransaction();
            return res.status(400).json({message:"insufficient balance in your account"});
        }

        // not a good practice

        // senderWallet.balance -= amount;
        // receiverWallet.balance += amount; // not to be used

        const txnRef = `TXN${Date.now()}`
        const description = note || `Transaction successful`

        const sendTransaction = new transaction({
            walletId : senderWallet._id,
            amount,
            description,
            txnRef,
            senderId,
            receiverId,
            type : 'debit',
            date : new Date()
        })

        const receiveTransaction = new transaction({
            walletId : receiverWallet._id,
            amount,
            description,
            txnRef,
            senderId,
            receiverId,
            type : 'credit',
            date : new Date()
        })

        await sendTransaction.save({session});
        await receiveTransaction.save({session});

        // using atomic $inc + $push  queries instead of read-modify-write on both wallets : better practice
        await wallet.findByIdAndUpdate(
            senderWallet._id,
            { $inc: { balance: -amount }, $push: { transactions: sendTransaction._id } },
            { session }
        );

        await wallet.findByIdAndUpdate(
            receiverWallet._id,
            { $inc: { balance: amount }, $push: { transactions: receiveTransaction._id } },
            { session }
        );

        await session.commitTransaction();

        // Send notifications to both sender and receiver 
        transactionMail({
            to: req.user.email,
            subject: "Money Sent",
            amount: amount,
            type: 'debit'
        });

        transactionMail({
            to: receiverEmail,
            subject: "Money Received",
            amount: amount,
            type: 'credit'
        });

        return res.status(200).json({
            success: true,
            message: "Transaction successful",
            sender : req.user.email,
            receiverEmail,
            description,
            txnRef,
            amount,
        });

    } catch (error) {
        // only geunuine server errors reach here
        await session.abortTransaction();
        return res.status(500).
                    json({message:error.message
                        ,success:false
                    });

    } finally {
        session.endSession();
    }
}

const getTransactions = async (req, res) => {

    try {
        const userId = req.user.id;
    
        if(!userId){
            return res.status(401).json({message:"unauthorized user"});
        }

        const Wallet = await wallet.findOne({userId});

        if(!Wallet){
            return res.status(404).json({message:"wallet not found"});
        }

        const transactions = await transaction.find({walletId:Wallet._id});

        if(!transactions){
            return res.status(404).json({message:"no transactions yet"});
        }

        return res.status(200).json({transactions});

    } catch(err){
        return res.status(500).json({message:err.message});
    }

}

module.exports = {sendMoney,getTransactions};
