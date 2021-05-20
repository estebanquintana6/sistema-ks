var express = require('express');
var router = express.Router();
const jwt = require("jsonwebtoken");

const Company = require("../models/CompanyForm");
const Users = require("../models/UserForm")
const secretKey = require("../config/config")

router.post("/save", (req, res) => {
  const body = req.body;
  const token = body.token;

  jwt.verify(token, secretKey, function (err, decoded) {
    if (err) return res.status(401).json({ emailnotfound: "No tienes permisos para esta accion" });
    User.findById(decoded.id).then(user => {
      if (!user) {
          return res.status(402);
      }
    })
    const companyForm = body.companyData;
    const company = new Company(companyForm);
    company.save().then((result) => {
      res.json({ message: 'Aseguradora guardada.' });
    }).catch((error) => {
      res.status(500).json({ error });
    });
  });
});

router.post("/update", (req, res) => {
  const body = req.body;
  const token = body.token;
  const companyData = body.companyData;
  const id = companyData._id;
  jwt.verify(token, secretKey, function (err, decoded) {
    if (err) return res.status(401).json({ email: "no permissions" });
    User.findById(decoded.id).then(user => {
      if (!user) {
          return res.status(402);
      }
    })
    Company.findOne({ _id: id }).then((company) => {
      if (!company) return res.status(404).json({ message: "Aseguradora no encontrada" });
      let doc = Company.findById(company.id);
      doc.updateOne(companyData).then((err, _) => {
        if (err) res.status(500);
        res.status(200).json({ message: "Elemento modificado" });
      });
    });
  });
});


router.post("/delete", (req, res) => {
  const body = req.body;
  const token = body.token;
  const id = body.id;

  jwt.verify(token, secretKey, function (err, decoded) {
    if (err) return res.status(401).json({ email: "no permissions" });
    User.findById(decoded.id).then(user => {
      if (!user) {
          return res.status(402);
      }
    })
    Company.findOne({ _id: id }).then((company) => {
      const exists = company;
      if (exists) {
        Company.deleteOne({ _id: id }).then((err, result) => {
          if (err) res.status(500);
          res.status(201).json({ message: "Elemento eliminado" });
        });
      }
    });
  });
});

router.get("/fetch", (req, res) => {
  const token = req.headers.authorization;
  jwt.verify(token, secretKey, function (err, decoded) {
    if (err) return res.status(401).json({ email: "no permissions" });
    User.findById(decoded.id).then(user => {
      if (!user) {
          return res.status(402);
      }
    })
    // This is the way I found to make a get all from model.
    Company.find({}).then((companies) => {
      res.json({ companies });
    });
  });
});




module.exports = router;
