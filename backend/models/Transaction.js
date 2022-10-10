const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const TransactionSchema = new Schema({
    transactionId: String,
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