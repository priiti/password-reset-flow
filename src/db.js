require('dotenv').config({ path: '.env' });

const mongoose = require('mongoose');
const bluebird = require('bluebird');
const log = require('./utils/logger');

mongoose.Promise = bluebird;

module.exports = mongoose.connect(process.env.MONGODB_URI, 
  { useMongoClient: true }, 
  () => {
    log.info(`Database connected!`);
});
