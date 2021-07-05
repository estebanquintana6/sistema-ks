var express = require('express');
var router = express.Router();

const jwt = require("jsonwebtoken");
const secretKey = require("../config/config")

const Insurance = require("../models/InsuranceForm");
const Client = require("../models/ClientForm");
const Company = require("../models/CompanyForm")
const User = require("../models/UserForm")
const InsuranceType = require('../models/InsuranceTypeForm')

const { substractYears } = require("../utils/dateUtils");
const { removeDiacritics, translateBulkData } = require("../utils/bulkUtils");

Date.prototype.addDays = function (days) {
    var date = new Date(this.valueOf());
    date.setDate(date.getDate() + days);
    return date;
}

const insuranceTypeMapper = {
    "GM": "GMM",
    "DANOS": "DAÑOS",
    "VIDA": "VIDA",
    "AUTOS": "AUTO"
}

const parseDate = (dateStr = '') => {
    const splittedStr = dateStr?.split('-')
    if (splittedStr?.length < 3) {
        return new Date()
    } else {
        return new Date(+splittedStr[2],
            +splittedStr[1] - 1,
            +splittedStr[0])
    }
}

const bulkJsonData = (parsedData) => {

}

router.post("/bulk", (req, res) => {
    const body = req.body;
    const token = body.token;

    jwt.verify(token, secretKey, (err, decoded) => {
        if (err) return res.status(401).json({ emailnotfound: "No tienes permisos para esta accion" });
        User.findById(decoded.id).then(user => {
            if (!user) {
                return res.status(402);
            }
        })

        const dataToBulk = body.bulkData;
        const data_type = body.type;

        const parsedData = translateBulkData(dataToBulk)
        let insertedElements = 0;

        try {
            parsedData.map(async (dataObj) => {
                let clientId = '';
                const client = await Client.findOne({ name: dataObj.client }).exec()
                if (!client) {
                    const missingClient = new Client({
                        name: dataObj.client || 'SIN NOMBRE',
                        rfc: dataObj.rfc,
                        person_type: dataObj.person_type
                    })
                    const newClient = await missingClient.save()
                    clientId = newClient._id
                } else {
                    clientId = client._id
                }

                const insuranceCompany = await Company.findOne({ name: dataObj.insurance_company }).exec()
                let insuranceCompanyId = ''

                if (!insuranceCompany) {
                    const missingCompany = new Company({
                        name: (dataObj.insurance_company || 'SIN NOMBRE'),
                        tolerance: 30
                    })
                    const newCompany = await missingCompany.save()
                    insuranceCompanyId = newCompany._id
                } else {
                    insuranceCompanyId = insuranceCompany._id
                }


                Insurance.findOne({ policy: dataObj.policy }).then((insurance) => {
                    if (!insurance) {
                        let insurance = new Insurance({
                            ...dataObj,
                            client: clientId,
                            insurance_company: insuranceCompanyId,
                            policy: dataObj.policy,
                            colective_insurance: dataObj.colective_insurance === 'Colectivo' ? true : false,
                            insurance_type: data_type,
                            begin_date: parseDate(dataObj.begin_date),
                            payment_type: dataObj.payment_type,
                            due_date: parseDate(dataObj.due_date),
                            pay_due_date: parseDate(dataObj.pay_due_date),
                            pay_status: dataObj.pay_status
                        });

                        insurance.save((err, ins) => {
                            if(err) {
                                console.log(err)
                            }
                        })
                    }
                });
            })
        } catch (err) {
            console.log(err)
        } finally {
            res.status(200).json({'message': `Perfecto`})
        }

    });
});

module.exports = router;
