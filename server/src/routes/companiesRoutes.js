var express = require('express');
var router = express.Router();
const jwt = require("jsonwebtoken");

const Company = require("../models/CompanyForm");
const InsuranceType = require("../models/InsuranceTypeForm");
const secretKey = require("../config/config")

router.post("/save", (req, res) => {
  const body = req.body;
  const token = body.token;

  jwt.verify(token, secretKey, function (err, _) {
    if (err) return res.status(401).json({ emailnotfound: "No tienes permisos para esta accion" });
    const companyForm = body.clientData;
    const company = new Company(companyForm);
    company.save().then(() => null);
    res.json({ message: 'Aseguradora guardada.' });
  });
});

router.post("/update", (req, res) => {
  const body = req.body;
  const token = body.token;
  const companyData = body.companyData;
  const id = companyData._id;
  jwt.verify(token, secretKey, function (err, _) {
    if (err) return res.status(401).json({ email: "no permissions" });

    Company.findOne({ _id: id }).then((company) => {
      if (!company) return res.status(404).json({ message: "Aseguradora no encontrada" });
      let doc = Company.findById(client.id);
      doc.updateOne(companyData).then((err, _) => {
        if (err) res.status(500);
        res.status(200).json({ message: "Elemento modificado" });
      });
    });
  });
});

router.get("/fetch", (req, res) => {
  const token = req.headers.authorization;
  jwt.verify(token, secretKey, function (err) {
    if (err) return res.status(401).json({ email: "no permissions" });

    // This is the way I found to make a get all from model.
    Company.find({}).then((companies) => {
      res.json({ companies });
    });
  });
});




module.exports = router;
