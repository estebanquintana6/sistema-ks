var mongoose = require("mongoose");

// Get the Schema constructor
var Schema = mongoose.Schema;

// Using Schema constructor, create a ProductSchema
var InvoiceSchema = new Schema({
  status: {
    type: Boolean,
    required: true,
    default: true
  },
  payment_status: {
    type: Boolean,
    required: true,
    default: false
  },
  invoice: {
    type: String,
    required: true
  },
  due_date: {
    type: Date,
    required: true
  },
  pay_limit: {
    type: Date,
    required: true
  },
  insurance: {
    type: Schema.Types.ObjectId,
    ref: 'Insurances',
    required: true
  },
  client: {
    type: Schema.Types.ObjectId,
    ref: 'Clients',
    required: true
  }
});

// Create model from the schema
var Invoice = mongoose.model("Invoices", InvoiceSchema);

// Export model
module.exports = Invoice;