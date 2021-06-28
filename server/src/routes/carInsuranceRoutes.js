var express = require('express');
var router = express.Router();

const jwt = require("jsonwebtoken");
const secretKey = require("../config/config")

const Insurance = require("../models/InsuranceForm");
const Client = require("../models/ClientForm");
const Company = require("../models/CompanyForm")
const User = require("../models/UserForm")

const { substractYears } = require("../utils/dateUtils");
const { removeDiacritics } = require("../utils/bulkUtils");

Date.prototype.addDays = function (days) {
    var date = new Date(this.valueOf());
    date.setDate(date.getDate() + days);
    return date;
}

router.post("/bulk", (req, res) => {
    const body = req.body;
    const token = body.token;
    let insertedElements = 0;

    jwt.verify(token, secretKey, function (err, decoded) {
        if (err) return res.status(401).json({ emailnotfound: "No tienes permisos para esta accion" });
        User.findById(decoded.id).then(user => {
            if (!user) {
                return res.status(402);
            }
        })

        const allData = body.bulkData;


        allData.map((car) => {
            const clientName = removeDiacritics(car.client.toUpperCase().trim());

            Client.findOne({ name: clientName }).then((client) => {
                let clientId;
                if (!client) {
                    const missingClient = new Client({
                        name: clientName
                    })
                    missingClient.save().then((result) => {
                        clientId = result._id;
                    })
                } else {
                    clientId = client._id;
                }

                Company.findOne({ name: car.insurance_company }).then((company) => {
                    delete car.client;
                    delete car.insurance_company;

                    const colective_insurance = car.colective_insurance === 'Individual' ? false : true;

                    const due_date = new Date(car.due_date);
                    const begin_date = substractYears(due_date, 1);
                    const pay_due_date = begin_date.addDays(30);

                    let companyId;

                    if(!company) {
                        const missingCompany = new Company({
                            name: (car.insurance_company || 'SIN NOMBRE'),
                            tolerance: 30
                        })
                        missingCompany.save().then((c) => {
                            companyId = c._id;
                        })
                    } else {
                        companyId = company._id;
                    }

                    Insurance.findOne({ policy: car.policy }).then((insurance) => {
                        if (!insurance) {
                            let insurance = new Insurance({
                                client: clientId,
                                insurance_company: companyId,
                                policy: car.policy,
                                colective_insurance: colective_insurance,
                                insurance_type: "AUTOS",
                                due_date: new Date(car.due_date),
                                pay_due_date: new Date(pay_due_date),
                            });

                            insurance.save();
                            insertedElements = insertedElements + 1;

                        }
                    });
                });
            });
        });
    });
});

module.exports = router;
