const express = require('express')
const router = express.Router()
const ObjectId = require('mongodb').ObjectId
const mongoose = require('mongoose')
const jwt = require('jsonwebtoken')
const config = require('config')
const User = require('./../models/User')
const UserVerification = require('./../models/UserVerification')
const UserOTPVerification = require('./../models/UserOTPVerification')
const email = require('../services/index')
const nodemailer = require('nodemailer')

//unique string
const {v4: uuidv4} = require('uuid')

//env variables
require('dotenv').config();

//password hashing
const bcrypt = require('bcrypt')

// nodemailer transporter
let transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.AUTH_EMAIL,
        pass: process.env.AUTH_PASSWORD,
    }
})

// //testing the transporter successfully
transporter.verify((error, success) => {
    if(error) {
        console.log(error)
    }else{
        console.log('ready for messages')
        console.log(success)
    }
})

//sign up
router.post('/signup', (req, res) => {

    let {name, email, password, dateOfBirth, isGoogleSignIn} = req.body

    // console.log(isGoogleSignIn)
    
    name = name.trim()
    email = email.trim()
    isGoogleSignIn = (isGoogleSignIn !== undefined && isGoogleSignIn !== null && isGoogleSignIn !== "") ? true : false 
    password =  isGoogleSignIn ? "googlesignintemppassword" : password.trim()
    dateOfBirth = isGoogleSignIn ? new Date() : dateOfBirth.trim()

    // console.log(isGoogleSignIn, '--google sign in')
    // return
    //validation
    if (name == "" || email == "" || password == "" || dateOfBirth == ""){
        res.json({
            status: "FAILED",
            message: "Empty input fields"
        })
    } else if (!/^[a-zA-Z ]*$/.test(name)) {
        res.json({
            status: "FAILED",
            message: "Invalid name"
        })
    } else if (!/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/.test(email)) {
        res.json({
            status: "FAILED",
            message: "Invalid email"
        })
    } else if (!new Date(dateOfBirth).getTime()){
        res.json({
            status: "FAILED",
            message: "Invalid date of birth entered"
        })
    } else if (password.length < 8) {
        res.json({
            status: "FAILED",
            message: "Password is too short"
        })
    }else {
        //if validation passed proceed by checking if the user already exist in the database
        User.find({ email}).then(result => {
            if(result.length){
                if (isGoogleSignIn == true){
                    //You can update the last user login
                    User.findOneAndUpdate(
                        { _id: new ObjectId(result[0]._id) }, 
                        { $set: { verified: true } }, 
                        { new: true})
                        .then(updatedResult => {
                            if (updatedResult) {
                                generateToken(updatedResult, res, password)
                                .then(token => {

                                    updatedResult = JSON.parse(JSON.stringify(updatedResult));
                                    updatedResult.token = token;

                                    return res.json({
                                        status: "VERIFIED",
                                        message: 'Google Sign In is verified successfully.....',
                                        data: updatedResult
                                    })

                                })
                                .catch(err => {
                                    console.error(err);
                                });
                            }
                        })
                }else{
                    res.json({
                        status: "FAILED",
                        message: "User already exists in the database"
                    })
                }
            }else{
                //create the user
                //password handling
                const saltRounds = 10
                bcrypt.hash(password, saltRounds).then(hashedPassword => {
                    //if password is hashed successfully
                    const newUser = new User({
                        name,
                        email,
                        password: hashedPassword,
                        dateOfBirth,
                        verified: isGoogleSignIn ? true : false,
                        isGoogleSignIn
                    })
                    
                    newUser
                    .save()
                    .then(result => {
                        const userparam =  { id: result.id }
                        const expiresIn = { expiresIn: 36000 }

                        const accessToken = jwt.sign(userparam,config.get("ACCESS_TOKEN_SECRET"),expiresIn)

                        // if (isGoogleSignIn) {
                        result = JSON.parse(JSON.stringify(result));
                        result.token = accessToken;
                        // }
                        // console.log(result,'---result')
                        // return
                        //handle user verification
                        // email.sendVerificationEmail(result, res)
                        //sendVerification OTP
                        //THIS IS WHAT HANDLES THE VERIFICATION-COMMENTING IT FOR NOW FOREASY DEVELOPMENT
                        sendOTPVerificationEmail(result, res)
                        //DISABLE THIS WHEN USING EMAIL VERIFICATION FUNCTIONALITY
                        // res.json({
                        //     accessToken: accessToken,
                        //     status: "SUCCESS",
                        //     message: "User saved successfully",
                        //     data: result
                        // })
                    }).catch(err => {
                        res.json({
                            status: "FAILED",
                            message: "An error occured while saving user"
                        })
                    })

                }).catch(err => {
                    res.json({
                        status: "FAILED",
                        message: "An error occured during password hashing"
                    })
                })
            }
        }).catch(err => {
            console.log(err)
            res.json({
                status: "FAILED",
                message: "An error occured"
            })
        })
    }
})

