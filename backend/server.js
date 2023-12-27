require('./config/db')
require('events').EventEmitter.defaultMaxListeners = 100; // or any other number you find reasonable

var cors = require('cors')
const socketIo = require('socket.io');
const http = require('http');

const app = require('express')()
const port = process.env.PORT || 3021

// Create a server instance
const server = http.createServer(app);

const io = socketIo(server, {
    cors: {
       origin: "http://localhost:3001",
       methods: ["GET", "POST"],
       allowedHeaders: ["Access-Control-Allow-Origin"],
       credentials: true
    }
 });
//cors options
const options = {
    origin: "*",
}
//cors
app.use(cors(options))
//inorder to accept data
const bodyParser = require('express').json
app.use(bodyParser());

//routes
const UserRouter = require('./api/User')
const TransactionRouter = require('./api/Transaction')
const BillCategoriesRouter = require('./api/transactions/BillCategories')
const WebHook = require('./api/Webhook')
const ProcessPayments = require('./api/ProcessPayments')

// Expose io to your routers if needed
app.use((req, res, next) => {
    req.io = io;
    next();
});

//APIs
app.use('/user', UserRouter)
app.use('/transaction', TransactionRouter)
app.use('/transaction', BillCategoriesRouter)
app.use('/webhook', WebHook)
app.use('/payments', ProcessPayments)

// app.listen(port, ()=>{
server.listen(port, ()=>{
    console.log(`Server running on port ${port}`)
})