var mongoose = require("mongoose");

// Get the Schema constructor
var Schema = mongoose.Schema;

// Using Schema constructor, create a ProductSchema
var CompanySchema = new Schema({
  name: {
    type: String,
    required: true
  },
  tolerance: {
    type: Number,
    required: true
  }
});

// Create model from the schema
var Company = mongoose.model("Companies", CompanySchema);

// Export model
module.exports = Company;