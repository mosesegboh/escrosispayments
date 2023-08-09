const Transaction = require('../../models/Transaction')
const {validateData} = require('../validation/validateData')
const {getCurrentUserDetails} = require('../process')

const processSwapCurrency = async (data, res) => {
    validateData(data, res)

    var userCurrentDetails = await getCurrentUserDetails(data, undefined, 1, undefined);

    var { balanceForAdditionalCurrencies, currentlockedTransactionBalance, currentUnlockedTransactionBalance} = userCurrentDetails

    var update; 

    if (balanceForAdditionalCurrencies.length == 1 && balanceForAdditionalCurrencies[0] == 0) { balanceForAdditionalCurrencies = [] }

    //check if user has other currency balancies already
    if (balanceForAdditionalCurrencies.length > 0) {           // console.log('hereeeeeee')
        balanceForAdditionalCurrencies.forEach((obj) => {
            const currencyKeyTo = obj.toCurrency; 
            const currencyKeyFrom = obj.fromCurrency;
            // const currencyKeyPrevBalanceFrom = obj.prevBalanceFrom;
            // const value = obj.balance;
            // console.log(obj)
            // // console.log(mulitpleCurrencyList)
            // console.log(data.sourceCurrency, currencyKeyTo, data.transactionCurrency, '-- CURRENCIES')
            // console.log(data.sourceCurrency, currencyKeyFrom, '-- CURRENCIES')
            
            if ( currencyKeyTo == data.sourceCurrency ) {  
                obj.auditEntry = "updated-old-currency"
                obj.fromCurrency = data.destinationCurrency;
                obj.toCurrency = data.sourceCurrency;
                obj.newBalanceToAfterTransaction = data.newBalanceToAfterTransaction;
                obj.newBalanceFromAfterTransaction = data.newBalanceFromAfterTransaction;
                obj.prevBalanceTo = data.prevBalanceTo;
                obj.prevBalanceFrom = data.prevBalanceFrom;
                obj.amountTransacted= data.convertedAmount,
                obj.latestCurrencyBalanceForApp = data.newBalanceToAfterTransaction;
                obj.currencyHoldingBalance = data.sourceCurrency;
                obj.mainBalanceAfterTransaction = data.mainBalanceAfterTransaction,
                obj.mainBalanceBeforeTransaction = data.mainBalanceBeforeTransaction,
                obj[data.sourceCurrency] = data.newBalanceToAfterTransaction;
                obj[data.destinationCurrency] = data.newBalanceFromAfterTransaction;
                obj.balance = data.mainBalanceAfterTransaction;
                obj.rate = data.rate;
                obj.sourceCurrency = data.sourceCurrency;
                obj.sourceAmount = data.sourceAmount;
                obj.destinationCurrency = data.destinationCurrency;
                obj.destinationAmount = data.destinationAmount;
                obj.rate = data.rate;
                
                update = {
                    status: "success",
                    sourceCurrency: data.sourceCurrency,
                    destinationCurrency: data.destinationCurrency,
                    amount: data.amount,
                    transactedAmountAfterConversion: data.mainBalanceAfterTransaction,
                    email: data.email,
                    balance: data.mainBalanceAfterTransaction,
                    balanceCurrency: data.transactionCurrency,
                    mainBalanceAfterTransaction: data.mainBalanceAfterTransaction,
                    mainBalanceBeforeTransaction: data.mainBalanceBeforeTransaction,
                    transactionName: data.transactionName,
                    lockedTransaction: currentlockedTransactionBalance,
                    unLockedTransaction: currentUnlockedTransactionBalance,
                    transactionType: data.transactionType,
                    transactionId: data.transactionId,
                    transactionCurrency: data.transactionCurrency,
                    details: data.details,
                    balanceForAdditionalCurrencies: obj,
                }; 
                return;
            } else {
                balanceForAdditionalCurrencies.push({
                    auditEntry: "updated-new-currency",
                    fromCurrency: data.destinationCurrency,
                    toCurrency: data.sourceCurrency,
                    newBalanceToAfterTransaction: data.newBalanceToAfterTransaction,
                    newBalanceFromAfterTransaction: data.newBalanceFromAfterTransaction,
                    prevBalanceFrom: data.prevBalanceFrom,
                    prevBalanceTo: data.prevBalanceTo,
                    amountTransacted: data.convertedAmount,
                    balanceCurrency: +data.convertedAmount,
                    currencyHoldingBalance: data.sourceCurrency,
                    latestCurrencyBalanceForApp: data.newBalanceFromAfterTransaction,
                    mainBalanceAfterTransaction: data.mainBalanceAfterTransaction,
                    mainBalanceBeforeTransaction: data.mainBalanceBeforeTransaction,
                    prevBalanceTo: +data.prevBalanceTo,
                    prevBalanceFrom: +data.prevBalanceFrom,
                    [data.sourceCurrency]: data.newBalanceToAfterTransaction,
                    [data.destinationCurrency]: data.newBalanceFromAfterTransaction,
                    balance: data.convertedAmount,
                    sourceCurrency: data.sourceCurrency,
                    sourceAmount: data.sourceAmount,
                    destinationCurrency: data.destinationCurrency,
                    destinationAmount: data.destinationAmount,
                    rate: data.rate
                })
   
                update = {
                    status: "success",
                    sourceCurrency: data.sourceCurrency,
                    destinationCurrency: data.destinationCurrency,
                    amount: data.amount,
                    transactedAmountAfterConversion: data.convertedAmount,
                    email: data.email,
                    balance: data.mainBalanceAfterTransaction,
                    balanceCurrency: data.transactionCurrency,
                    mainBalanceAfterTransaction: data.mainBalanceAfterTransaction,
                    mainBalanceBeforeTransaction: data.mainBalanceBeforeTransaction,
                    transactionName: data.transactionName,
                    lockedTransaction: currentlockedTransactionBalance,
                    unLockedTransaction: currentUnlockedTransactionBalance,
                    transactionType: data.transactionType,
                    transactionId: data.transactionId,
                    transactionCurrency: data.transactionCurrency,
                    details: data.details,
                    balanceForAdditionalCurrencies: balanceForAdditionalCurrencies,
                }; 
                return;
            }
        });

    } else {
        const updatedBalanceForAdditionalCurrencies = []
        updatedBalanceForAdditionalCurrencies.push({
            auditEntry: "new",
            fromCurrency: data.destinationCurrency,
            toCurrency: data.sourceCurrency,
            newBalanceFromAfterTransaction: data.newBalanceFromAfterTransaction,
            newBalanceToAfterTransaction: data.newBalanceToAfterTransaction,
            mainBalanceAfterTransaction: data.mainBalanceAfterTransaction,
            mainBalanceBeforeTransaction: data.mainBalanceBeforeTransaction,
            latestCurrencyBalanceForApp: data.newBalanceToAfterTransaction,
            prevBalanceFrom: data.prevBalanceFrom,
            prevBalanceTo: data.prevBalanceTo,
            amountTransacted: data.convertedAmount,
            currencyHoldingBalance: data.sourceCurrency,
            prevBalanceTo: +data.prevBalanceTo,
            prevBalanceFrom: +data.prevBalanceFrom,
            [data.sourceCurrency]: data.newBalanceToAfterTransaction,
            [data.destinationCurrency]: data.newBalanceFromAfterTransaction,
            balance: data.mainBalanceAfterTransaction,
            sourceCurrency: data.sourceCurrency,
            sourceAmount: data.sourceAmount,
            destinationCurrency: data.destinationCurrency,
            destinationAmount: data.destinationAmount,
            rate: data.rate
        })
    
        update = {
            status: "success",
            amount: data.amount,
            email: data.email,
            balanceCurrency: data.transactionCurrency,
            balance: data.mainBalanceAfterTransaction,
            transactionName: data.transactionName,
            lockedTransaction: currentlockedTransactionBalance,
            unLockedTransaction: currentUnlockedTransactionBalance,
            mainBalanceAfterTransaction: data.mainBalanceAfterTransaction,
            mainBalanceBeforeTransaction: data.mainBalanceBeforeTransaction,
            transactionType: data.transactionType,
            transactionId: data.transactionId,
            transactionCurrency: data.transactionCurrency,
            details: data.details,
            transactionCurrency: data.transactionCurrency,
            balanceForAdditionalCurrencies: updatedBalanceForAdditionalCurrencies,
        };
    }
    console.log(update, '--last --')
    return
    const newTransaction = new Transaction(update)
    newTransaction.save()
    .then(result => {
        if (result) {
            const status = "success"
            return res.json({
                status: "SUCCESS",
                message: "The transaction was successfully added"
            })
        }
    }).catch(err => {
        console.log(err)
        res.json({
            status: "FAILED",
            message: "An error occured while saving user"
        })
    })
}

module.exports = {processSwapCurrency}