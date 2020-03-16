var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var Client = new Schema({
  name: {
    type: String,
    required: true,
    uppercase: true
  },
  last_name: {
    type: String,
    required: false,
    uppercase: true
  },
  telephone: {
    type: String,
    required: true,
    uppercase: true
  },
  email: {
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
    uppercase: true
  },
  person_type: {
    type: String,
    required: true,
    uppercase: true
  },
  created_at: {
    type: Date,
    default: Date.now
  }
}, {
  collection: 'Clients'
});

module.exports = Client = mongoose.model('Clients', Client);
