var mongoose = require('mongoose');
var Schema = mongoose.Schema;


var ResetPassword = new Schema({
    userId: {
        type: String,
        required: true
    },
    resetPasswordToken: {
        type: String,
        required: true
    },
    expire: {
        type: Number,
        required: true
    },
    status: {
        type: Number,
        required: true,
        default: 0
    }
}, {
    collection: 'ResetPassword'
});

module.exports = mongoose.model('ResetPassword', ResetPassword);