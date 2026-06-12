const express = require('express');
const router = express.Router();
const verifyUser = require('../middleware/auth.middleware');
const {sendMoney} = require('../controllers/transaction.controller');

router.post('/send',verifyUser,sendMoney);

module.exports = router;