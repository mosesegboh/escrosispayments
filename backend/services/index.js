const walletTemplate = require('./email/templates/walletTemplate')
const escrowTemplate = require('./email/templates/escrowTemplate')
const verificationEmailTemplate = require('./email/templates/verificationEmailTemplate')
const jwt = require('jsonwebtoken')
const nodemailer = require('nodemailer')
// const GOOGLE_PLAYSTORE_URL = 'https://play.google.com/store/games';

//unique string
const {v4: uuidv4} = require('uuid')

const generateAccessToken = (req,res,next) => {
   return jwt.sign(user,
    config.get("ACCESS_TOKEN_SECRET"), 
    { expiresIn: 360 },)
}

let transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.AUTH_EMAIL,
        pass: process.env.AUTH_PASSWORD,
    }
})
  
//testing the transporter successfully
transporter.verify((error, success) => {
    if(error) {
        console.log(error)
    }else{
        console.log('ready for messages')
        console.log(success)
    }
})

 const sendVerificationEmail = ({_id, email}, res) => {
      //url to be used in te email
      const currentUrl = process.env.CURRENT_URL
  
      const uniqueString = uuidv4() + _id;
  
      //mail
      const mailOPtions = {
        from: process.env.AUTH_EMAIL,
        to: email,
        subject: verificationEmailTemplate.verificationEmailSuccess({currentUrl,  uniqueString,  _id})[0],
        html:  verificationEmailTemplate.verificationEmailSuccess({currentUrl,  uniqueString,  _id})[1],
      }
  
      //hash the string
      const saltRounds = 10;
      bcrypt
          .hash(uniqueString, saltRounds)
          .then((hashedUniqueString)=>{
              //set values in user verification record
              const newVerification = new UserVerification({
                  userId: _id,
                  uniqueString: hashedUniqueString,
                  createdAt: Date.now(),
                  expiresAt: Date.now() + 21600000
              })
  
              newVerification
                  .save()
                  .then(()=>{
                      //send mail
                      transporter
                          .sendMail(mailOPtions)
                          .then(() => {
                              //email sent and verification record saved successfully
                              res.json({
                                  status: "PENDING",
                                  message: "Verification email sent!"
                              })
                          })
                          .catch((error)=>{
                              console.log(error)
                              res.json({
                                  status: "FAILED",
                                  message: "Verification email failed"
                              })
                          })
                  })
                  .catch((error) => {
                      console.log(error)
                      res.json({
                          status: "FAILED",
                          message: "Couldn't save verification email data!"
                      })
                  })
          })
          .catch(()=>{
              res.json({
                  status: "FAILED",
                  message: "An error occured while hashing email data"
              })
          })
  }

const sendTransactionCompleteEmail = async ({email, transactionId, transactionDate, amount, transactionType, details}, res, status) => {
    try {
        if (status == "success"){
            var mailOPtions = { 
                from : process.env.AUTH_EMAIL,
                to: email,
                subject: escrowTemplate.firstLegTransactionSuccess({email, transactionId, transactionDate, amount, transactionType, details})[0],
                html:  escrowTemplate.firstLegTransactionSuccess({email, transactionId, transactionDate, amount, transactionType, details})[1],
            }
        }

        if (status == "failed") {
            var mailOPtions = { 
                from : process.env.AUTH_EMAIL,
                to: email,
                subject: escrowTemplate.firstLegTransactionFailed({email, transactionId, transactionDate, amount, transactionType, details})[0],
                html: escrowTemplate.firstLegTransactionFailed({email, transactionId, transactionDate, amount, transactionType, details})[1],
            }
        }
        
        await transporter.sendMail(mailOPtions)

    } catch (error) {
        res.json({
            status: "FAILED",
            message: error.message,
        })
    }
}

const sendTransactionLockedEmail = async ({email, transactionId, transactionDate, amount, transactionType, details, secondLegTransactionId}, res, status) => {
    try {
        if (status == "success"){
            var mailOPtions = { 
                from : process.env.AUTH_EMAIL,
                to: email,
                subject: escrowTemplate.secondLegTransactionSuccess({email, transactionId, transactionDate, amount, transactionType, details, secondLegTransactionId})[0],
                html:  escrowTemplate.secondLegTransactionSuccess({email, transactionId, transactionDate, amount, transactionType, details, secondLegTransactionId})[1],
            }
        }

        if (status == "failed") {
            var mailOPtions = { 
                from : process.env.AUTH_EMAIL,
                to: email,
                subject: escrowTemplate.secondLegTransactionFailed({email, transactionId, transactionDate, amount, transactionType, details, secondLegTransactionId})[0],
                html:  escrowTemplate.secondLegTransactionFailed({email, transactionId, transactionDate, amount, transactionType, details, secondLegTransactionId})[1],
            }
        }
        
        await transporter.sendMail(mailOPtions)

    } catch (error) {
        res.json({
            status: "FAILED",
            message: error.message,
        })
    }
}

const sendAddWalletSuccessfulEmail = async ({email, transactionId, transactionDate, amount, transactionType, details}, res, status) => {
    try {
        if (status == "success"){
            var mailOPtions = { 
                from : process.env.AUTH_EMAIL,
                to: email,
                subject: walletTemplate.walletTransactionSuccess({email, transactionId, transactionDate, amount, transactionType, details})[0],
                html: walletTemplate.walletTransactionSuccess({email, transactionId, transactionDate, amount, transactionType, details})[1],
            }
        }

        if (status == "failed") {
            var mailOPtions = { 
                from : process.env.AUTH_EMAIL,
                to: email,
                subject: walletTemplate.walletTransactionFailed({email, transactionId, transactionDate, amount, transactionType, details})[0],
                html: walletTemplate.walletTransactionFailed({email, transactionId, transactionDate, amount, transactionType, details})[1],
            }
        }
        
        await transporter.sendMail(mailOPtions)

    } catch (error) {
        res.json({
            status: "FAILED",
            message: error.message,
        })
    }
}

function getRandom(length) {
    return Math.floor(
        Math.pow(10, length - 1) + Math.random() * 9 * Math.pow(10, length - 1)
    );
}

module.exports = {
    generateAccessToken, 
    sendVerificationEmail, 
    sendTransactionCompleteEmail, 
    sendTransactionLockedEmail, 
    getRandom, 
    sendAddWalletSuccessfulEmail, 
    // GOOGLE_APP_URL
}