const express = require('express')
const router = express.Router()
const Transaction = require('./../models/Transaction')

router.post('/callback', (req, res) => {
   console.log(req.body, 'this is the request body')

   const response = req.body

   if (response.status == "success") {
    const transactionId = response.txRef
    const email = response.customer.email
    const amount = response.amount
    const date = response.createdAt

    const newTransaction = new Transaction({
        email,
        transactionId,
        amount,
        date,
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
            message: "An error occured with the payment gateway"
        })
    })
   }else{
        res.json({
            status: "FAILED",
            message: "This transaction could not be completed at this time"
        })
   }
})

module.exports = router