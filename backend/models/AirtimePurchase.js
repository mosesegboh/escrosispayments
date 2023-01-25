const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const AirtimePurchaseSchema = new Schema({
    email: String,
    transactionId: String,
    transactionDate: Date,
    amount: Number,
    transactionType: String,
    date: Date,
    details: String,
    status: String,
    balance: { type: Number, default: 0 },
    transactionName: String,
    transactFromWallet: {
        type: String,
        required: false,
    },
    transactFromAddedFunds: {
        type: String,
        required: false,
    }
})

const Transaction = mongoose.model('AirtimePurchaseSchema', AirtimePurchaseSchema)

module.exports = AirtimePurchaseSchema;