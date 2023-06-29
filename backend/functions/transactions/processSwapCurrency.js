const Transaction = require('../../models/Transaction')
const {validateData} = require('../validation/validateData')
const {saveTransaction, getCurrentUserDetails} = require('../process')
// const sendEmailFunction = require('../../services/email/functions/sendEmailFunction')

const processSwapCurrency = async (data, res) => {
    validateData(data, res)

    var userCurrentDetails = await getCurrentUserDetails(data, undefined, 1, undefined);

    var {
        balanceForAdditionalCurrencies, 
        currentBalance, 
        currentlockedTransactionBalance,
        currentUnlockedTransactionBalance,
        userCurrentTransactionCurrency,
    } = userCurrentDetails

    var update; 
    const userNewBalance = +currentBalance - +data.amount;
    // console.log(balanceForAdditionalCurrencies, 'iiiii')
    // return
    //check if user has other currency balancies already
    if (balanceForAdditionalCurrencies.length > 0) {
            // console.log('hereeeeeee')
            balanceForAdditionalCurrencies.forEach((obj) => {
                const currencyKey = obj.toCurrency; 
                const value = obj.balance;

                // console.log(obj.fromCurrency, data.sourceCurrency, '--currency')
                // return

                if (currencyKey == data.sourceCurrency) {
                    if (currencyKey == data.transactionCurrency) {
                        return
                    }
                    // console.log(value, '--currency, inside here oooooo')
                    // return
                    // Calculate the new balance
                    const newCurrencyBalance = +value + +data.convertedAmount;
                    // Deduct the balance
                    obj.fromCurrency = data.destinationCurrency;
                    obj.toCurrency = data.sourceCurrency;
                    obj.amountTransacted = data.amount;
                    obj[data.sourceCurrency] = data.convertedAmount;
                    obj[data.destinationCurrency] = data.amount;
                    obj.balance = newCurrencyBalance;
                    obj.rate = data.rate;
                    
                    update = {
                        status: "success",
                        sourceCurrency: data.destinationCurrency,
                        destinationCurrency: data.sourceCurrency,
                        amount: data.amount,
                        email: data.email,
                        balance: userNewBalance,
                        transactionName: data.transactionName,
                        lockedTransaction: currentlockedTransactionBalance,
                        unLockedTransaction: currentUnlockedTransactionBalance,
                        transactionType: data.transactionType,
                        transactionId: data.transactionId,
                        transactionCurrency: data.transactionCurrency,
                        balanceForAdditionalCurrencies: obj,
                        details: data.details
                    }; 
                    // return updated

                    // console.log(update, 'kkkkk')
                    // return
                } else {
                    // if (currencyKey == data.transactionCurrency) {
                    //     return
                    // }

                    // console.log('inside here ooo')
                    // return

                    //do the update calculations here
                    const newCurrencyBalance = +data.convertedAmount;
                    
                    balanceForAdditionalCurrencies.push({
                        fromCurrency: data.destinationCurrency,
                        toCurrency: data.sourceCurrency,
                        amountTransacted: data.amount,
                        [data.sourceCurrency]: data.convertedAmount,
                        [data.destinationCurrency]: data.amount,
                        balance: newCurrencyBalance,
                        rate: data.rate,
                    })
                    
                    update = {
                        status: "success",
                        sourceCurrency: data.destinationCurrency,
                        amount: data.amount,
                        email: data.email,
                        balance: userNewBalance,
                        transactionName: data.transactionName,
                        lockedTransaction: currentlockedTransactionBalance,
                        unLockedTransaction: currentUnlockedTransactionBalance,
                        transactionType: data.transactionType,
                        transactionId: data.transactionId,
                        transactionCurrency: data.transactionCurrency,
                        balanceForAdditionalCurrencies: balanceForAdditionalCurrencies
                    }; 
                }
            });

    } else {
        balanceForAdditionalCurrencies.push({
            fromCurrency: data.destinationCurrency,
            toCurrency: data.sourceCurrency,
            amountTransacted: data.amount,
            [data.sourceCurrency]: data.convertedAmount,
            [data.destinationCurrency]: data.amount,
            balance: data.convertedAmount,
            rate: data.rate
        })
    
        update = {
            status: "success",
            sourceCurrency: data.destinationCurrency,
            amount: data.amount,
            email: data.email,
            balance: userNewBalance,
            transactionName: data.transactionName,
            lockedTransaction: currentlockedTransactionBalance,
            unLockedTransaction: currentUnlockedTransactionBalance,
            transactionType: data.transactionType,
            transactionId: data.transactionId,
            transactionCurrency: data.transactionCurrency,
            balanceForAdditionalCurrencies: balanceForAdditionalCurrencies
        };
        // console.log(update, 'else else')
        // return
    }

    // console.log(update, '--test--')
    // return
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