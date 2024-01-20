const {validateData} = require('../validation/validateData')
const {saveTransaction, getCurrentUserDetails} = require('../process')

const processEscrow = async (data, res) => {

    validateData(data, res)

    var userCurrentDetails = await getCurrentUserDetails(data, undefined, 1, undefined);

    const {
        balanceForAdditionalCurrencies,
        currentBalance, 
        currentlockedTransactionBalance, 
        currentUnlockedTransactionBalance
    } = userCurrentDetails
    // console.log(currentUnlockedTransactionBalance, 'unlocked balance')
    var filter = { transactionId: data.transactionId }; //filter is a check for added transactions
    var update = {
        transactionId: data.transactionId, 
        transactionName: data.transactionName,
        transactionType: data.transactionType,
        balance: currentBalance - +data.amount,
        ...((data.transactionType == "FirstLeg") ? { 
            unLockedTransaction: currentUnlockedTransactionBalance + +data.amount,
            lockedTransaction: currentlockedTransactionBalance,
            status: "open",
            secondPartyPhone: data.secondPartyPhone,
            secondPartyEmail: data.secondPartyEmail,
        } : {}
        ),
        ...((data.transactionType == "SecondLeg") ? { 
            unLockedTransaction: currentUnlockedTransactionBalance,
            lockedTransaction: currentlockedTransactionBalance + +data.amount,
            status: "locked" } : {}
        ),
        transactionParty: data.transactionParty,
        amount: data.amount,
        email: data.email,
        date: new Date(),
        redemptionDate: data.date,
        details: data.details,
        transactFromWallet: data.transactFromWallet,
        transactionType: data.transactionType, 
        reference: data.transactionId,
        balanceForAdditionalCurrencies: balanceForAdditionalCurrencies
    }; 
    // console.log(update, '--update')
    saveTransaction(undefined, update, data, res, "directsave")
}

module.exports = {processEscrow}   