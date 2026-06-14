const express = require('express');
const router = express.Router();
const verifyUser = require('../middleware/auth.middleware');
const {sendMoney,getTransactions} = require('../controllers/transaction.controller');


router.post('/send',verifyUser,sendMoney);
router.get('/history',verifyUser,getTransactions);

module.exports = router;