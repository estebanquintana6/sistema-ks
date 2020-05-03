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
    required: false,
    uppercase: true
  },
  languages: {
    type: String,
    required: false,
    uppercase: false
  },
  person_type: {
    type: String,
    required: false,
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
  },
  state: {
    type: String,
    required: false,
    uppercase: true
  },
  city: {
    type: String,
    required: false,
    uppercase: true
  }
}, {
  collection: 'Clients'
});

module.exports = Client = mongoose.model('Clients', Client);
