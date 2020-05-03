var express = require('express');
var router = express.Router();

const jwt = require("jsonwebtoken");
const secretKey = require("../config/config")

const Insurance = require("../models/InsuranceForm");
const Client = require("../models/ClientForm");
const Company = require("../models/CompanyForm")

const { substractYears } = require("../utils/dateUtils");
const { removeDiacritics } = require("../utils/bulkUtils");

Date.prototype.addDays = function(days) {
    var date = new Date(this.valueOf());
    date.setDate(date.getDate() + days);
    return date;
}

router.post("/bulk", (req, res) => {
    const body = req.body;
    const token = body.token;
    let insertedElements = 0;

    jwt.verify(token, secretKey, function (err, _) {
      if (err) return res.status(401).json({ emailnotfound: "No tienes permisos para esta accion" });
      const allData = body.bulkData;


      allData.map((car) => {
            const clientName = removeDiacritics(car.client.toUpperCase().trim());

            Client.findOne({name: clientName}).then((client) => {
                let clientId;
                if(!client) {
                    const missingClient = new Client({
                        name: clientName
                    })
                    missingClient.save().then((result) => {
                        clientId = result._id;
                    })
                } else {
                    clientId = client._id;
                }

                Company.findOne({name: car.insurance_company}).then((company) => {
                    delete car.client;
                    delete car.insurance_company;
                    
                    let due_date = new Date(car.due_date);
                    let begin_date = substractYears(due_date, 1);
                    let pay_due_date = begin_date.addDays(30);
                    
                    Insurance.findOne({ policy: car.policy}).then((insurance) => {
                        if(!insurance){
                            let insurance = new Insurance({
                                client: clientId,
                                insurance_company: company._id,
                                policy: car.policy,
                                payment_type: car.payment_type,
                                insurance_type: "AUTOS",
                                due_date: car.due_date,
                                begin_date: begin_date,
                                pay_due_date: pay_due_date,
                                car_description: car.car_description,
                                car_year: car.car_year,
                                car_brand: car.car_brand
                            });
        
                            insurance.save();
                            insertedElements = insertedElements +1;

                        }
                    });
                });
            });
      });
    });
});

module.exports = router;
