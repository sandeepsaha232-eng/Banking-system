const express = require('express');
const Wallet = require('../models/wallet.model');
const router = express.Router();
const verify = require('../middleware/auth.middleware');

// Get wallet balance for the logged-in user

router.get('/balance', verify, async (req, res) => {

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
});

module.exports = router;