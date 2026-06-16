const Wallet = require('../models/wallet.model');
const {depositMail} = require('../services/email.services');
const transaction = require('../models/transaction.model');


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

    try {
        // userID and amout from token
        const userId = req.user.id;
        const { amount : rawAmount} = req.body; 
        const {email} = req.user;

        if (!rawAmount || rawAmount <= 0) { // validation of enetred amount
            return res.status(400).json({ message: "Invalid amount" });
        }

        const userWallet = await Wallet.findOne({ userId });

        if (!userWallet) {
            return res.status(404).json({ message: "Wallet not found" });
        }
        const amount = Number(rawAmount);

        userWallet.balance += amount; // addition of balance

        const txnRef = 'TXN'+amount+'DEP'+Date.now();

        const time = new Date().toLocaleString();

        const depositTransaction = new transaction({
                    walletId : userWallet._id,
                    amount,
                    description : 'deposited funds successfully',
                    txnRef,
                    senderId : userId,
                    receiverId : userId,
                    type : 'deposit',
                    date : new Date()
                });

        await depositTransaction.save();
        userWallet.transactions.push(depositTransaction._id);

        await userWallet.save();

        depositMail(email,amount,time);

        return res.json({ balance: userWallet.balance });

    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: error.message });
    }
};

module.exports = { balance, deposit };