//hashed password
// const generateToken = (data, res, userPassword) => {
//     // console.log(data, '--data');

//     const hashedPassword = data.password
//     const password = userPassword

//     bcrypt.compare(password, hashedPassword).then(result => {
//         if(!result){
//             res.json({
//                 status: "FAILED",
//                 message: "Invalid password entered",
//             })
//         }

//         //sign the jwt
//         jwt.sign(
//             { id: data.id },
//             config.get("ACCESS_TOKEN_SECRET"),
//             { expiresIn: 36000 },
//             (err, token) => {
//                 // console.log(token, '--token')
//             if (err) throw err;
            
//             return token;
//                 // data[0].token = token;
//             }
//         );
//     }).catch(err => {
//         res.json({
//             status: "FAILED",
//             message: "An error has occurred"
//         })
//     })
// } 

const generateToken = (data, res, userPassword) => {
    const hashedPassword = data.password;
    const password = userPassword;
  
    return new Promise((resolve, reject) => {
      bcrypt.compare(password, hashedPassword)
        .then(result => {
          if (!result) {
            res.json({
              status: "FAILED",
              message: "Invalid password entered",
            });
            reject(new Error("Invalid password entered"));
          }
  
          jwt.sign(
            { id: data.id },
            config.get("ACCESS_TOKEN_SECRET"),
            { expiresIn: 36000 },
            (err, token) => {
              if (err) {
                reject(err);
              }
              resolve(token);
            }
          );
        })
        .catch(err => {
          res.json({
            status: "FAILED",
            message: "An error has occurred",
          });
          reject(err);
        });
    });
  };
  



