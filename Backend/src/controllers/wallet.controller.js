const Wallet = require('../models/wallet.model');

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

module.exports = { balance };