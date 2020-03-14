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
    telefono: {
      type: String,
      required: true,
      uppercase: true
    },
    email: {
      type: String,
      required: false
    },
    rfc: {
      type: String,
      required: false,
      uppercase: true
    },
    languages: {
      type: Array,
      required: true
    }
}, {
    collection: 'Clients'
});

module.exports = Client = mongoose.model('Clients', Client);
