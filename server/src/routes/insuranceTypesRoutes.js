var express = require('express');
var router = express.Router();
const jwt = require("jsonwebtoken");

const Company = require("../models/CompanyForm");
const InsuranceType = require("../models/InsuranceTypeForm");
const secretKey = require("../config/config")

// agregar una aseguradora a un ramo
router.post("/:id", (req, res) => {
  const body = req.body;
  const companyName = body.name;

  jwt.verify(token, secretKey, function (err, _) {
    if (err) return res.status(401).json({ emailnotfound: "No tienes permisos para esta accion" });

    Company.findOne({ name: companyName })
      .then((company) => {
        return InsuranceType.findOneAndUpdate({ _id: req.params.id }, { $push: { reviews: company._id } }, { new: true });
      }).then((insuranceType) => {
        // If we were able to successfully update a Product, send it back to the client
        res.json(insuranceType)
      })
      .catch((err) => {
        // If an error occurred, send it to the client
        res.json(err)
      });
  });
});

// Obtener todos los ramos y sus aseguradoras
router.get("/fetch", (req, res) => {
  const token = req.headers.authorization;
  jwt.verify(token, secretKey, function (err) {
    if (err) return res.status(401).json({ email: "no permissions" });
    // This is the way I found to make a get all from model.
    InsuranceType.find({}).populate('companies').then((insuranceTypes) => {
      res.json({ insuranceTypes });
    }).catch(err => {
      res.json(err)
    });
  });
});

// borrar una aseguradora de un ramo
router.post("/:id/delete/:company_id", (req, res) => {
  const body = req.body;
  const token = body.token;

  jwt.verify(token, secretKey, function (err, _) {
    if (err) return res.status(401).json({ emailnotfound: "No tienes permisos para esta accion" });
    InsuranceType.updateOne({ _id: req.params.id }, { $pullAll: { companies: [req.params.company_id] } })
      .then((insuranceType) => {
        res.json(insuranceType)
      }).catch((err) => {
        res.json(err);
      })
  });
});

module.exports = router;