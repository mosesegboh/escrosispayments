const express = require('express')
const router = express.Router()
const User = require('./../models/User')
const {authMiddleware} = require("../middleware/authMiddleware")
const {authenticateTokenMiddleware} = require("../middleware/authenticateTokenMiddleware")
const {processPayments} = require('../functions/transactions/processPayments')

router.get('/get-payment', (req, res) => {
    // console.log('i was hit just now')
    let {email, transactionId} = req.query
    email = email.trim()
    transactionId = transactionId.trim()
    req.io.sockets.emit('paymentData', { email, transactionId });
    res.redirect(`http://localhost:3001/?email=${email}&transactionId=${email}`);
    // return res.json({message: 'i broadcasted the message'})
})

module.exports = router