var cron = require('node-cron');
var shell = require('shelljs');

cron.schedule('* * * * *', () => {
  console.log('running a task every  minute');
  //COMMAND - node services/cron/cronjobs.js
  //OR CD INTO THE DIR AND RUN node cronjobs.js
});