//sign in
router.post('/signin', (req, res) => {
    let {email, password} = req.body

    email = email.trim()
    password = password.trim()

    if(email == "" || password == ""){
        res.json({
            status: "FAILED",
            message: "Empty credentials"
        })
    }else {
        //check if the user exist in the database
        User.find({email}).lean().then(data => {
            if (data.length){
                //THIS IS FOR THE VERIFICATION STATUS OF THE USER
                //check for the verification status of the user
                if (!data[0].verified) {
                    res.json({
                        status: "FAILED",
                        message: "Email has not been verified. check your inbox",
                    })
                }else{

                     //User exists in the database
                    const hashedPassword = data[0].password
                    bcrypt.compare(password, hashedPassword).then(result => {

                        if(!result){
                            res.json({
                                status: "FAILED",
                                message: "Invalid password entered",
                            })
                        }

                        //sign the jwt
                        jwt.sign(
                            { id: data.id },
                            config.get("ACCESS_TOKEN_SECRET"),
                            { expiresIn: 36000 },
                            (err, token) => {
                            if (err) throw err;

                            //   res = JSON.parse(JSON.stringify(data));
                                // res.token = token;
                            data[0].token = token;

                            console.log(data[0]);
                            res.json({
                                // token,
                                status: "SUCCESS",
                                data: data
                                // user: {
                                //   id: user.id,
                                //   name: user.name,
                                //   email: user.email,
                                // },
                            });
                            }
                        );

                        // if (result) {
                        //     //password match
                        //     res.json({
                        //         status: "SUCCESS",
                        //         message: "Sign In successful",
                        //         data: data
                        //     })
                        // }else {
                        //     res.json({
                        //         status: "FAILED",
                        //         message: "Invalid passsword entered",
                        //     })
                        // }
                    }).catch(err => {
                        res.json({
                            status: "FAILED",
                            message: "An error has occurred"
                        })
                    })
                }
                               
            }else{
                res.json({
                    status: "FAILED",
                    message: "User does not exist"
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


//send otp verification Email
const sendOTPVerificationEmail = async (result, res) => {
    const {_id, email, isGoogleSignIn, token, name, dateOfBirth} = result
    // console.log(result, '--result')
    // return
    try {
        if (isGoogleSignIn) {
            res.json({
                status: "VERIFIED",
                message: 'Google Sign In is verified successfully..',
                data: result
            })
            return
        }
        const otp = `${Math.floor(1000 + Math.random() * 9000)}`;

        //mail options
        const mailOPtions = { 
            from : process.env.AUTH_EMAIL,
            to: email,
            subject: "Verify Your Email",
            html: `<p>Please verify your email address to complete the sign up process and login into your account.</p>
            <p>This link <b>expires in 6 hours</b>.</p><p>Enter the <b>${otp}</b> into the application to verify your email</p>`,
        }

        //has the otp
        const saltRounds = 10;

        const hashedOTP = await bcrypt.hash(otp, saltRounds);
        const newOTPVerification = new UserOTPVerification({
            userId: _id,
            otp: hashedOTP,
            createdAt: Date.now(),
            expiresAt: Date.now() + 3600000
        })

        await newOTPVerification.save();
        await transporter.sendMail(mailOPtions)

        // console.log(_id)
        res.json({
            status: "PENDING",
            message: "Verification OTP email sent",
            data: {
                userId: _id,
                email,
                token,
                name,
                dateOfBirth
            }
        })

    } catch (error) {
        res.json({
            status: "FAILED",
            message: error.message,
        })
    }
}

//route to verify otp
router.post('/verifyOTP', async (req, res) => {
    try {
        let {userId, otp} = req.body

        // console.log(userId, otp)

        if (!userId || !otp) {
            throw Error('Empty otp details are not allowed')
        }else{
            const UserOTPVerificationRecords = await UserOTPVerification.find({
                userId
            })

            // console.log(UserOTPVerificationRecords)

            if (UserOTPVerification.length <= 0) {
                //no record found
                throw new Error(
                    "Account record does not exist or has been verified already. please sign up or login"
                )
            }else{
                // console.log(UserOTPVerificationRecords[0])
                //user otp record exists in the database
                const {expiresAt} = UserOTPVerificationRecords[0]
                const hashedOTP = UserOTPVerificationRecords[0].otp

                // console.log(expiresAt)

                // console.log(UserOTPVerificationRecords[0], UserOTPVerificationRecords[0].otp, userId, otp)

                if(expiresAt < Date.now()) {
                    //user otp has expired
                    await UserOTPVerification.deleteMany({userId})
                    throw new Error('code has expired. please request again')
                }else{
                    const validOTP = await bcrypt.compare(otp, hashedOTP)

                    if (!validOTP) {
                        //supplies otp is wrong
                        throw new Error('Invalid code passed. check your inbox')
                    }else{
                        //success
                        await User.updateOne({_id: userId}, {verified: true})
                        await UserOTPVerification.deleteMany({userId})

                        res.json({
                            status: "VERIFIED",
                            message: 'User email verified successfully'
                        })
                    }
                }
            }
        }
    } catch (error) {
        res.json({
            status: "FAILED",
            message: error.message
        })
    }
})

//resend OTP 
router.post('/resendOTPVerificationCode', async (req, res) => {
    try {
        let {userId, email} = req.body

        if (!userId || !email) {
            throw Error('Empty otp details are not allowed')
        }else{
            //delete existing records and resend
            await UserOTPVerification.deleteMany({userId})
            sendOTPVerificationEmail({_id: userId, email}, res)
        }
    }catch(error) {
        res.json({
            status: "FAILED",
            message: error.message
        })
    }
})

//send verification email notification
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

//verification email
router.get('/verify/:userId/:uniqueString', (req, res) =>{
    let {userId, uniqueString} = req.params;

    UserVerification
        .find({userId})
        .then((result)=>{
            if(result.length > 0) {
                const { expiresAt } = result[0];
                const hashedUniqueString = result[0].uniqueString

                //checking for expired unique string
                if (expiresAt > Date.now()) {
                    //record has expired so we will need to delete it
                    UserVerification
                        .deleteOne({userId})
                        .then(result => {
                            User.deleteOne({_id: userId})
                            .then(() => {
                                res.json({
                                    status: "FAILED",
                                    message: "The link has expired please sign up again"
                                })
                            })
                            .catch((error) => {
                                res.json({
                                    status: "FAILED",
                                    message: "An error while deleting expired user record"
                                })
                            })
                        })
                        .catch((error) => {
                            console.log(error)
                            res.json({
                                status: "FAILED",
                                message: "An error while verifying the validity of the link"
                            })
                        })
                }else{
                    //vali record exists so we can validate the user
                    bcrypt
                    .compare(uniqueString, hashedUniqueString)
                    .then(result => {
                        if(result) {
                            //if strings matches set verified to true
                            User
                                .updateOne({_id: userId}, {verified: true})
                                .then(() => {
                                    UserVerification
                                        .deleteOne({userId})
                                        .then(() => {
                                            res.json({
                                                status: "SUCCESS",
                                                message: "User has been succesfully verified!"
                                            })
                                        })
                                        .catch((error) => {
                                            console.log(error)
                                            res.json({
                                                status: "FAILED",
                                                message: "An error while finalizing succesfully verification"
                                            })
                                        })
                                })
                                .catch((error)=>{
                                    console.log(error)
                                    res.json({
                                        status: "FAILED",
                                        message: "An error setting clients verification details"
                                    })
                                })
                        }else{
                            //eisting record but incorrect verification details passed
                            res.json({
                                status: "FAILED",
                                message: "invalid verification details passed"
                            })
                        }
                    })
                    .catch(error => {
                        res.json({
                            status: "FAILED",
                            message: "An error while comparing strings"
                        })
                    })
                }
            }else{
                res.json({
                    status: "FAILED",
                    message: "Account record does not exist you can login again"
                })
            }
        })
        .catch((error) => {
            console.log(error)
            res.json({
                status: "FAILED",
                message: "Your account could not be verified"
            })
        })
})


module.exports = router