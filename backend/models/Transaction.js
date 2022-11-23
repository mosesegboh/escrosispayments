const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const TransactionSchema = new Schema({
    email: String,
    transactionId: String,
    transactionDate: Date,
    amount: Number,
    transactionType: String,
    date: Date,
    details: String,
    secondLegTransactionId: {
        type: String,
        required: false,
    }
})

const Transaction = mongoose.model('Transaction', TransactionSchema)

module.exports = Transaction;