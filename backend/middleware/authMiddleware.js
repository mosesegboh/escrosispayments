/* User model */
const User = require("../models/User");
const jwt = require("jsonwebtoken");
const config = require('config')

const authMiddleware = (req, res, next) => {
    // const authHeader = req.body['authorization']
    const authHeader = req.body.token

    const token = authHeader && authHeader.split(' ')[1]
    if (token) {
        jwt.verify(token, config.get('ACCESS_TOKEN_SECRET'), (err, decodedToken) => {
            if(err){
                // console.log(err.message, '-expired token I think');
                res.json({
                    status: "EXPIRED TOKEN",
                    message: "You need to login to access this page -invalid token",
                    data: token
                })
            }else{
                next();
            }
        })
    }else {
        res.json({msg: 'You need to login to access this page-no token', data: token})
    }
}

module.exports = {authMiddleware}