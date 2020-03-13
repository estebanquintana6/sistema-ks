var mongoose = require('mongoose');
var Schema = mongoose.Schema;


var AccessToken = new Schema({
    email: {
        type: String,
        required: true
    },
    access_token: {
        type: String,
        required: true
    },
    expires_at: {
        type: String,
        required: true
    }
}, {
    collection: 'AccessTokens'
});

module.exports = mongoose.model('AccessToken', AccessToken);