var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var Secom = new Schema({
    fecha: {
        type: Date,
        default: Date.now,
        required: true
      },
    name: {
        type: String,
        required: true,
        uppercase: true
      },
    last_name1: {
        type: String,
        required: true,
        uppercase: true
      },
    last_name2: {
        type: String,
        uppercase: true
      },
    campana: {
        type: String,
        required: true
      },
    status: {
        type: String,
        required: false,
        uppercase: true
      },
    callDate: {
        type: Date,
        required: false
      },
    telefono: {
        type: String,
        required: true
      }
}, {
    collection: 'Secom'
});

module.exports = Secom = mongoose.model('Secom', Secom);