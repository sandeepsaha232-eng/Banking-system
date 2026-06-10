const express = require('express');
const router = express.Router();
const verify = require('../middleware/auth.middleware');
const {balance,deposit} = require('../controllers/wallet.controller')


router.get('/balance', verify, balance); // Get wallet balance for the logged-in user

router.post('/topup', verify, deposit); // topup the wallet

module.exports = router;