const express = require('express')
const router = express.Router()
const Transaction = require('./../models/Transaction')
const authMiddleware = require("../middleware/authMiddleware")
const authenticateTokenMiddleware = require("../middleware/authenticateTokenMiddleware")

router.post('/add-to-wallet',  authMiddleware.authMiddleware, authenticateTokenMiddleware.authenticateTokenMiddleware, async (req, res) => {
    let {email, transactionId, transactionDate, amount, walletBalance} = req.body

    email = email.trim()
    transactionDate = transactionDate.trim()
    transactionId = transactionId.trim()
    amount = amount.trim()
    walletBalance = walletBalance.trim()

    if (email == "" || transactionDate == "", transactionId == "" || amount == ""){
        res.json({
            status: "FAILED",
            message: "Please enter all input field"
        })
    }else if (!new Date(transactionDate).getTime()) {
        res.json({
            status: "FAILED",
            message: "Invalid transaction date entered"
        })
    }else if (!/^[a-zA-Z0-9 ]*$/.test(transactionId)) {
        res.json({
            status: "FAILED",
            message: "Invalid transactionId"
        })
    } else if (Number.isInteger(amount)) {
        res.json({
            status: "FAILED",
            message: "Invalid Amount"
        })
    }else if (Number.isInteger(walletBalance)) {
        res.json({
            status: "FAILED",
            message: "Invalid Wallet Balance"
        })
    }else if (!new Date(date).getTime()){
        res.json({
            status: "FAILED",
            message: "Invalid date entered"
        })
    } else {
        //find the last transaction entereed by the user
        const userWalletBalance = await Wallet.find({"Wallet.email": email}).sort({_id: -1}).limit(1)
        .then((result)=>{
                // const previousUserWalletBalance = result.walletBalance
                const newUserWalletBalance = +result.walletBalance + +amount
        }).catch((error)=>{
            console.log(error)
            res.json({
                status: "FAILED",
                message: "An error occured in retrieving wallet"
            })
        })

        Transaction.find({ transactionId }).then(result => {
            if(result.length){
                res.json({
                    status: "FAILED",
                    message: "Transaction Already exists in the database"
                })
            }else{
                const newTransaction = new Transaction({
                    email,
                    transactionDate,
                    transactionId,
                    amount,
                    walletBalance
                })

                newTransaction.save().then(result => {
                    res.json({
                        status: "SUCCESS",
                        message: "Transaction saved successfully",
                        data: result
                    })
                }).catch(err => {
                    res.json({
                        status: "FAILED",
                        message: "An error occured while saving transaction"
                    })
                })
            }
        }).catch(err => {
            console.log(err)
            res.json({
                status: "FAILED",
                message: "AN error occured"
            })
        })
    }
})

//sign in
// router.get('/get-transactions', authMiddleware.authMiddleware, authenticateTokenMiddleware.authenticateTokenMiddleware, (req, res) => {
    
//     let {email} = req.body

//     email = email.trim()

//     if (email == ""){
//         res.json({
//             status: "FAILED",
//             message: "Empty credentials"
//         })
//     } else {
//         Transaction.find({email}).then(data => {
//             if (!data) {
//                 res.json({
//                     status: "FAILED",
//                     message: "There is no transaction available"
//                 })
//             }else{
//                 res.json({
//                     status: "SUCCESS",
//                     data: data  
//                 })
//             }    
//         }).catch(err => {
//             res.json({
//                 status: "FAILED",
//                 message: "An error has occurred"
//             })
//         })
//     }
// })


//get transaction
// router.get('/get-transaction', authMiddleware.authMiddleware, authenticateTokenMiddleware.authenticateTokenMiddleware, (req, res) => {
    
//     let {email, transactionId} = req.body

//     email = email.trim()
//     transactionId = transactionId.trim()

//     if (email == ""){
//         res.json({
//             status: "FAILED",
//             message: "Empty email"
//         })
//     }else if(transactionId == "") {
//         res.json({
//             status: "FAILED",
//             message: "Empty transactionId"
//         })
//     } else {
//         Transaction.find({transactionId}).then(data => {
//             if (!data) {
//                 res.json({
//                     status: "FAILED",
//                     message: "There is no transaction available"
//                 })
//             }else{
//                 res.json({
//                     status: "SUCCESS",
//                     data: data  
//                 })
//             }    
//         }).catch(err => {
//             res.json({
//                 status: "FAILED",
//                 message: "An error has occurred"
//             })
//         })
//     }
// })

module.exports = router