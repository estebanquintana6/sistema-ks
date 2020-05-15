const Company = require("../models/CompanyForm");

let companies = [];

Company.find({}).then((docs) => {
    docs.map((doc) => {
        companies.push(doc);
    })
}).finally(() => {
    module.exports = companies
})

