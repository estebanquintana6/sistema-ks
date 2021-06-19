var mongoose = require("mongoose");

// Get the Schema constructor
var Schema = mongoose.Schema;

// Using Schema constructor, create a ProductSchema
var TaskSchema = new Schema({
  title: {
    type: String,
    required: true
  },
  insurance_type: {
    type: String,
    required: false
  },
  insurance_company: {
    type: Schema.Types.ObjectId,
    ref: 'Companies',
    required: false
  },
  created_date: {
    type: Date,
    default: Date.now
  },
  status: {
    type: String,
    required: true
  },
  initiator: {
    type: Schema.Types.ObjectId,
    ref: 'users',
    required: true
  },
  assignee: [{
    type: Schema.Types.ObjectId,
    ref: 'users',
    required: true
  }],
  comments: {
    type: String,
    required: false
  }
});

// Create model from the schema
var Task = mongoose.model("Tasks", TaskSchema);

// Export model
module.exports = Task;