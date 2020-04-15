var mongoose = require("mongoose");

// Get the Schema constructor
var Schema = mongoose.Schema;

// Using Schema constructor, create a ProductSchema
var TaskSchema = new Schema({
  title: {
    type: String,
    required: true
  },
  created_date: {
    type: Date,
    default: Date.now
  },
  due_date: {
    type: Date,
    required: false
  },
  status: {
    type: String,
    required: true
  },
  initiator: {
    type: Schema.Types.ObjectId,
    ref: 'users',
    required: true
  },
  assignee: {
    type: Schema.Types.ObjectId,
    ref: 'users',
    required: true
  },
});

// Create model from the schema
var Task = mongoose.model("Tasks", TaskSchema);

// Export model
module.exports = Task;