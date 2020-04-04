var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var InsuranceType = new Schema({
  name: {
    type: String,
    required: true,
    uppercase: false
  },
  companies: {
    type: Array,
    required: false,
  }
}, {
  collection: 'InsuranceTypes'
});

module.exports = InsuranceType = mongoose.model('InsuranceTypes', InsuranceType);
