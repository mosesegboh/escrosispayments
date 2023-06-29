const express = require('express')
const router = express.Router()
const Transaction = require('./../models/Transaction')

router.post('/feedback', (req, res) => {
   console.log(req.body, 'this is the request body')

//    const test = {
//     "event": "transfer.completed",
//     "event.type": "Transfer",
//     "data": {
//       "id": 8416497,
//       "account_number": "******",
//       "bank_name": "ACCESS BANK NIGERIA",
//       "bank_code": "044",
//       "fullname": "John Doe",
//       "created_at": "2021-04-28T17:01:41.000Z",
//       "currency": "NGN",
//       "debit_currency": "NGN",
//       "amount": 100,
//       "fee": 10.75,
//       "status": "SUCCESSFUL",
//       "reference": "TX-refe123456-6-3-1",
//       "meta": null,
//       "narration": "Test for wallet to wallet",
//       "approver": null,
//       "complete_message": "Transaction was successful",
//       "requires_approval": 0,
//       "is_approved": 1
//     }
//   }

   const response = req.body

   const transactionId = response.txRef
   const email = response.customer.email
   const amount = response.amount
   const date = response.createdAt

    //if (response.status == "successful") {
    //find the details with transaction ID.
    //if transaction foung, update the transaction to successful
    Transaction.findOne({ transactionId: transactionId })
    .then(transaction => {
        if (transaction) {
            if (response.data.status == "SUCCESSFUL" || response.status == "success") {
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
            throw new Error("Transaction not found");
        }
    })
    .catch(error => {
        // Handle the error
        console.log(error);
    });
        //OLD CODE
        // const newTransaction = new Transaction({
        //     email,
        //     transactionId,
        //     amount,
        //     date,
        // })

        // newTransaction.save().then(result => {
        //     res.json({
        //         status: "SUCCESS",
        //         message: "Transaction saved successfully",
        //         data: result
        //     })
        // }).catch(err => {
        //     res.json({
        //         status: "FAILED",
        //         message: "An error occured with the payment gateway"
        //     })
        // })
//    }else{
        //OLD CODE
        // res.json({
        //     status: "FAILED",
        //     message: "This transaction could not be completed at this time"
        // })
//    }
})

module.exports = router