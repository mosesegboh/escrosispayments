const express = require('express')
const router = express.Router()

//User model
const User = require('./../models/User')

//password hashing
const bcrypt = require('bcrypt')

//sign up
router.post('/signup', (req, res) => {
    let {name, email, password, dateOfBirth} = req.body

    name = name.trim()
    email = email.trim()
    password = password.trim()
    dateOfBirth = dateOfBirth.trim()

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
                res.json({
                    status: "FAILED",
                    message: "User Already exists in the database"
                })
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
                        dateOfBirth
                    })

                    newUser.save().then(result => {
                        res.json({
                            status: "SUCCESS",
                            message: "User saved successfully",
                            data: result
                        })
                    }).catch(err => {
                        res.json({
                            status: "FAILED",
                            message: "AN error occured while saving user"
                        })
                    })

                }).catch(err => {
                    res.json({
                        status: "FAILED",
                        message: "AN error occured during password hashing"
                    })
                })
            }
        }).catch(err => {
            console.log(err)
            res.json({
                status: "FAILED",
                message: "AN error occured"
            })
        })
    }

})

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
        User.find({email}).then(data => {
            if (data.length){
                //User exists in the database

                const hashedPassword = data[0].password
                bcrypt.compare(password, hashedPassword).then(result => {
                    if (result) {
                        //password match
                        res.json({
                            status: "SUCCESS",
                            message: "Sign In successful",
                            data: data
                        })
                    }else {
                        res.json({
                            status: "FAILED",
                            message: "Invalid passsword entered",
                        })
                    }
                }).catch(err => {
                    res.json({
                        status: "FAILED",
                        message: "An error has occurred"
                    })
                })
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


module.exports = router