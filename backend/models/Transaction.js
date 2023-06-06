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
    },
    beneficiaryEmail: {
        type: String,
        required: false
    },
    beneficiary_country: {
        type: String,
        required: false
    },
    beneficiary_occupation: {
        type: String,
        required: false
    },
    recipient_address: {
        type: String,
        required: false
    },
    mobile_number: {
        type: Number,
        required: false
    },
    sender: {
        type: String,
        required: false
    },
    sender_country: {
        type: String,
        required: false
    },
    sender_id_number: {
        type: String,
        required: false
    },
    sender_id_type: {
        type: String,
        required: false
    },
    sender_id_expiry: {
        type: Date,
        required: false
    },
    sender_mobile_number: {
        type: Number,
        required: false
    },
    sender_mobile_number: {
        type: Number,
        required: false
    },
    sender_occupation: {
        type: String,
        required: false
    },
    sender_beneficiary_relationship: {
        type: String,
        required: false
    },
    transfer_purpose: {
        type: String,
        required: false
    },
    destination_branch_code: {
        type: String,
        required: false
    },
    beneficiary_name: {
        type: String,
        required: false
    },
    AccountNumber: {
        type: String,
        required: false
    },
    RoutingNumber: {
        type: String,
        required: false
    },
    SwiftCode: {
        type: String,
        required: false
    },
    BankName: {
        type: String,
        required: false
    },
    BeneficiaryName: {
        type: String,
        required: false
    },
    BeneficiaryAddress: {
        type: String,
        required: false
    },
    BeneficiaryCountry: {
        type: String,
        required: false
    },
    PostalCode: {
        type: String,
        required: false
    },
    StreetNumber: {
        type: String,
        required: false
    },
    StreetName: {
        type: String,
        required: false
    },
    City: {
        type: String,
        required: false
    },
    first_name: {
        type: String,
        required: false
    },
    last_name: {
        type: String,
        required: false
    }



})

const Transaction = mongoose.model('Transaction', TransactionSchema)

module.exports = Transaction;