const express = require('express')
const router = express.Router()
const Transaction = require('./../models/Transaction')
const authMiddleware = require("../middleware/authMiddleware")
const authenticateTokenMiddleware = require("../middleware/authenticateTokenMiddleware")
const emailFunction = require('../services');
const updateCustomerLockedBalance = require('../functions/transactions/Transactions')
const {processTransfers} = require('../functions/transactions/processTransfers')
const {processVirtualCards} = require('../functions/transactions/processVirtualCards')
const {processSearchSecondLeg} = require('../functions/transactions/processSearchSecondLeg')
const {processSwapCurrency} = require('../functions/transactions/processSwapCurrency')
const {processAddFundsToWallet} = require('../functions/transactions/processAddFundsToWallet')

router.post('/add-transaction',  authMiddleware.authMiddleware, authenticateTokenMiddleware.authenticateTokenMiddleware, async  (req, res) => {
    
    let {email, 
        transactionId,
        transactionDate, 
        amount, 
        transactionType, 
        date, 
        details, 
        secondLegTransactionId, 
        lockedTransaction, 
        unLockedTransaction, 
        status,
        transactionName,
        transactFromWallet,
        transactFromAddedFunds,
        secondPartyEmail,
        secondPartyPhone
    } = req.body
    // console.log(transactionName, '--transaction name')
    // return

    // const searchQuery = req.query.searchSecondLeg
    if (transactionName == 'transfer') {
        processTransfers( req.body, res)
        return
    }

    if (transactionName == 'virtualcards') {
        processVirtualCards( req.body, res)
        return
    }

    if (transactionName == 'swapcurrency') {
        processSwapCurrency( req.body, res)
        return
    }

    if (transactionName == 'wallet') {
        processAddFundsToWallet( req.body, res)
        return
    }

    console.log('here 22222')

    if (email == null 
        || transactionDate == null 
        || transactionId == null 
        || amount == null 
        || transactionType == null 
        || date == null 
        || details == null 
        || transactionName == null
        ){
        res.json({
            status: "FAILED",
            message: "Please enter all input fields"
        })
    }

    email = email.trim()
    transactionDate = transactionDate.trim()
    transactionId = transactionId.trim()
    amount = amount.trim()
    transactionType = transactionType.trim()
    date = date.trim()
    details = details.trim()
    transactionName = transactionName.trim()
    if (secondLegTransactionId) {
        secondLegTransactionId = secondLegTransactionId.trim()
    }
    if (lockedTransaction) {
        lockedTransaction = lockedTransaction.trim()
    }
    if (unLockedTransaction) {
        unLockedTransaction = unLockedTransaction.trim()
    }
    if (status) {
        status = status.trim()
    }
    if (transactFromWallet) {
        transactFromWallet = transactFromWallet.trim()
    }
    if (transactFromAddedFunds) {
        transactFromAddedFunds = transactFromAddedFunds.trim()
    }
    if (secondPartyEmail) {
        secondPartyEmail = secondPartyEmail.trim()
    }
    if (secondPartyPhone) {
        secondPartyPhone = secondPartyPhone.trim()
    }

    if (!new Date(transactionDate).getTime()) {
        res.json({
            status: "FAILED",
            message: "Invalid transaction date entered"
        })
    } else if (/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w {2, 3})+$/.test(email)) {
        res.json({
            status: "FAILED",
            message: "Invalid email"
        })
    } else if (!/^[a-zA-Z0-9 ]*$/.test(transactionId)) {
        res.json({
            status: "FAILED",
            message: "Invalid transactionId"
        })
    } else if (Number.isInteger(amount)) {
        res.json({
            status: "FAILED",
            message: "Invalid Amount"
        })
    } else if (!/^[a-zA-Z ]*$/.test(transactionType)) {
        res.json({
            status: "FAILED",
            message: "Invalid transactionType"
        })
    } else if (!new Date(date).getTime()){
        res.json({
            status: "FAILED",
            message: "Invalid maturity date entered"
        })
    } else if (!/^[a-zA-Z ]*$/.test(details)) {
        res.json({
            status: "FAILED",
            message: "Invalid details"
        })
    } else if (!/^[a-zA-Z ]*$/.test(transactionName)) {
        res.json({
            status: "FAILED",
            message: "Invalid details"
        })
    }  else if (secondLegTransactionId && !/^[a-zA-Z0-9 ]*$/.test(secondLegTransactionId) && secondLegTransactionId == null) {
        res.json({
            status: "FAILED",
            message: "Invalid second transaction Id"
        })
    } else { 
            const newLockedTransactionBalanceValue = await Transaction.find({"Transaction.email": email}).sort({_id: -1}).limit(2)
            .then((transaction)=>{
                const currentlockedTransactionBalance = transaction[1].lockedTransaction ? transaction[1].lockedTransaction : 0.00
                const currentUnlockedTransactionBalance = transaction[1].unLockedTransaction ?  transaction[1].unLockedTransaction : 0.00
                var currentBalance = transaction[1].balance ? transaction[1].balance : 0.00
                if(transactFromWallet == "yes"){
                    // console.log('inside the here')
                    var currentBalance = transaction[0].balance ? transaction[0].balance : 0.00
                }

                if (currentBalance == 0 && transactionName !== "wallet") {
                    var proceed = false
                    res.json({
                        status: "FAILED",
                        message: "You do not have enough funds to carry out this transaction. Please add funcds to your wallet"
                    })
                }else if (transactionType == "SecondLeg" && transactFromAddedFunds == "no") {
                    proceed == false
                }else{
                    var proceed = true
                }
                return [currentlockedTransactionBalance, currentUnlockedTransactionBalance, currentBalance, proceed]
            })
        

        if (transactionType == "FirstLeg"){
            //get variables to update
            unLockedTransaction = updateCustomerLockedBalance.updateCustomerLockedBalance(newLockedTransactionBalanceValue[1], amount)
            lockedTransaction = newLockedTransactionBalanceValue[0]
            status = 'open'
            const balance = newLockedTransactionBalanceValue[2]

            //filter variables
            var filter = { transactionId:  transactionId};
            var update = { 
                lockedTransaction: lockedTransaction,
                unLockedTransaction: unLockedTransaction,
                transactionDate: transactionDate,
                transactionType: transactionType,
                transactionLeg: transactionType,
                secondPartyEmail: secondPartyEmail,
                secondPartyPhone: secondPartyPhone,
                details: details,
                status: status,
                balance: +balance - +amount
            };
        }

        if (transactionType == "SecondLeg"){
            console.log(secondLegTransactionId, 'right track')
            //get update variables
            var transactionToUpdate = await Transaction.find({transactionId: secondLegTransactionId})
            .then((result) => { 
                const newTransactionToUpdate = result[0] ? result[0]  : 0.00
                return newTransactionToUpdate
            }).catch((err) => {
                console.log(err)
            })

            const balance = newLockedTransactionBalanceValue[2]
            if( transactionToUpdate.status == "locked") {
                return res.json({
                    status: "FAILED",
                    message: "the transaction has already being locked"
                })
            }

            //filter variable
            var filter = { transactionId: transactionId };
            var update = {
                transactionId: transactionId,
                status: 'locked',
                lockedTransaction: +amount + +transactionToUpdate.lockedTransaction,
                unLockedTransaction: +transactionToUpdate.unLockedTransaction - +amount,
                secondLegTransactionId: secondLegTransactionId,
                transactionName: transactionName,
                transactionType: transactionName,
                balance: +balance - +amount,
                amount: amount,
                email: email,
                date: date,
                transactionDate: transactionDate,
                details: details,
                transactFromWallet: transactFromWallet
            };

            if (transactFromAddedFunds == "no"){
                // console.log(update, '-wrong track 1')
                const newTransaction = new Transaction(update)
                newTransaction.save()
                .then(result => {
                    if (result) {
                        const status = "success"
                        console.log(result, status)
                        // console.log(result, '-result i got inside here')
                        emailFunction.sendTransactionLockedEmail(result, res, status)
                        emailFunction.sendFirstLegSecondPartyTransactionSuccess(result, res, status)
                        res.json({
                            status: "SUCCESS",
                            message: "Your transaction has been successfuly locked"
                        })
                    }
                }).catch(err => {
                    console.log(err)
                    res.json({
                        status: "FAILED",
                        message: "AN error occured while saving user"
                    })
                })
                return
            } 
        }

        // if (transactionName == 'wallet') {
        //     //filter variable
        //     const balance = newLockedTransactionBalanceValue[2]
        //     var filter = { transactionId: transactionId };
        //     var update = { 
        //         balance: +balance + +amount,
        //         transactionName: transactionName,
        //         amount: amount,
        //         details: "Add funds To Wallet"
        //     };    
        // }

        if (transactionName == 'airtime') {
            //filter variable
            const balance = newLockedTransactionBalanceValue[2]
            var filter = { transactionId: transactionId };
            var update = { 
                balance: +balance - +amount,
                transactionName: transactionName,
                amount: amount,
                details: "Purchase Of Airtime"
            };    
        }

        if (newLockedTransactionBalanceValue[3]) {
            if (transactFromWallet == "yes"){
                console.log(update, '-wrong track 2')
                update.transactionId = transactionId;
                update.amount = amount;
                update.email = email;
                
                const newTransaction = new Transaction(update)
                newTransaction.save()
                .then(result => {
                    if (result) {
                        const status = "success"
                        emailFunction.sendTransactionCompleteEmail(result, res, status)
                        res.json({
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
                //balance will remain thesame if you are doing from added funds
                if(transactFromAddedFunds == "yes"){
                    update.balance = newLockedTransactionBalanceValue[2]
                }
                // Transaction.findOneAndUpdate(filter, update, {
                //     new: true
                const newWalletTransaction = new Transaction(update)
                newWalletTransaction.save()
                .then(result => {
                        console.log(result, '<-result, right track')
                    if (result){
                        const status = "pending"

                        if (transactionType == "FirstLeg") {
                            emailFunction.sendTransactionLockedEmail(result, res, status)
                            emailFunction.sendFirstLegSecondPartyTransactionSuccess(result, res, status)
                            var message = "The transaction has been saved successfully"
                        }

                        if (transactionType == "SecondLeg") {
                            emailFunction.sendTransactionLockedEmail(result, res, status)
                            var message = "The transaction has been locked successfully"
                        }

                        if (transactionType == "wallet") {
                            emailFunction.sendAddWalletSuccessfulEmail(result, res, status)
                            var message = "Wallet has been updated successfully"
                        }
                        
                        res.json({
                            status: "SUCCESS",
                            message: message
                        })
                    }else{
                        res.json({
                            status: "FAILED",
                            message: "The transaction could not be completed - API"
                        })
                    }
                }).catch(err => {
                    const status = "failed"
                    var result = {}
            
                    emailFunction.sendTransactionLockedEmail(result, res, status)
                    console.log(err)
                    res.json({
                        status: "FAILED",
                        message: "An error occured, while locking the transaction"
                    })
                })
            }
        }      
    }
})

router.post('/get-transactions', authMiddleware.authMiddleware, authenticateTokenMiddleware.authenticateTokenMiddleware, (req, res) => {
    // console.log('i was here')

    if (req.query.searchSecondLeg) {
        // console.log('i was here')
        processSearchSecondLeg(req.query.searchSecondLeg, res)
        return
    }
    
    let {email} = req.body

    email = email.trim()

    if (email == ""){
        res.json({
            status: "FAILED",
            message: "Empty credentials"
        })
    } else {
        Transaction.find({email}).then(data => {
            if (!data) {
                res.json({
                    status: "FAILED",
                    message: "There is no transaction available"
                })
            }else{
                res.json({
                    status: "SUCCESS",
                    data: data  
                })
            }    
        }).catch(err => {
            res.json({
                status: "FAILED",
                message: "An error has occurred"
            })
        })
    }
})

router.get('/get-transaction', authMiddleware.authMiddleware, authenticateTokenMiddleware.authenticateTokenMiddleware, (req, res) => {
    
    let {email, transactionId} = req.body

    email = email.trim()
    transactionId = transactionId.trim()

    if (email == ""){
        res.json({
            status: "FAILED",
            message: "Empty email"
        })
    }else if(transactionId == "") {
        res.json({
            status: "FAILED",
            message: "Empty transactionId"
        })
    } else {
        Transaction.find({transactionId}).then(data => {
            if (!data) {
                res.json({
                    status: "FAILED",
                    message: "There is no transaction available"
                })
            }else{
                res.json({
                    status: "SUCCESS",
                    data: data  
                })
            }    
        }).catch(err => {
            res.json({
                status: "FAILED",
                message: "An error has occurred"
            })
        })
    }
})

module.exports = router