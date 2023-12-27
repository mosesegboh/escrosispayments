const {saveTransaction, getCurrentUserDetails} = require('../process')
const {validateData} = require('../validation/validateData')

const processPayments = async (data, res) => {

    validateData(data, res)

    var userCurrentDetails = await getCurrentUserDetails(data, undefined, 1, undefined);

    var {
        balanceForAdditionalCurrencies, 
        currentBalance, 
        currentlockedTransactionBalance,
        currentUnlockedTransactionBalance,
        // userCurrentTransactionCurrency,
    } = userCurrentDetails

    var update = {
        status: "pending",
        transactionId: data.transactionId,
        transactionName: data.transactionName,
        transactionType: data.transactionType,
        balance: currentBalance,
        transactionCurrency: data.transactionCurrency,
        transactionName: data.transactionName,
        lockedTransaction: currentlockedTransactionBalance,
        unLockedTransaction: currentUnlockedTransactionBalance,
        amount: data.amount,
        email: data.email,
        date: data.date,
        details: data.details,
        transactionType: data.transactionType,
        customer: data.customer,
        reference: data.reference,
        balanceForAdditionalCurrencies: balanceForAdditionalCurrencies,
        // data: data.data
    };

    saveTransaction(undefined, update, data, res, "directsave")
}

module.exports = {processPayments}