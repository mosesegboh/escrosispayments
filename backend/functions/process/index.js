const Transaction = require('../../models/Transaction')
const {sendEmailFunction} = require('../../services/email/functions/sendEmailFunctionExport')
const {successBillPayment, failedBillPayment} = require('../../services/email/templates/billPaymentTemplate')
const walletTemplate = require('../../services/email/templates/walletTemplate')
const billPaymentTemplate = require('../../services/email/templates/billPaymentTemplate')
const firstLegEscrowTemplate = require('../../services/email/templates/firstLegEscrowTemplate')
const secondLegEscrowTemplate = require('../../services/email/templates/secondLegEscrowTemplate') 
const paymentTemplate = require('../../services/email/templates/paymentTemplate')
const cancelTransactionTemplate = require('../../services/email/templates/cancelledTransactionTemplate')
const redeemTransactionTemplate = require('../../services/email/templates/redeemTransactionTemplate')


const getCurrentUserDetails = async ({email, amount, transactFromWallet}, sortOrder=-1, limit=2, getBy={email: email}) => {
    var condition = {}
    if (Object.keys(getBy).length > 0) {
        var condition = {};

        Object.keys(getBy).forEach((key) => {
            const value = getBy[key];
            const conditionKey = `Transaction.${key}`;
            condition[conditionKey] = value;
        });
    } else if (Object.keys(getBy).length === 0) {
        var condition = {}
    }

    const userDetails = await Transaction.find(
        // {"Transaction.email": email},
        condition
    ).sort({_id: sortOrder}).limit(limit)
    .then((transaction)=>{
        
        if (transaction) {
            // console.log(transaction)
            var currentlockedTransactionBalance = (transaction.length > 1 && transaction[1].lockedTransaction) ? transaction[1].lockedTransaction : (limit == 1 && transaction[0]) ? transaction[0].lockedTransaction : 0.00
            var currentUnlockedTransactionBalance = (transaction.length > 1 && transaction[1].unLockedTransaction ) ?  transaction[1].unLockedTransaction : (limit == 1 && transaction[0]) ? transaction[0].unLockedTransaction : 0.00
            var currentBalance = (transaction.length > 1 && transaction[1].balance) ? transaction[1].balance : (limit == 1 && transaction[0]) ? transaction[0].balance : 0.00
            var userBalanceForAdditionalCurrencies = (transaction.length > 1 && transaction[1].balanceForAdditionalCurrencies) ? transaction[1].balanceForAdditionalCurrencies : (limit == 1 && transaction[0]) ? transaction[0].balanceForAdditionalCurrencies : 0.00
            var userCurrentTransactionCurrency = (transaction.length > 1 && transaction[1].transactionCurrency) ? transaction[1].transactionCurrency : (limit == 1 && transaction[0]) ? transaction[0].transactionCurrency : null

            if ( amount > currentBalance && transactFromWallet == "yes") {
                return res.json({
                    status: "FAILED",
                    message: "You do not have sufficient funds to complete your transaction"
                })
            }
            // console.log(currentlockedTransactionBalance, currentUnlockedTransactionBalance, currentBalance)
            const userDetailsObject = {
                currentlockedTransactionBalance: currentlockedTransactionBalance,
                currentUnlockedTransactionBalance: currentUnlockedTransactionBalance,
                currentBalance: currentBalance,
                balanceForAdditionalCurrencies: userBalanceForAdditionalCurrencies,
                userCurrentTransactionCurrency: userCurrentTransactionCurrency
            }
            return userDetailsObject; 
        }else{
            return res.json({
                status: "FAILED",
                message: "Client data not found"
            })
        }
        
    }).catch(err => {
        console.log(err, '--an error occured')
    })
    return userDetails
}

// const appriopriateTemplate = (transactionName, status, successBillPayment=null, failedBillPayment=null) => {
//     if (transactionName == 'billPayment' && status == 'success') {
//         return successBillPayment
//     }else if (transactionName ==  'billPayment' && status == 'failed') {
        
//         return successBillFailed
//     }
// }


