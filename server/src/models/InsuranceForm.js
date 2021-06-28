var mongoose = require("mongoose");

// Get the Schema constructor
var Schema = mongoose.Schema;

// Using Schema constructor, create a ProductSchema
var InsuranceSchema = new Schema({
  client: {
    type: Schema.Types.ObjectId,
    ref: 'Clients',
    required: true
  },
  comments: {
    type: String,
    required: false,
    uppercase: true
  },
  insurance_company: {
    type: Schema.Types.ObjectId,
    ref: 'Companies',
    required: true
  },
  invoices: [{
    type: Schema.Types.ObjectId,
    ref: 'Invoices',
    required: false
  }],
  colective_insurance: {
    type: Boolean,
    required: false,
    default: false
  },
  insurance_type: {
    type: String,
    required: true
  },
  policy: {
    type: String,
    required: true,
    uppercase: true
  },
  begin_date: {
    type: Date,
    required: true
  },
  due_date: {
    type: Date,
    required: true
  },
  pay_due_date: {
    type: Date,
    required: true
  },
  bounty: {
    type: String,
    required: false
  },
  net_bounty: {
    type: String,
    required: false
  },
  payment_type: {
    type: String,
    enum: ['ANUAL', 'SEMESTRAL', 'TRIMESTRAL', 'MENSUAL'],
    required: true,
    uppercase: true
  },
  pay_status: {
    type: String,
    enum: ['', 'PENDIENTE', 'PAGADO', 'COTIZACION', 'RENOVACION', 'CANCELADA'],
    required: false,
    default: 'PENDIENTE',
  },
  currency: {
    type: String,
    enum: ['PESO', 'DOLAR'],
    required: false,
    uppercase: true
  },
  email: {
    type: String,
    required: false,
    uppercase: false
  },
  telephone: {
    type: String,
    required: false,
    uppercase: true
  },
  comments: {
    type: String,
    required: false,
    uppercase: false
  },
  active_status: {
    type: Boolean,
    required: true,
    default: true
  },
  cancelation_note: {
    type: String,
    required: false,
    uppercase: false
  },
  endorsements: {
    type: Array,
    required: false
  },
  damage_product: {
    type: String,
    required: false
  },
  promoter: {
    type: String,
    required: false
  },
  // campos unicos de seguros de auto
  car_float: {
    type: [
      new mongoose.Schema({
        car_brand: {
          type: String,
          required: () => false,
          uppercase: true,
          default: null
        },
        car_year: {
          type: Number,
          required: () => false,
          default: null
        },
        car_description: {
          type: String,
          required: () => false,
          uppercase: true,
          default: null
        },
        car_series_number: {
          type: String,
          required: () => false,
          uppercase: true,
          default: null
        },
        car_placas: {
          type: String,
          required: false,
          uppercase: true,
          default: null
        },
        car_color: {
          type: String,
          required: false,
          uppercase: true,
          default: null
        },
        car_motor: {
          type: String,
          required: false,
          uppercase: true,
          default: null
        },
      })
    ],
    default: []
  },
  cis: {
    type: String,
    required: () => false,
    uppercase: true,
    default: null
  },
  car_brand: {
    type: String,
    required: () => false,
    uppercase: true,
    default: null
  },
  car_year: {
    type: Number,
    required: () => false,
    default: null
  },
  car_description: {
    type: String,
    required: () => false,
    uppercase: true,
    default: null
  },
  car_series_number: {
    type: String,
    required: () => false,
    uppercase: true,
    default: null
  },
  car_placas: {
    type: String,
    required: false,
    uppercase: true,
    default: null
  },
  car_color: {
    type: String,
    required: false,
    uppercase: true,
    default: null
  },
  car_motor: {
    type: String,
    required: false,
    uppercase: true,
    default: null
  },
  //files
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
        uploader: {
          type: String,
          required: false,
          default: ""
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
});

// Create model from the schema
var Insurance = mongoose.model("Insurances", InsuranceSchema);

// Export model
module.exports = Insurance;