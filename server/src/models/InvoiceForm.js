var mongoose = require("mongoose");

// Get the Schema constructor
var Schema = mongoose.Schema;

// Using Schema constructor, create a ProductSchema
var InvoiceSchema = new Schema({
  invoice: {
    type: String,
    required: true
  },
  due_date: {
    type: Array,
    required: false
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