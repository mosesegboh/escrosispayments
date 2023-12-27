const Transaction = require('../../models/Transaction')
const {validateData} = require('../validation/validateData')
const {getCurrentUserDetails} = require('../process')

const processSwapCurrency = async (data, res) => {
    validateData(data, res)

    var userCurrentDetails = await getCurrentUserDetails(data, undefined, 1, undefined);
    var { balanceForAdditionalCurrencies, currentlockedTransactionBalance, currentUnlockedTransactionBalance} = userCurrentDetails
    var update; 
    let found = false;

    if (balanceForAdditionalCurrencies.length == 1 && balanceForAdditionalCurrencies[0] == 0) { balanceForAdditionalCurrencies = [] }

    if (balanceForAdditionalCurrencies.length > 0) {
        balanceForAdditionalCurrencies.some((obj) => {
            const currencyKeyTo = obj.toCurrency; 
            const currencyKeyFrom = obj.fromCurrency;
            // console.log(process.env.DEFAULT_CURRENCY, obj.fromCurrency)
            if (obj.toCurrency == process.env.DEFAULT_CURRENCY) {
                // console.log('i cam inside here o')
                obj.balance = data.mainBalanceAfterTransaction;
                obj.newBalanceToAfterTransaction = data.mainBalanceAfterTransaction;
                obj.prevBalanceFrom = data.prevBalanceFrom;
                obj.mainBalanceBeforeTransaction = data.prevBalanceFrom;
                obj.mainBalanceAfterTransaction = data.mainBalanceAfterTransaction;
                obj.newBalanceFromAfterTransaction = null;
                obj.prevBalanceTo = data.mainBalanceAfterTransaction;
                obj.amountTransacted = data.destinationAmount;
                obj.currencyHoldingBalance = data.mainBalanceAfterTransaction;
                obj.latestCurrencyBalanceForApp = data.mainBalanceAfterTransaction;
                obj[data.destinationCurrency] = data.mainBalanceAfterTransaction;
                obj.rate = null;
                obj.destinationAmount = null;
            }

            // console.log(data.sourceCurrency, '------')
            
            //newlu added
            if ( currencyKeyFrom == data.destinationCurrency ) { 
                console.log('i got insider here ooooooo')
                // console.log(data.sourceCurrency, currencyKeyTo, typeof(currencyKeyTo), typeof(data.sourceCurrency),  '-- logs')
                obj.auditEntry = "updated-opposite-currency-other-newly-added"
                obj.transactionLastUpdated = new Date();
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
                obj.balance = data.newBalanceToAfterTransaction;
                obj.rate = data.rate;
                obj.sourceCurrency = data.sourceCurrency;
                obj.sourceAmount = data.sourceAmount;
                obj.destinationCurrency = data.destinationCurrency;
                obj.destinationAmount = data.destinationAmount;
                obj.rate = data.rate;
                obj.amountTransacted = data.convertedAmount;
                // found = true;
                // return true;
            }
           
            if ( currencyKeyTo == data.sourceCurrency ) {  
                // console.log(data.sourceCurrency, currencyKeyTo, typeof(currencyKeyTo), typeof(data.sourceCurrency),  '-- logs')
                obj.auditEntry = "updated-old-currency"
                obj.transactionLastUpdated = new Date();
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
                obj.balance = data.newBalanceToAfterTransaction;
                obj.rate = data.rate;
                obj.sourceCurrency = data.sourceCurrency;
                obj.sourceAmount = data.sourceAmount;
                obj.destinationCurrency = data.destinationCurrency;
                obj.destinationAmount = data.destinationAmount;
                obj.rate = data.rate;
                obj.amountTransacted = data.convertedAmount;

                found = true;
                return true;
            }
        });

        // console.log(balanceForAdditionalCurrencies, '---balance for')
        // return
        if (!found) {
            // console.log('here')
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
                rate: data.rate,
                transactionLastUpdated: new Date()
            })
        }
        
    } else {
        balanceForAdditionalCurrencies.push(
            {
                auditEntry: "default",
                fromCurrency: null,
                toCurrency: data.destinationCurrency,
                newBalanceFromAfterTransaction: data.newBalanceFromAfterTransaction,
                newBalanceToAfterTransaction: data.newBalanceFromAfterTransaction,
                mainBalanceAfterTransaction: data.newBalanceFromAfterTransaction,
                mainBalanceBeforeTransaction: data.mainBalanceBeforeTransaction,
                latestCurrencyBalanceForApp: null,
                prevBalanceFrom: data.prevBalanceFrom,
                prevBalanceTo: null,
                amountTransacted: null,
                currencyHoldingBalance: null,
                prevBalanceTo: null,
                prevBalanceFrom: +data.prevBalanceFrom,
                [data.destinationCurrency]: data.mainBalanceBeforeTransaction,
                balance: data.mainBalanceAfterTransaction,
                sourceCurrency: null,
                sourceAmount: null,
                destinationCurrency: data.destinationCurrency,
                destinationAmount: null,
                rate: null,
                transactionLastUpdated: new Date()
            },
            {
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
                balance: data.newBalanceToAfterTransaction,
                sourceCurrency: data.sourceCurrency,
                sourceAmount: data.sourceAmount,
                destinationCurrency: data.destinationCurrency,
                destinationAmount: data.destinationAmount,
                rate: data.rate,
                transactionLastUpdated: new Date()
            }
        )
    }

    update = {
        status: "success",
        amount: data.amount,
        email: data.email,
        balanceCurrency: data.mainCurrency,
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
        transactionDate: new Date(),
        balanceForAdditionalCurrencies: balanceForAdditionalCurrencies,
    };

    console.log(update, data.mainBalanceAfterTransaction, balanceForAdditionalCurrencies, '--last --') 
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
            message: "An error occured while saving swap transaction"
        })
    })

}

module.exports = {processSwapCurrency}