const saveTransaction = (filter = {}, update, data, res = {}, directSave = "") => {
    // console.log(directSave)
    if (directSave === "directsave") {
        // console.log('i got here')
        // return
        const newTransaction = new Transaction(update)
        newTransaction.save()
        .then(result => {
            if (result) { 
                
                const status = "success";

                const templates = {
                    "wallet": walletTemplate,
                    "billPayment": billPaymentTemplate,
                    "FirstLeg": firstLegEscrowTemplate,
                    "SecondLeg": secondLegEscrowTemplate,
                    "receivepayments": paymentTemplate
                };
            
                let relevantTemplate = templates[result.transactionName] || templates[result.transactionType] || '';

                sendEmailFunction(result, res, status, relevantTemplate)

                return res.json({
                    status: "SUCCESS",
                    message: "Transaction was queued successfully"
                })
            }
        })
        .catch(err => {
            console.log(err)
            const status = "failed"
            
            const templates = {
                "wallet": walletTemplate,
                "billPayment": billPaymentTemplate,
                "FirstLeg": firstLegEscrowTemplate,
                "SecondLeg": secondLegEscrowTemplate,
                "receivepayments": paymentTemplate
            };
        
            let relevantTemplate = templates[result.transactionName] || templates[result.transactionType] || '';

            sendEmailFunction(result, res, status, relevantTemplate)

            return res.json({
                status: "FAILED",
                message: "An error occured while saving details"
            })
        })
        return
    }

    console.log('here 1111')
    if (data.transactFromWallet == "yes"){    
        const newTransaction = new Transaction(update)
        newTransaction.save()
        .then(result => {
            if (result) {
                const status = "success"
                const relevantTemplate = (data.transactionName == 'billPayment') ? successBillPayment
                                        : (data.transactionName == 'billPayment') ? successBillPayment
                                        : null
                sendEmailFunction(result, res, status, relevantTemplate)
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
    }else{
        setTimeout(function(){
            console.log("Delaying for 5 secs for webhook");
        }, 5000);

        if ( data.transactFromAddedFunds == "yes"){//balance will remain thesame if you are doing from added funds
            update.balance = userCurrentDetails[0]
        }

        Transaction.findOneAndUpdate(filter, update, {
            new: true
        }).then(result => {
                // console.log(result, '<-result, right track')
            if (result){
                const status = "success"
                
                sendEmailFunction(result, res, status, successBillPayment)
                
                return res.json({
                    status: "SUCCESS",
                    message: "Transfer has been sent successfully"
                })
            }else{
                return res.json({
                    status: "FAILED",
                    message: "The transaction could not be completed - API"
                })
            }
        }).catch(err => {
            const status = "failed"
            var result = {}
            sendEmailFunction(result, res, status, failedBillPayment)
            console.log(err)
            return res.json({
                status: "FAILED",
                message: "An error occured, while trying to send the transfer"
            })
        })
    }
}

const updateParticularCurrencyBalances = (amount, currency, multipleCurrencyObject) => {
    multipleCurrencyObject.forEach((item) => {
        if (item.transactionCurrency === currency) { 
            item.mainBalanceAfterTransaction = +item.mainBalanceAfterTransaction + +amount 
        }
    })
    return multipleCurrencyObject
}


async function redeemTransaction(transaction, res = null) {
    if (transaction.status === 'complete') {
        const response = {
            status: "FAILED",
            message: "This transaction has already being completed!"
        };
        return res ? res.json(response) : response;
    }

    if (transaction.transactionLeg === "FirstLeg") {
        const response = {
            status: "FAILED",
            message: "First Leg Transactions can only be cancelled!"
        };
        return res ? res.json(response) : response;
    }

    var filterFirstLeg = {
        transactionId: transaction.transactionId,
        status: 'redeemed',
        lockedTransaction: +transaction.unlockedTransaction - +transaction.amount,
        transactionDate: new Date(),
    }

    var filterSecondLeg = {
        transactionId: transaction.transactionId
    }

    const updateFirstLeg = {
        status: 'redeemed',
        lockedTransaction: transaction.lockedTransaction - transaction.amount
    };

    const updateSecondLeg = {
        status: 'redeemed',
        lockedTransaction: transaction.lockedTransaction - transaction.amount
    };

    try {
        const redeemedTransaction = await Transaction.findOneAndUpdate(
            { 
                transactionId: transaction.transactionId, 
                secondLegTransactionId: transaction.secondLegTransactionId  
            },
            update, { new: true }
        );

        console.log('Transaction Redeemed Successfully');
        if (res) {
            sendEmailFunction(redeemedTransaction, res, 'success', redeemTransactionTemplate);
        } else {
            return redeemedTransaction;
        }
    } catch (err) {
        console.error(err);
        console.log('An error occurred while redeeming this transaction');
    }
}

async function cancelTransaction(transaction, res) {
    if (transaction.status === 'complete') {
        return res.json({
            status: "FAILED",
            message: "This transaction has already being completed"
        })
    }

    if (transaction.transactionParty !== "seller") {
        return res.json({
            status: "FAILED",
            message: "This transaction can only be redeemed by the seller"
        })
    }

    var filter = {
        transactionId: transaction.transactionId
    }

    if (transaction.transactionLeg = "FirstLeg") {
        var update = {
            status: 'cancelled',
            lockedTransaction: +transaction.unlockedTransaction - +transaction.amount,
            balance: +balance + +amount,
            transactionDate: new Date(),
        }
    }

    if (transaction.transactionLeg = "SecondLeg") {
        var update = {
            status: 'cancelled',
            lockedTransaction: +transaction.lockedTransaction - +transaction.amount,
            balance: +balance + +amount,
            transactionDate: new Date(),
        }
    }

    if (transaction.transactionParty = "seller") {
        Transaction.findOneAndUpdate(filter, update, {
            new: true
        }).then((result) => {
            console.log('Transaction redeemed Successfully')
            const status = "success"
            const relevantTemplate = cancelTransactionTemplate
            sendEmailFunction(result, res, status, relevantTemplate)
            return res.json({
                status: "SUCCESS",
                message: "The transaction was successfully cancelled"
            })
        }).catch((err) => {
            console.log(err)
            console.log('An error occured while cancelling this transaction')
        })
    }
}

module.exports = {
    saveTransaction, 
    getCurrentUserDetails, 
    updateParticularCurrencyBalances, 
    redeemTransaction,
    cancelTransaction
}  