var express = require('express');
var router = express.Router();
const InsuranceType = require("./models/InsuranceTypeForm");

const createInsuranceType = (name) => {
    const insurance = new InsuranceType({name, companies: []});
    InsuranceType.findOne({name}).then(res => {
        const exists = res;
        if (exists) return;
        insurance.save().then((result) => {
            console.log('OBJECT CREATED', result);
        })
    })
}
const initializeDb = () => {
    createInsuranceType('GMM')
    createInsuranceType('VIDA')
    createInsuranceType('AUTO')
    createInsuranceType('DAÑOS')
    createInsuranceType('TRANSPORTE')
}

module.exports = initializeDb