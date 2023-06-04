const Transaction = require('../../models/Transaction')
const validation = require('../validation/validateData')
const sendEmailFunction = require('../../services/email/functions/sendEmailFunction')
const redeemTransactionTemplate = require('../../services/email/templates/transactionRedemptionTemplate')

const processRedeemTransaction = async (data, res) => {

    validation.validateData(data, res)

    let { transactionId } = data
    //function to redeem transaction
    try
    {
        let transactions = await Transaction.find({transactionId: transactionId, secondLegTransactionId: secondLegTransactionId})
        transactions.forEach((transactionsToRedeem) => { 

            if (transactionsToRedeem.status !== 'locked') {
                return res.json({
                    status: "FAILED",
                    message: "You cannot redeem this transaction, try again later"
                })
            }
                
            if (transactionsToRedeem.length > 1) {
                //move data udate and send email
                transactionsToRedeem.forEach((transactionToRedeem) => {
                    //second Leg should be hte seller normally
                    if (transactionToRedeem.transactionLeg = "SecondLeg") {
                        //credit the money to the wallet of the second leg account holder and update customer account
                        var newSecondLegAccountBalance = +transactionToRedeem.balance + +transactionToRedeem.balance
                        var update = {
                            balance: newSecondLegAccountBalance,
                            status: 'redeemed'
                        }
                        var filter = {
                            transactionId: transactionToRedeem.transactionId
                        }
                        //update the balance for the client
                        Transaction.findOneAndUpdate(filter, update, {
                            new: true
                        }).then((redeemedTransaction) => {
                            console.log('Transaction Redeemed Successfully')
                            var status = 'success'
                            //send client email
                            sendEmailFunction.sendEmailFunction(redeemedTransaction, res, status, redeemTransactionTemplate)
        
                        }).catch((err) => {
                            console.log(err)
                            console.log('An error occured while redeeming this transaction')
                        })
                    }

                    if (transactionToRedeem.transactionLeg = "FirstLeg") {
                        //debit the money from the wallet of first leg account holder and update customer account
                        var newFirstLegAccountBalance = +transactionToRedeem.balance - +transactionToRedeem.balance
                        var update = {
                            balance: newFirstLegAccountBalance,
                            status: 'redeemed'
                        }
                        var filter = {
                            transactionId: transactionToRedeem.transactionId
                        }

                        //update the balance for the client
                        Transaction.findOneAndUpdate(filter, update, {
                            new: true
                        }).then((redeemedTransaction) => {
                            console.log('Transaction Redeemed Successfully')
                            var status = 'success'
                            //send client email
                            sendEmailFunction.sendEmailFunction(redeemedTransaction, res, status, redeemTransactionTemplate.transactionSuccess)
        
                        }).catch((err) => {
                            console.log(err)
                            console.log('An error occured while redeeming this transaction')
                        })
                    }
                }).catch((err) => {
                    console.log(err)
                })
            }else{
                return res.json({
                    status: "FAILED",
                    message: "You cannot redeem this transaction!"
                })
            }
        });
    } catch(error) {
        console.log(err);
        return res.json({
            status: "FAILED",
            message: "An error Occurred!"
        })
    }
}

module.exports = {processRedeemTransaction}  