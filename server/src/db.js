/*
*   basic mongodb configuration file
*/
const mongoose = require('mongoose');

const {
  MONGO_INITDB_ROOT_USERNAME,
  MONGO_INITDB_ROOT_PASSWORD,
  MONGO_URI,
  MONGO_PORT,
  MONGO_DB
} = process.env;

// reconnection attempts settigns
const options = {
  useNewUrlParser: true,
  reconnectTries: Number.MAX_VALUE,
  reconnectInterval: 500, 
  connectTimeoutMS: 10000,
};

let url = '';
if (process.env.NODE_ENV === 'development') {
  url = "mongodb://localhost:27017/test";
} else {
  url = `mongodb://${MONGO_INITDB_ROOT_USERNAME}:${MONGO_INITDB_ROOT_PASSWORD}@${MONGO_URI}:${MONGO_PORT}/${MONGO_DB}?authSource=admin`;
}

console.log({url});
mongoose.connect(url, options).then( function() {
  console.log('MongoDB is connected');
}).catch( function(err) {
  console.log('error with connectionnnnnn');
  console.log(err);
});
