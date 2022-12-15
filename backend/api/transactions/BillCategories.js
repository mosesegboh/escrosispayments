const express = require('express')
const router = express.Router()
const Flutterwave = require("flutterwave-node-v3");
const authMiddleware = require("../../middleware/authMiddleware")
const authenticateTokenMiddleware = require("../../middleware/authenticateTokenMiddleware")

router.get('/all-bills', async  (req, res) => {
    // console.log('iwas clicked')
    const flw = new Flutterwave(process.env.FLW_PUBLIC_KEY, process.env.FLW_SECRET_KEY);

    try {
        response = await flw.Bills.fetch_bills_Cat();
        if (response){
            res.json({
                status: "SUCCESS",
                data: response
            })
        }
        // const response = await flw.Subscription.fetch_all()
        // console.log(response);
    } catch (error) {
        console.log(error)
    }
    
    // } 
    
})

//sign in
router.get('/get-transactions', authMiddleware.authMiddleware, authenticateTokenMiddleware.authenticateTokenMiddleware, (req, res) => {
    
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


//get transactio

module.exports = router