var cron = require('node-cron');
var shell = require('shelljs');
const {redeemTransactionFunction} = require('./functions/redeemTransactions');

cron.schedule('* * * * *', () => {
  console.log('running a task every  minute');
  redeemTransactionFunction();
  //COMMAND - node services/cron/cronjobs.js
  //OR CD INTO THE DIR AND RUN node cronjobs.js
});