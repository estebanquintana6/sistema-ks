var mongoose = require("mongoose");

// Get the Schema constructor
var Schema = mongoose.Schema;

// Using Schema constructor, create a ProductSchema
var InsuranceSchema = new Schema({
  client: {
    type: Schema.Types.ObjectId,
    ref: 'Clients',
    required: false
  },
  client_name: {
    type: String,
    required: true,
    uppercase: true
  },
  insurance_company: {
    type: Schema.Types.ObjectId,
    ref: 'Companies',
    required: true
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
  due_date: {
    type: Date,
    required: true
  },
  bounty: {
    type: Number,
    required: true
  },
  payment_type: {
    type: String,
    enum: ['ANUAL', 'SEMESTRAL', 'TRIMESTRAL', 'MENSUAL'],
    required: true,
    uppercase: true
  },
  currency: {
    type: String,
    enum: ['PESO', 'DOLAR'],
    required: true,
    uppercase: true
  },
  contacts: {
    type: Array,
    required: false
  },
  email: {
    type: String,
    required: true,
    uppercase: false
  },
  telephone: {
    type: String,
    required: true,
    uppercase: true
  },
  comments: {
    type: String,
    required: false,
    uppercase: false
  },
  payment_status: {
    type: Boolean,
    required: true,
    default: false
  },
  // campos unicos de seguros de auto
  cis: {
    type: String,
    required: function() {
        this.insurance_type == "Auto"
    },
    uppercase: true,
    default: null
  },
  car_model: {
    type: String,
    required: function() {
        this.insurance_type === "Auto"
    },
    uppercase: true,
    default: null
  },
  car_description: {
    type: String,
    required: function() {
        this.insurance_type === "Auto"
    },
    uppercase: true,
    default: null 
  },
  car_series_number: {
    type: String,
    required: function() {
        this.insurance_type === "Auto"
    },
    uppercase: true,
    default: null 
  }
});

// Create model from the schema
var Insurance = mongoose.model("Insurances", InsuranceSchema);

// Export model
module.exports = Insurance;