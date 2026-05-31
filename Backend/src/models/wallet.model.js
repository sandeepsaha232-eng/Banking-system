const mongoose = require('mongoose');
const Schema = mongoose.Schema;


const wallet = new Schema({

    // unique identifier for the wallet
    userId: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    balance: {
        type: Number,
        default: 0
    },
    // transaction history of the wallet
    transactions: [{
        type: Schema.Types.ObjectId,
        ref: 'Transaction'
    }]
})

module.exports = mongoose.model('Wallet', wallet)
