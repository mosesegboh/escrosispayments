require('./config/db')

const app = require('express')()
const port = process.env.PORT || 3000

//routes
const UserRouter = require('./api/User')
const TransactionRouter = require('./api/Transaction')

//inorder to accept data
const bodyParser = require('express').json
app.use(bodyParser());

//APIs
app.use('/user', UserRouter)
app.use('/transaction', TransactionRouter)

app.listen(port, ()=>{
    console.log(`Server running on port ${port}`)
})