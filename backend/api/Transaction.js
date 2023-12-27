const express = require('express')
const router = express.Router()
const Transaction = require('./../models/Transaction')
const {authMiddleware} = require("../middleware/authMiddleware")
const {authenticateTokenMiddleware} = require("../middleware/authenticateTokenMiddleware")
const {processTransfers} = require('../functions/transactions/processTransfers')
const {processVirtualCards} = require('../functions/transactions/processVirtualCards')
const {processSearchSecondLeg} = require('../functions/transactions/processSearchSecondLeg')
const {processSwapCurrency} = require('../functions/transactions/processSwapCurrency')
const {processAddFundsToWallet} = require('../functions/transactions/processAddFundsToWallet')
const {processBillPayment} = require('../functions/transactions/processBillPayment')
const {processEscrow} = require('../functions/transactions/processEscrow')
const {processPayments} = require('../functions/transactions/processPayments')

router.post('/add-transaction',  authMiddleware, authenticateTokenMiddleware, async  (req, res) => {
    
    let { transactionName } = req.body 
    // console.log(transactionName, '--transaction name')
    // return
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

    if (transactionName == 'billPayment') {
        processBillPayment( req.body, res)
        return
    }

    if (transactionName == 'escrow') {
        processEscrow( req.body, res)
        return
    }

    if (receivepayments == 'receivepayments') {
        processPayments(req.body, res)
    }
})

router.post('/test-api', (req, res) => {

    if (req.query.module = 'airtime-success') {
        console.log('i was here ppp')
        return res.json({
            "status": "success",
            "message": "Bill status fetch successful",
            "data": {
                "currency": "NGN",
                "customer_id": "2348109728098",
                "frequency": "One Time",
                "amount": "500.0000",
                "product": "AIRTIME",
                "product_name": "MTN",
                "commission": 15,
                "transaction_date": "2022-06-07T10:59:40.72Z",
                "country": "NG",
                "tx_ref": "CF-FLYAPI-20220607105940408290", 
                "extra": null,
                "product_details": "FLY-API-NG-AIRTIME-MTN",
                "status": "successful",
                "code": "200"
            }
        })
        
    }
})

router.post('/get-transactions', authMiddleware, authenticateTokenMiddleware, (req, res) => {
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

router.get('/get-transaction', authMiddleware, authenticateTokenMiddleware, (req, res) => {
    
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