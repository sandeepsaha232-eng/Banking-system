const Wallet = require('../models/wallet.model');
const {depositMail} = require('../services/email.services');
const transaction = require('../models/transaction.model');
const mongoose = require('mongoose');


const balance =  async (req, res) => {

    try {

        const userId = req.user.id; 
        const userWallet = await Wallet.findOne({ userId });

        if (!userWallet) {
            return res.status(404).json({ message: "Wallet not found" });
        }

       return res.json({ balance: userWallet.balance });

    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: error.message });
    }
}

const deposit = async (req, res) => {

    const session = await mongoose.startSession(); // using sessions for tracking the deposit transaction and atomicity
    
    try {
        session.startTransaction(); // start of transaction

        const userId = req.user.id;
        const { amount : rawAmount} = req.body; 
        const {email} = req.user;
        const amount = Number(rawAmount);

        if (!amount || amount <= 0) { // validation of enetred amount
            await session.abortTransaction();
            return res.status(400).json({ message: "Invalid amount" });
        }

        // in this method we have 3 seperate steps read-modify-write : violates ACID

        // userWallet.balance += amount; // addition of balance

        const txnRef = 'TXN'+amount+'DEP'+Date.now();

        const time = new Date().toLocaleString();

        const depositTransaction = new transaction({
                    walletId : null, // to be set after depositiing successfully
                    amount,
                    description : 'deposited funds successfully',
                    txnRef,
                    senderId : userId,
                    receiverId : userId,
                    type : 'deposit',
                    date : new Date()
                });

        // using $inc to avoid read-modify-write : better practice
        const updatedWallet = await Wallet.findOneAndUpdate(
            { userId },
            {
                $inc: { balance: amount },
                $push: { transactions: depositTransaction._id }
            },
            { new: true, session }
        );

        if (!updatedWallet) {
            await session.abortTransaction();
            return res.status(404).json({ message: "Wallet not found" });
        }

        depositTransaction.walletId = updatedWallet._id;
        await depositTransaction.save({ session });

        await session.commitTransaction();

        depositMail(email,amount,time);

        return res.json({ balance: updatedWallet.balance });

    } catch (error) {
        console.log(error)
        await session.abortTransaction();
        return res.status(500).json({ message: error.message });
    }
    finally{
        session.endSession();
    }
};

module.exports = { balance, deposit };