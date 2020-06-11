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
    type: String,
    enum: ['PENDIENTE', 'PAGADO', 'VENCIDO', 'SALDO A FAVOR', 'CANCELADO'],
    required: true,
    default: 'PENDIENTE',
  },
  bounty: {
    type: String,
    required: false
  },
  invoice: {
    type: String,
    required: true
  },
  comments: {
    type: String,
    required: false
  },
  email_comment: {
    type: String,
    required: false
  },
  email: {
    type: String,
    required: false
  },
  due_date: {
    type: Date,
    required: false
  },
  pay_limit: {
    type: Date,
    required: false
  },
  pay_limit2: {
    type: Date,
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