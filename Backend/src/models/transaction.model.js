const mongoose = require('mongoose');
const send = require('send');
const Schema = mongoose.Schema;

// transaction model

const transaction = new Schema({
    // unique identifier for the transaction
    walletId: {
        type: Schema.Types.ObjectId,
        ref: 'Wallet',
        required: true
    },
    amount: {
        type: Number,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    txnRef: {
        type: String,
        required: true
    },
    // sender details
    senderId: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    // receiver details
    receiverId: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    type: {
        type: String,
        enum: ['credit', 'debit'], // enum for the definition of type of transaction
        required: true
    },
    date: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Transaction', transaction);