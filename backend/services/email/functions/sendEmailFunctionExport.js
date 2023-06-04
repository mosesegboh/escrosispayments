const transferTemplate = require('../templates/transferTemplate')
const nodemailer = require('nodemailer')
const success = require('../templates/billPaymentTemplate')
const failed = require('../templates/billPaymentTemplate')
// import {getProducts} from '../services';

let transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.AUTH_EMAIL,
        pass: process.env.AUTH_PASSWORD,
    }
})
  
transporter.verify((error, success) => {
    if(error) {
        console.log(error)
    }else{
        console.log('ready for messages')
        console.log(success)
    }
})

const sendEmailFunction  = async ({email, transactionId, date, amount, transactionType, details}, res, status, success, failed) => {
    try {
        if (status == "success"){
            var mailOPtions = { 
                from : process.env.AUTH_EMAIL,
                to: email,
                subject: success({email, transactionId, date, amount, transactionType, details})[0],
                html: success({email, transactionId, date, amount, transactionType, details})[1],
            }
        }

        if (status == "failed") {
            var mailOPtions = { 
                from : process.env.AUTH_EMAIL,
                to: email,
                subject: failed({email, transactionId, transactionDate, amount, transactionType, details})[0],
                html: failed({email, transactionId, transactionDate, amount, transactionType, details})[1],
            }
        }
        await transporter.sendMail(mailOPtions)
    } catch (error) {
        console.log(error.message, 'error from mail')
        return res.json({
            status: "FAILED",
            message: error.message,
        })
    }
}

module.exports = {sendEmailFunction}  