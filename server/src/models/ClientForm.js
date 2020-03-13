var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var Client = new Schema({
    origen: {
      type: String,
      required: false,
      default: "CLIENTES",
      uppercase: true
    },
    razon_social: {
      type: String,
      required: false,
      uppercase: true
    },
    name: {
        type: String,
        required: true,
        uppercase: true
      },
    last_name1: {
        type: String,
        required: false,
        uppercase: true
      },
    last_name2: {
        type: String,
        required: false,
        uppercase: true
      },
    calle: {
        type: String,
        required: false,
        uppercase: true
      },
    exterior: {
        type: String,
        required: false,
        uppercase: true
      },
    interior: {
        type: String,
        required: false,
        uppercase: true
      },
    colonia: {
        type: String,
        required: false,
        uppercase: true
      },
    cp: {
        type: String,
        required: false,
        uppercase: true
      },
    estado: {
        type: String,
        required: false,
        uppercase: true
      },
    whatsapp: {
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
    comments: {
        type: String,
        required: false
      },
    productos: {
        type: Array,
        required: false
      },
    porCerrar: {
        type: Array,
        required: false
      },
    callDate: {
        type: String,
        required: false
      },
    cumpleanos: {
      type: String,
      required: false,
      uppercase: true
    },
    sexo: {
      type: String,
      required: false,
      uppercase: true
    },
    civil: {
      type: String,
      required: false,
      uppercase: true
    },
    ocupacion: {
      type: String,
      required: false,
      uppercase: true
    },
    gastosmedicos: {
      type: String,
      required: false,
      uppercase: true
    },
    segurovida: {
      type: String,
      required: false,
      uppercase: true
    },
    afore: {
      type: String,
      required: false,
      uppercase: true
    },   
}, {
    collection: 'Clients'
});

module.exports = Client = mongoose.model('Clients', Client);