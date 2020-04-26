var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var Client = new Schema({
  name: {
    type: String,
    required: true,
    uppercase: true
  },
  rfc: {
    type: String,
    required: true,
    uppercase: true,
    uppercase: true
  },
  languages: {
    type: String,
    required: true,
    uppercase: false
  },
  person_type: {
    type: String,
    required: true,
    uppercase: true
  },
  comments: {
    type: String,
    required: false,
    uppercase: false
  },
  contacts: {
    type: Array,
    required: false
  },
  created_at: {
    type: Date,
    default: Date.now
  }
}, {
  collection: 'Clients'
});

module.exports = Client = mongoose.model('Clients', Client);
