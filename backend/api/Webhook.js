const express = require('express')
const router = express.Router()
const Transaction = require('./../models/Transaction')

router.post('/feedback', (req, res) => {
   console.log(req.body, 'this is the request body')

   const response = req.body
   const transactionId = response.txRef
   const status = response.status
   const eventType = response['event.type']

//    console.log(response, '---this is web hook---')
//    console.log(status, '---this is response status---')
//    console.log(response['event.type'], '---this is event type---')
   
    Transaction.findOne({ transactionId: transactionId })
    .then(transaction => {
        if (transaction) {
            if (eventType == 'CARD_TRANSACTION' || status == "successful") {
                transaction.status = "successful";
                transaction.balance = +transaction.balance + +transaction.amount
            }
            // else if (transaction.transactionName == "wallet") {
            //     transaction.balance = +transaction.balance + +transaction.amount
            // } 
            // else {
            //     transaction.status = "failed";
            //     transaction.balance = +transaction.balance + +transaction.amount
            // }
            return transaction.save();
        } else {
            throw new Error("Transaction not found")
        }
    })
    .catch(error => {
        console.log(error)
    })
})

module.exports = router