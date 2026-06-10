const Wallet = require('../models/wallet.model');
const {depositMail} = require('../services/email.services');


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
        const { amount } = req.body; 

        if (!amount || amount <= 0) { // validation of enetred amount
            return res.status(400).json({ message: "Invalid amount" });
        }

        const userWallet = await Wallet.findOne({ userId });

        if (!userWallet) {
            return res.status(404).json({ message: "Wallet not found" });
        }

        userWallet.balance += amount; // addition of balance
        await userWallet.save();

        depositMail(userWallet.userId.email,amount);

        return res.json({ balance: userWallet.balance });

    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: error.message });
    }
};

module.exports = { balance, deposit };