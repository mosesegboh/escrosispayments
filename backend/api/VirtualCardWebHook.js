const express = require('express')
const router = express.Router()
const Transaction = require('./../models/Transaction')
const {sendFundCardSuccessfulEmail} = require('../services');


router.post('/virtualcardfeedback', (req, res) => {
   console.log(req.body, 'this is the request body')

   const test = {
    "transactionId": 777,
    "merchantName": "APPLE/ITUNES",
    "description": "Termination",
    "status": "Successful",
    "balance": 10.0,
    "amount": 10.0,
    "type": "Termination",
    "cardId": "1a4664-***-3838382-***-sd399",
    "maskedPan": "405640******1123"
  }

   const response = req.body

   const transactionId = response.transactionId
   const email = response.customer.email
   const amount = response.amount
   const date = response.createdAt

    //if (response.status == "successful") {
    //find the details with transaction ID.
    //if transaction foung, update the transaction to successful
    Transaction.findOne({ transactionId: transactionId })
    .then(transaction => {
        if (transaction) {
            if (response.data.status == "SUCCESSFUL" || response.status == "success" || response.status == "Successful") {
                transaction.status = "successful";
                transaction.virtualCardEvent = req.body

                //send success email
            }else{
                transaction.status = "failed";
                transaction.balance = +transaction.balance + +transaction.amount
            }
            
            return transaction.save();
        } else {
            throw new Error("Transaction not found");
        }
    })
    .catch(error => {
        // Handle the error
        console.log(error);
    });
})

module.exports = router