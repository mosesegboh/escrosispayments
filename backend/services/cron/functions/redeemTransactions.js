require('dotenv').config({ path: '../../../.env' })
const mongoose = require('mongoose');
const Transaction = require('../../../models/Transaction')
const {redeemTransaction} = require('../../../functions/process')

const redeemTransactionFunction = async  () => {
  try {
    mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    }).then(()=>{
      console.log('Connected to db')
    }).catch((err)=>console.log(err))

    var currentDate = new Date()
  
    let transactions = await Transaction.find({ transactionDate: currentDate, status: 'locked' })
    transactions.forEach((transactionsToRedeem) => {
      if (transactionsToRedeem.length > 1) {
        transactionsToRedeem.forEach((transactionToRedeem) => {
          redeemTransaction(transactionToRedeem)
        })
      }else{
        console.log('Something went wrong in transaction first leg')
      }   
    });
  } catch(error) {
    console.log(err);
  }
}

module.exports = {redeemTransactionFunction}