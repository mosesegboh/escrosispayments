const jwt = require('jsonwebtoken');
//email handlers
const nodemailer = require('nodemailer')

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
      const currentUrl = 'http://localhost:3000/';
  
      const uniqueString = uuidv4() + _id;
  
      //mail
      const mailOPtions = {
          from: process.env.AUTH_EMAIL,
          to: email,
          subject: "Verify Your Email",
          html: `<p>Please verify your email address to complete the sign up process and login into your account.</p>
              <p>This link <b>expires in 6 hours</b>.</p><p>Click on the link: <a href=${currentUrl + 'user/verify/' + _id + '/' + uniqueString}>
              here<a/>to proceed.</p>`,
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
              //mail options
              var mailOPtions = { 
                  from : process.env.AUTH_EMAIL,
                  to: email,
                  subject: "Your transaction was successful",
                  html: `<p>Hello</p><p>This is to notify you that your transaction has been completed</p>
                  <p>Here are the details of you transaction:</p>
                  <p><b>Transaction ID: ${transactionId}</b></p>
                  <p><b>Amount: ${amount}</b></p>
                  <p><b>Transaction Redemption Date: ${transactionType}</b></p>
                  <p><b> Transaction Leg: ${transactionDate}</b></p>
                  <p><b> Details: ${details}</b></p>
                  <p>Thank you for trusting us, your transaction is in safe hands.</p>
                  <p>Warm Regards</p>`,
              }
          }
  
          if (status == "failed") {
              var mailOPtions = { 
                  from : process.env.AUTH_EMAIL,
                  to: email,
                  subject: "Your transaction failed",
                  html: `<p>Hello</p><p>This is to notify you that your transaction with details below failed</p>
                  <p>Warm Regards</p>`,
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
              //mail options
              var mailOPtions = { 
                  from : process.env.AUTH_EMAIL,
                  to: email,
                  subject: "Your transaction Is Now Locked",
                  html: `<p>Hello</p><p>This is to notify you that your transaction has been completed</p>
                  <p>Here are the details of you transaction:</p>
                  <p><b>Transaction ID: ${transactionId}</b></p>
                  <p><b>Amount: ${amount}</b></p>
                  <p><b> Second Leg Transaction Id: ${secondLegTransactionId}</b></p>
                  <p><b>Transaction Redemption Date: ${transactionDate}</b></p>
                  <p><b> Transaction Leg: ${transactionType}</b></p>
                  <p><b> Details: ${details}</b></p>
                  <p>Thank you for trusting us, your transaction is in safe hands.</p>
                  <p>Warm Regards</p>`,
              }
          }
  
          if (status == "failed") {
              var mailOPtions = { 
                  from : process.env.AUTH_EMAIL,
                  to: email,
                  subject: "Your transaction failed",
                  html: `<p>Hello</p><p>This is to notify you that your transaction with details below failed</p>
                  <p>Warm Regards</p>`,
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

 

module.exports = {generateAccessToken, sendVerificationEmail, sendTransactionCompleteEmail, sendTransactionLockedEmail}