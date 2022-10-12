const express = require('express')
const router = express.Router()

//User model
const Transaction = require('./../models/Transaction')
const authMiddleware = require("../middleware/authMiddleware")
const authenticateTokenMiddleware = require("../middleware/authenticateTokenMiddleware")

//password hashing
// const bcrypt = require('bcrypt')

//sign up
router.post('/add-transaction',  authMiddleware.authMiddleware, authenticateTokenMiddleware.authenticateTokenMiddleware,  (req, res) => {
    let {email, transactionId, amount, transactionType, date, details, secondLegTransactionId} = req.body


    // console.log(email);

    email = email.trim()
    transactionId = transactionId.trim()
    amount = amount.trim()
    transactionType = transactionType.trim()
    date = date.trim()
    details = details.trim()
    secondLegTransactionId = secondLegTransactionId.trim()

    // console.log(email)
    //validation
    if (email == "" || transactionId == "" || amount == "" || transactionType == "" || date=="" || details == ""){
        res.json({
            status: "FAILED",
            message: "Empty input fields"
        })
    } 
    
    // else if (!/^[a-zA-Z0-9@ ]*$/.test(email)) {
    //     res.json({
    //         status: "FAILED",
    //         message: "Invalid email"
    //     })
    // } 
    else if (!/^[a-zA-Z0-9 ]*$/.test(transactionId)) {
        res.json({
            status: "FAILED",
            message: "Invalid transactionId"
        })
    } else if (Number.isInteger(amount)) {
        res.json({
            status: "FAILED",
            message: "Invalid Amount"
        })
    // } else if (!/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/.test(transactionType)) {
    } else if (!/^[a-zA-Z ]*$/.test(transactionType)) {
        res.json({
            status: "FAILED",
            message: "Invalid transactionType"
        })
    } else if (!new Date(date).getTime()){
        res.json({
            status: "FAILED",
            message: "Invalid transation date entered"
        })
    } else if (!/^[a-zA-Z ]*$/.test(details)) {
        res.json({
            status: "FAILED",
            message: "Invalid details"
        })
    } else if (!/^[a-zA-Z0-9 ]*$/.test(secondLegTransactionId) && secondLegTransactionId == null) {
        res.json({
            status: "FAILED",
            message: "Invalid second transaction Id"
        })
    } else {
        console.log(email)
        //if validation passed proceed by checking if the user already exist in the database
        Transaction.find({ transactionId }).then(result => {
            if(result.length){
                res.json({
                    status: "FAILED",
                    message: "Transaction Already exists in the database"
                })
            }else{

                
                //create the user

                //password handling
                // const saltRounds = 10
                // bcrypt.hash(password, saltRounds).then(hashedPassword => {
                    //if password is hashed successfully
                    // console.log(email)
                    const newTransaction = new Transaction({
                        email,
                        transactionId,
                        amount,
                        transactionType,
                        // password: hashedPassword,
                        date,
                        details,
                        secondLegTransactionId
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
                // }).catch(err => {
                //     res.json({
                //         status: "FAILED",
                //         message: "AN error occured during password hashing"
                //     })
                // })
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
router.get('/get-transactions', authMiddleware.authMiddleware, authenticateTokenMiddleware.authenticateTokenMiddleware, (req, res) => {
    
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

module.exports = router