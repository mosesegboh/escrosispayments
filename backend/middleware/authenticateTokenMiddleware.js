const jwt = require('jsonwebtoken');
const config = require('config')

const authenticateTokenMiddleware = (req,res,next) => {
    // if(req.params) {
    //     console.log(req.params)
    //     const authHeader = req.params.token
    //     console.log(authHeader, 'authenticate token middleware')
    // }

    // const authHeader = req.headers['authorization']
    const authHeader = req.body.token

    

    const token = authHeader && authHeader.split(' ')[1]

    // console.log(token, 'this is the authenticate token')

    if(token == null) return res.json({status: 401, msg: 'An error occured in getting your user details - no token'})

    jwt.verify(token,  config.get('ACCESS_TOKEN_SECRET'), (err, user) => {
        if (err) return res.json({status: 401, msg: 'An error occured in verifying your user details - verify token'})
        req.user = user
        next()
    })
}

module.exports = {authenticateTokenMiddleware}