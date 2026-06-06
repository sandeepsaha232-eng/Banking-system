const express = require('express');
const router = express.Router();
const verify = require('../middleware/auth.middleware');
const {balance} = require('../controllers/wallet.controller')

// Get wallet balance for the logged-in user

router.get('/balance', verify, balance);

module.exports = router;