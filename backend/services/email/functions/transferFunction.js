const transferTemplate = require('../templates/transferTemplate')
const nodemailer = require('nodemailer')

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

const sendTransferEmail = async ({email, transactionId, transactionDate, amount, transactionType, details}, res, status) => {
    try {
        if (status == "success"){
            var mailOPtions = { 
                from : process.env.AUTH_EMAIL,
                to: email,
                subject: transferTemplate.transferSuccess({email, transactionId, transactionDate, amount, transactionType, details})[0],
                html:  transferTemplate.transferSuccess({email, transactionId, transactionDate, amount, transactionType, details})[1],
            }
        }

        if (status == "failed") {
            var mailOPtions = { 
                from : process.env.AUTH_EMAIL,
                to: email,
                subject: transferTemplate.transferFailed({email, transactionId, transactionDate, amount, transactionType, details})[0],
                html:  transferTemplate.transferFailed({email, transactionId, transactionDate, amount, transactionType, details})[1],
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

module.exports = {sendTransferEmail}  