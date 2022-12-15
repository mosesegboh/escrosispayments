require('./config/db')
var cors = require('cors')

const app = require('express')()
const port = process.env.PORT || 3000

//cors options
const options = {
    origin: "*",
    }

//cors
app.use(cors(options))

//routes
const UserRouter = require('./api/User')
const TransactionRouter = require('./api/Transaction')
const BillCategoriesRouter = require('./api/transactions/BillCategories')
const WebHook = require('./api/Webhook')

//inorder to accept data
const bodyParser = require('express').json
app.use(bodyParser());

//APIs
app.use('/user', UserRouter)
app.use('/transaction', TransactionRouter)
app.use('/transaction', BillCategoriesRouter)
app.use('/webhook', WebHook)

app.listen(port, ()=>{
    console.log(`Server running on port ${port}`)
})