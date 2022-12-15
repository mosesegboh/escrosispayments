const express = require('express')
const router = express.Router()
const config = require('config')
const Transaction = require('./../models/Transaction')
// const mongoose = require('mongoose')
// const ObjectID = require('mongodb')

// const jwt = require('jsonwebtoken')

// const User = require('./../models/User')
// const UserVerification = require('./../models/UserVerification')
// const UserOTPVerification = require('./../models/UserOTPVerification')
// const sendVerificationEmail = require('../services/index')
// const nodemailer = require('nodemailer')

router.post('/feedback', (req, res) => {
   console.log('i was hit o', 'this is a text')
   console.log(req.body, 'this is the request body')

   const response = req.body
   if(response.status == "successful"){
    const transactionId = response.txRef
    const email = response.customer.email
    const amount = response.amount
    const date = response.createdAt
    const status = 'open'
    //insert data into the database
    const newTransaction = new Transaction({
        email,
        transactionId,
        amount,
        date,
        status,
    })

    newTransaction.save().then(result => {
        // const status = "success"
        // emailFunction.sendTransactionCompleteEmail(result, res, status)
        res.json({
            status: "SUCCESS",
            message: "Transaction saved successfully",
            data: result
        })
    }).catch(err => {
        // emailFunction.sendTransactionCompleteEmail(result, res, 'failed')
        res.json({
            status: "FAILED",
            message: "An error occured with the payment gateway"
        })
    })  //send confirmation email
   }else{
    res.json({
        status: "FAILED",
        message: "This transaction could not be completed at this time"
    })
   }
})

module.exports = router