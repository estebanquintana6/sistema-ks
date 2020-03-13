var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var Referido = new Schema({
    referido: {
        type: String,
        required: false,
        uppercase: true
      },
      contactoreferido: {
        type: String,
        required: false
      },
      telefono: {
        type: String,
        required: false
      }
}, {
    collection: 'Referidos'
});

module.exports = Secom = mongoose.model('Referidos', Referido);