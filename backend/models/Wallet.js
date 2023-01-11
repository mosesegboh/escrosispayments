const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const WalletSchema = new Schema({
    email: String,
    transactionId: String,
    transactionDate: Date,
    lastAmount: Number,
    WalletBalance: { type: Number, default: 0 },
    transactionName: String
})

const Wallet = mongoose.model('Wallet', WalletSchema)

module.exports = Wallet;