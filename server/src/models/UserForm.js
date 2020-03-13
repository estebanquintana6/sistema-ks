const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// Create Schema
const UserSchema = new Schema({
  name: {
    type: String,
    required: true,
    uppercase: true
  },
  last_name: {
    type:String,
    required: true,
    uppercase: true
  },
  email: {
    type: String,
    required: true
  },
  password: {
    type: String,
    required: true
  },
  date: {
    type: Date,
    default: Date.now
  },
  role: {
    type: String,
    default: "user"
  },
  clients: [{ type: Schema.Types.ObjectId, ref: 'Clients' }],
  secoms: [{ type: Schema.Types.ObjectId, ref: 'Secom' }],
  referidos: [{ type: Schema.Types.ObjectId, ref: 'Referidos' }]
});


module.exports = User = mongoose.model("users", UserSchema);