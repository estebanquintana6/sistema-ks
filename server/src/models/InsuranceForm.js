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
    required: true,
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
  payment_status: {
    type: Boolean,
    required: true,
    default: false
  },
  // campos unicos de seguros de auto
  cis: {
    type: String,
    required: () => this.insurance_type === "Auto",
    uppercase: true,
    default: null
  },
  car_model: {
    type: String,
    required: () => this.insurance_type === "Auto",
    uppercase: true,
    default: null
  },
  car_description: {
    type: String,
    required: () => this.insurance_type === "Auto",
    uppercase: true,
    default: null
  },
  car_series_number: {
    type: String,
    required: () => this.insurance_type === "Auto",
    uppercase: true,
    default: null
  }
});

// Create model from the schema
var Insurance = mongoose.model("Insurances", InsuranceSchema);

// Export model
module.exports = Insurance;