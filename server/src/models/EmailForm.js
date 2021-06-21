var mongoose = require("mongoose");

// Get the Schema constructor
var Schema = mongoose.Schema;

// Using Schema constructor, create a ProductSchema
var EmailSchema = new Schema({
    language: {
        type: String,
        required: true
    },
    reminderEmail: {
        type:
            new mongoose.Schema({
                header: {
                    type: String
                },
                content: {
                    type: String
                }
            }),
        required: true
    },
    lapsedEmail: {
        type:
            new mongoose.Schema({
                header: {
                    type: String
                },
                content: {
                    type: String
                }
            }),
        required: true
    }
});

// Create model from the schema
var Email = mongoose.model("Email", EmailSchema);

// Export model
module.exports = Email;