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
  gender: {
    type: String,
    required: false,
  },
  comments: {
    type: String,
    required: false,
    uppercase: false
  },
  files: {
    type: [ 
      new mongoose.Schema({ 
        path: {
          type: String,
          required: true
        },
        created_at: {
          type: Date,
          required: false,
          default: Date.now
        },
        description: {
          type: String,
          required: false,
          default: ""
        }
      }
    )],
    default: []
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
  },
  postal_code: {
    type: String,
    required: false,
    uppercase: true
  }
}, {
  collection: 'Clients'
});

module.exports = Client = mongoose.model('Clients', Client);
