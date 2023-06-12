const transferFunction = require('../../services/email/functions/transferFunction')
const Transaction = require('../../models/Transaction')
const {validateData} = require('../validation/validateData')
const sendEmailFunction = require('../../services/email/functions/sendEmailFunction')
const airtimeTemplate = require('../../services/email/templates/airtimeTemplate')
const {saveTransaction, getCurrentUserDetails} = require('../process')

const processVirtualCards = async (data, res) => {

    validateData(data, res)

    var userCurrentDetails = await getCurrentUserDetails(data)

    var filter = { transactionId: data.transactionId } //filter is a check for added transactions
    var update = {
        status: "pending",
        transactionId: data.transactionId,
        transactionName: data.transactionName,
        transactionType: data.transactionType,
        balance: +userCurrentDetails[2] - +data.amount,
        // lockedTransaction: +userCurrentDetails[0],
        // unLockedTransaction: +userCurrentDetails[1],
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
        data: data.data
    };

    saveTransaction(filter, update, data, res)
}

module.exports = {processVirtualCards}