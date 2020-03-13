var mongoose = require('mongoose');
var Schema = mongoose.Schema;

//schema
var TestForm = new Schema({
  desc: {
    type: String
  },

},{
    collection: 'Tasks'
});

module.exports = mongoose.model('TestForm', TestForm);
