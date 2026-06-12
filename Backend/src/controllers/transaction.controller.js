const mongoose = require('mongoose');
const User = require('../models/user.model');
const transaction = require('../models/transaction.model');
const wallet = require('../models/wallet.model');
const {transactionMail} = require('../services/email.services');


const sendMoney = async (req, res) => {

    const session = await mongoose.startSession(); // initializing session for transaction tracking to rollback in case of failure

    try {

        session.startTransaction(); // start of transaction

        const {email : receiverMail,amount : rawAmount,description : note} = req.body; // reciever mail and amount from the input
                                                                        // optional description for note
        const senderId = req.user.id; // sender Id from the cookies

        if(!senderId){
            throw new Error("unauthorized user : cannot send money");
        }

        const amount = Number(rawAmount); // conversion of amount from string to number

        if(!receiverMail || !amount){
            throw new Error("invalid fields"); // if any of the field is missing error should be thrown
        }

        if(amount<=0){ // amount validation
            throw new Error("invalid amount : amount should be greater than 0");
        }

        // search for recievers id
        const receiver = await User.findOne({email:receiverMail}).session(session);

        if(!receiver){
            throw new Error("receiver not found : invalid reciever mail or user may not exist");
        }

        const receiverId = receiver._id;

        // verify if the sender and receiver are the same
        if(receiverId.toString() === senderId.toString()){
            throw new Error("cannot send money to the same accounts");
        }

        const senderWallet = await wallet.findOne({userId:senderId}).session(session);
        const receiverWallet = await wallet.findOne({userId:receiverId}).session(session);

        if(!senderWallet || !receiverWallet){
            throw new Error("Wallet not found : user does not exist or may not have been verified")
        }

        // check for senders wallet before transaction
        if(senderWallet.balance < amount){
            throw new Error("insufficient account balance")
        }

        senderWallet.balance -= amount;
        receiverWallet.balance += amount;

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

        senderWallet.transactions.push(sendTransaction._id);
        receiverWallet.transactions.push(receiveTransaction._id);

        await senderWallet.save({session});
        await receiverWallet.save({session});

        await session.commitTransaction();

        // Send notifications outside the transaction commit
        transactionMail({
            to: req.user.email,
            subject: "Money Sent",
            amount: amount,
            type: 'debit'
        });

        transactionMail({
            to: receiverMail,
            subject: "Money Received",
            amount: amount,
            type: 'credit'
        });

        return res.status(200).json({
            message: "Transaction successful",
            txnRef,
            amount
        });

    } catch(error) {
        
        await session.abortTransaction();
        console.error(error);
        return res.status(500).json({message:error.message});

    } finally {
        session.endSession();
    }
}

module.exports = {sendMoney};
