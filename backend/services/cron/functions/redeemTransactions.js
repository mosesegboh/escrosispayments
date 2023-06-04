require('dotenv').config({ path: '../../../.env' })
const mongoose = require('mongoose');
const Transaction = require('../../../models/Transaction')
const sendEmailFunction = require('../../email/functions/sendEmailFunction')
const redeemTransactionTemplate = require('../../email/templates/transactionRedemptionTemplate')

const redeemTransaction = async  () => {
    try {
        mongoose.connect(process.env.MONGODB_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        }).then(()=>{
            console.log('Connected to db')
        }).catch((err)=>console.log(err))
    
        let transactions = await Transaction.find({})
        transactions.forEach((transaction) => { 
          console.log(transaction); 
          var currentDate = new Date()
          // transactionsToRedeem = []
          if (transaction.transactionDate == currentDate){
            //switch the transactions here
            if (transaction.status == 'locked') {
              //find the transaction Id again
              Transaction.find({transactionId: transaction.transactionId, secondLegTransactionId: transaction.transactionId})
              .then((transactionsToRedeem) => { 
                if (transactionsToRedeem.length > 1) {
                  //move data udate and send email
                  transactionsToRedeem.forEach((transactionToRedeem) => {
                    //second Leg should be hte seller normally
                    if (transactionToRedeem.transactionLeg = "SecondLeg") {
                      //credit the money to the second leg account holder and update customer account
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
                  })
                }else{
                    console.log('Something went wrong in transaction first leg')
                }
              }).catch((err) => {
                  console.log(err)
              })
            }
          }
        });
        } catch(error) {
          console.log(err);
        }
}

module.exports = {redeemTransaction}