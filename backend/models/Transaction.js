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
    status: String,
    balance: { type: Number, default: 0 },
    transactionName: String,
    lockedTransaction:  {
        type: Number,
        required: false,
    },
    unLockedTransaction:  {
        type: Number,
        required: false,
    },
    secondLegTransactionId: {
        type: String,
        required: false,
    },
    transactFromWallet: {
        type: String,
        required: false,
    },
    transactFromAddedFunds: {
        type: String,
        required: false,
    },
    accountNumber: {
        type: Number,
        required: false,
    },
    accountBank: {
        type: Number,
        required: false,
    },
    currency: {
        type: String,
        required: false,
    },
    reference: {
        type: String,
        required: false
    },
    callbackUrl: {
        type: String,
        required: false
    },
    debitCurrency: {
        type: String,
        required: false
    }
})

const Transaction = mongoose.model('Transaction', TransactionSchema)

module.exports = Transaction;