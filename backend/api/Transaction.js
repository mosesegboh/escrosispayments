const express = require('express')
const router = express.Router()

//User model
const Transaction = require('./../models/Transaction')

//password hashing
// const bcrypt = require('bcrypt')

//sign up
router.post('/add-transaction', (req, res) => {
    let {transactionId, amount, transactionType, date, details, secondLegTransactionId} = req.body

    transactionId = transactionId.trim()
    amount = amount.trim()
    transactionType = transactionType.trim()
    date = date.trim()
    details = details.trim()
    secondLegTransactionId = secondLegTransactionId.trim()

    //validation
    if (transactionId == "" || Amount == "" || transactionType == "" || date=="" || details == ""){
        res.json({
            status: "FAILED",
            message: "Empty input fields"
        })
    } else if (!/^[a-zA-Z ]*$/.test(transactionId)) {
        res.json({
            status: "FAILED",
            message: "Invalid transactionId"
        })
    } else if (Number.isInteger(Amount)) {
        res.json({
            status: "FAILED",
            message: "Invalid Amount"
        })
    } else if (!/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/.test(transactionType)) {
        res.json({
            status: "FAILED",
            message: "Invalid transactionType"
        })
    } else if (!new Date(dateOfBirth).getTime()){
        res.json({
            status: "FAILED",
            message: "Invalid transation date entered"
        })
    } else if (!/^[a-zA-Z ]*$/.test(details)) {
        res.json({
            status: "FAILED",
            message: "Invalid details"
        })
    } else if (!/^[a-zA-Z ]*$/.test(secondLegTransactionId) && secondLegTransactionId == null) {
        res.json({
            status: "FAILED",
            message: "Invalid second transaction Id"
        })
    } else {
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
                    const newTransaction = new Transaction({
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
router.get('/get-transactions', (req, res) => {
    let {email} = req.body

    email = email.trim()
    // password = password.trim()

    if(email == "" || password == ""){
        res.json({
            status: "FAILED",
            message: "Empty credentials"
        })
    }else {
        //check if the user exist in the database
        User.find({email}).then(data => {
            if (data.length){
                //User exists in the database

                const hashedPassword = data[0].password
                bcrypt.compare(password, hashedPassword).then(result => {
                    if (result) {
                        //password match
                        res.json({
                            status: "SUCCESS",
                            message: "Sign In successful",
                            data: data
                        })
                    }else {
                        res.json({
                            status: "FAILED",
                            message: "Invalid passsword entered",
                        })
                    }
                }).catch(err => {
                    res.json({
                        status: "FAILED",
                        message: "An error has occurred"
                    })
                })
            }else{
                res.json({
                    status: "FAILED",
                    message: "User does not exist"
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