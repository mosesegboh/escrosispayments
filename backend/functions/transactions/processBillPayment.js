const transferFunction = require('../../services/email/functions/transferFunction')
const Transaction = require('../../models/Transaction')
const {validateData} = require('../validation/validateData')
const sendEmailFunction = require('../../services/email/functions/sendEmailFunction')
const airtimeTemplate = require('../../services/email/templates/airtimeTemplate')
const {saveTransaction, getCurrentUserDetails} = require('../process')

const processBillPayment = async (data, res) => {

    validateData(data, res)

    var userCurrentDetails = await getCurrentUserDetails(data, undefined, 1, undefined);

    var {
        balanceForAdditionalCurrencies, 
        currentBalance, 
        currentlockedTransactionBalance,
        currentUnlockedTransactionBalance,
        // userCurrentTransactionCurrency,
    } = userCurrentDetails

    // var filter = { transactionId: data.transactionId }; //filter is a check for added transactions
    var update = {
        status: data.status,
        transactionId: data.transactionId,
        transactionName: data.transactionName,
        transactionType: data.transactionType,
        balance: +currentBalance - +data.amount,
        lockedTransaction: +currentlockedTransactionBalance,
        unLockedTransaction: +currentUnlockedTransactionBalance,
        amount: data.amount,
        email: data.email,
        date: data.date,
        details: data.details,
        transactFromWallet: data.transactFromWallet,
        country: data.country,
        transactionType: data.transactionType,
        customer: data.customer,
        recurrence: data.recurrence,
        reference: data.reference,
        balanceForAdditionalCurrencies: balanceForAdditionalCurrencies
    };

    // saveTransaction(filter, update, data, res)
    saveTransaction(undefined, update, data, res, "directsave")
}

module.exports = {processBillPayment}  