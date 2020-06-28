var express = require('express');
var router = express.Router();

const jwt = require("jsonwebtoken");
const secretKey = require("../config/config")

const Insurance = require("../models/InsuranceForm");
const Client = require("../models/ClientForm");
const Company = require("../models/CompanyForm")

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

    jwt.verify(token, secretKey, function (err, _) {
        if (err) return res.status(401).json({ emailnotfound: "No tienes permisos para esta accion" });
        const allData = body.bulkData;

        allData.map((data) => {
            Insurance.exists({ policy: data.policy }, function (err, res) {
                if (err) res.status(500).json(err);

                if (!res) {
                    Client.findOne({ rfc: data.rfc }).then((client) => {
                        let clientId;

                        if (!client) {
                            let contacts = [{
                                name: data.contact,
                                email: data.email,
                                telephone: data.telephone
                            }];

                            const missingClient = new Client({
                                name: data.name,
                                rfc: data.rfc,
                                contacts: contacts
                            });

                            missingClient.save().then((result) => {
                                clientId = result._id;
                            })
                        } else {
                            clientId = client._id;
                        }

                        Company.findOne({ name: data.insurance_company }).then((company) => {
                            delete data.no;
                            delete data.name;
                            delete data.insurance_company;

                            const due_date = new Date(data.due_date);
                            const begin_date = substractYears(due_date, 1);
                            const pay_due_date = begin_date.addDays(30);

                            let currency = null;

                            switch (data.coin) {
                                case "M.N": currency = 'PESO'; break;
                                default: currency = "PESO";
                            }

                            let insurance = new Insurance({
                                client: clientId,
                                insurance_company: company._id,
                                policy: data.policy,
                                payment_type: data.payment_type,
                                colective_insurance: data.colective_type === "COLECTIVO",
                                currency: currency,
                                insurance_type: "GM",
                                due_date: data.due_date,
                                begin_date: begin_date,
                                pay_due_date: pay_due_date
                            });

                            insurance.save();
                        })
                    })
                }
            });
        });
    });
});

module.exports = router;
