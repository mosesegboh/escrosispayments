const express = require('express')
const router = express.Router()
const Transaction = require('./../models/Transaction')
const authMiddleware = require("../middleware/authMiddleware")
const authenticateTokenMiddleware = require("../middleware/authenticateTokenMiddleware")
const emailFunction = require('../services');
const updateCustomerLockedBalance = require('../functions/transactions/Transactions')
const nodemailer = require('nodemailer')

//sign up
router.post('/add-transaction',  authMiddleware.authMiddleware, authenticateTokenMiddleware.authenticateTokenMiddleware, async  (req, res) => {
    
    let {email, transactionId, transactionDate, amount, transactionType, date, details, secondLegTransactionId, lockedTransaction, unLockedTransaction, status} = req.body

    if (email == null || transactionDate == null, transactionId == null || amount == null || transactionType == null || date==null || details == null){
        res.json({
            status: "FAILED",
            message: "Empty input fields"
        })
    }

    email = email.trim()
    transactionDate = transactionDate.trim()
    transactionId = transactionId.trim()
    amount = amount.trim()
    transactionType = transactionType.trim()
    date = date.trim()
    details = details.trim()
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
    
    //validation
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
    } else if (secondLegTransactionId && !/^[a-zA-Z0-9 ]*$/.test(secondLegTransactionId) && secondLegTransactionId == null) {
        res.json({
            status: "FAILED",
            message: "Invalid second transaction Id"
        })
    } else {    //get the latest balance for this particular user
        const newLockedTransactionBalanceValue = await Transaction.find({}).sort({_id: -1}).limit(1)
        .then((transaction)=>{
            const currentlockedTransactionBalance = transaction[0].lockedTransaction ? transaction[0].lockedTransaction : 0.00
            const currentUnlockedTransactionBalance = transaction[0].unLockedTransaction ?  transaction[0].unLockedTransaction : 0.00
            const currentBalance = transaction[0].balance ? transaction[0].balance : 0.00
            return [currentlockedTransactionBalance, currentUnlockedTransactionBalance, currentBalance]
        })

        // if (transactionType == "Secondleg"){
        //     var transactionToUpdate = await Transaction.find({"Transaction.transactionId": secondLegTransactionId})
        //     .then((result) => { 
        //         const newTransactionToUpdate = result[0] ? result[0]  : 0.00
        //         return newTransactionToUpdate
        //     })
        // }

        // if(transactionType == "Secondleg" && transactionToUpdate.status == "locked") {
        //     return res.json({
        //         status: "FAILED",
        //         message: "the transaction has already being locked"
        //     })
        // }
        // console.log(newLockedTransactionBalanceValue[1])
        // return res.json({
        //     status: "FAILED",
        //     message: "debug error"
        // })
        //if validation passed proceed by checking if the user already exist in the database
        // Transaction.find({ transactionId }).then(result => {
            // if(result.length){
                    // res.json({
                    //     status: "FAILED",
                    //     message: "Transaction Already exists in the database"
                    // })
                // }else{
                if (transactionType == "FirstLeg"){
                    unLockedTransaction = updateCustomerLockedBalance.updateCustomerLockedBalance(newLockedTransactionBalanceValue[1], amount)
                    lockedTransaction = newLockedTransactionBalanceValue[0]
                    status = 'open'

                    console.log(lockedTransaction, unLockedTransaction, 'this is the locked and unlocked transaction')
                    const balance = newLockedTransactionBalanceValue[2]

                    const filter = { transactionId:  transactionId};
                    const update = { 
                        lockedTransaction: lockedTransaction,
                        unLockedTransaction: unLockedTransaction,
                        transactionDate: transactionDate,
                        transactionType: transactionType,
                        transactionLeg: transactionType,
                        details: details,
                        // secondLegTransactionId: secondLegTransactionId,
                        balance: balance
                    };

                    Transaction.findOneAndUpdate(filter, update, {
                        new: true
                      }).then(result => {
                        console.log(result, 'this is the found result')
                        if(result){
                            const status = "success"
                            //send email
                            emailFunction.sendTransactionCompleteEmail(result, res, status)
                            //return response
                            res.json({
                                status: "SUCCESS",
                                message: "The transaction has been saved successfully"
                            })
                        }
                    }).catch(err => {
                        const status = "failed"
                        emailFunction.sendTransactionCompleteEmail(result, res, 'failed')
                        console.log(err)
                        res.json({
                            status: "FAILED",
                            message: "An error occured, while completing the transaction"
                        })
                    })
                }

                if (transactionType == "SecondLeg"){

                    var transactionToUpdate = await Transaction.find({"Transaction.transactionId": secondLegTransactionId})
                    .then((result) => { 
                        const newTransactionToUpdate = result[0] ? result[0]  : 0.00
                        return newTransactionToUpdate
                    }).catch((err) => {
                        console.log(err)
                    })

                    if( transactionToUpdate.status == "locked") {
                        return res.json({
                            status: "FAILED",
                            message: "the transaction has already being locked"
                        })
                    }


                    const filter = { transactionId: secondLegTransactionId };
                    const update = { 
                                    status: 'locked',
                                    lockedTransaction: +amount + +transactionToUpdate.lockedTransaction,
                                    unLockedTransaction: +transactionToUpdate.unLockedTransaction - +amount,
                                    secondLegTransactionId: secondLegTransactionId
                                };
                    //update the transaction and exit
                    Transaction.findOneAndUpdate(filter, update).then(result => {
                        if(result){
                            const status = "success"
                            //send email
                            emailFunction.sendTransactionLockedEmail(result, res, status)
                            //return response
                            res.json({
                                status: "SUCCESS",
                                message: "The transaction has been locked successfully"
                            })
                        }
                    }).catch(err => {
                        const status = "failed"
                            //send email
                            emailFunction.sendTransactionLockedEmail(result, res, status)
                        console.log(err)
                        res.json({
                            status: "FAILED",
                            message: "An error occured, while locking the transaction"
                        })
                    })
                }
                
                // else{
                //     //i need to make an update here
                //     balance = newLockedTransactionBalanceValue[2]

                //     const filter = { transactionId:  transactionId};
                //     const update = { 
                //         lockedTransaction: lockedTransaction,
                //         unLockedTransaction: unLockedTransaction,
                //         transactionDate: transactionDate,
                //         transactionType: transactionType,
                //         details: details,
                //         secondLegTransactionId: secondLegTransactionId,
                //         balance
                //     };

                //     Transaction.findOneAndUpdate(filter, update).then(result => {
                //         console.log()
                //         if(result){
                //             const status = "success"
                //             //send email
                //             emailFunction.sendTransactionLockedEmail(result, res, status)
                //             //return response
                //             res.json({
                //                 status: "SUCCESS",
                //                 message: "The transaction has been saved successfully"
                //             })
                //         }
                //     }).catch(err => {
                //         const status = "failed"
                //         emailFunction.sendTransactionCompleteEmail(result, res, 'failed')
                //         console.log(err)
                //         res.json({
                //             status: "FAILED",
                //             message: "An error occured, while completing the transaction"
                //         })
                //     })
                //     // balance = newLockedTransactionBalanceValue[2]
               
                //     // const newTransaction = new Transaction({
                //     //     email,
                //     //     transactionDate,
                //     //     transactionId,
                //     //     amount,
                //     //     transactionType,
                //     //     date,
                //     //     details,
                //     //     status,
                //     //     secondLegTransactionId,
                //     //     lockedTransaction,
                //     //     unLockedTransaction,
                //     //     balance
                //     // })

                //     // newTransaction.save().then(result => {
                //     //     const status = "success"
                //     //     emailFunction.sendTransactionCompleteEmail(result, res, status)
                //     //     res.json({
                //     //         status: "SUCCESS",
                //     //         message: "Transaction saved successfully",
                //     //         data: result
                //     //     })
                //     // }).catch(err => {
                //     //     emailFunction.sendTransactionCompleteEmail(result, res, 'failed')
                //     //     res.json({
                //     //         status: "FAILED",
                //     //         message: "An error occured while saving transaction"
                //     //     })
                //     // })
                // }
            // }
        // }).catch(err => {
        //     console.log(err)
        //     res.json({
        //         status: "FAILED",
        //         message: "An error occured"
        //     })
        // })
    }
})

//sign in
router.post('/get-transactions', authMiddleware.authMiddleware, authenticateTokenMiddleware.authenticateTokenMiddleware, (req, res) => {
    
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

//get transaction
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