/* User model */
const User = require("../models/User");
const jwt = require("jsonwebtoken");
const config = require('config')

const authMiddleware = (req, res, next) => {
    console.log(req.body.token)
    // const token = req.cookies.jwt
    // const authHeader = req.body['authorization']
    //console.log(authHeader)
    const authHeader = req.body.token

    const token = authHeader && authHeader.split(' ')[1]

    // console.log(req)
    console.log(token)

    //check if json web token exists and is verified
    if (token) {
        jwt.verify(token, config.get('ACCESS_TOKEN_SECRET'), (err, decodedToken) => {
            if(err){
                console.log(err.message);
                res.json({msg: 'You need to login to access this page -invalid token', data: token})
            }else{
                //console.log(decodedToken)
                next();
            }
        })
    }else {
        res.json({msg: 'You need to login to access this page-no token', data: token})
    }
}

module.exports = {authMiddleware}