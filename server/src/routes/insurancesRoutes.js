var express = require('express');
var router = express.Router();
const jwt = require("jsonwebtoken");
const Insurance = require("../models/InsuranceForm");
const secretKey = require("../config/config")

router.post("/save", (req, res) => {
  const token = req.headers.authorization;
  const body = req.body;
  const insuranceData = body.insuranceData;

  jwt.verify(token, secretKey, function (err, _) {
    if (err) return res.status(401).json({ emailnotfound: "No tienes permisos para esta accion" });
    const insurance = new Insurance(insuranceData);
    insurance.save().then(() => {
      res.json({ message: 'Aseguradora guardada.' });
    }).catch((error) => {
      res.status(500).json({ error });
    });
  });
});

// Obtener todos las pólizas del tipo que se consulta
router.get("/fetch/:type", (req, res) => {
  const token = req.headers.authorization;
  jwt.verify(token, secretKey, function (err) {
    if (err) return res.status(401).json({ email: "no permissions" });
    Insurance.find({ insurance_type: req.params.type }).populate('client').populate('insurance_company').then((insurances) => {
      res.json({ insurances });
    }).catch(err => {
      res.json(err)
    });
  });
});

router.post("/update", (req, res) => {
  const body = req.body;
  const token = body.token;
  const insuranceData = body.insuranceData;
  const id = insuranceData._id;
  jwt.verify(token, secretKey, function (err, _) {
    if (err) {
      return res.status(401).json({ email: "no permissions" });
    }
    Insurance.findOne({ _id: id }).then((insurance) => {
      if (insurance) {
        let doc = Insurance.findById(insurance.id);
        doc.updateOne(insuranceData).then((err, _) => {
          if (err) res.status(500);
          res.status(200).json({ message: "Elemento modificado" });
        });
      }
    });
  });
});

router.post("/:id/delete", (req, res) => {
  const body = req.body;
  const token = req.headers.authorization;

  jwt.verify(token, secretKey, function (err, _) {
    if (err) return res.status(401).json({ emailnotfound: "No tienes permisos para esta accion" });
    Insurance.findOne({ _id: req.params.id }).then((company) => {
      const exists = company;
      if (exists) {
        Insurance.deleteOne({ _id: req.params.id }).then((err, result) => {
          if (err) res.status(500);
          res.status(201).json({ message: "Elemento eliminado" });
        });
      }
    });
  });
});

module.exports = router;