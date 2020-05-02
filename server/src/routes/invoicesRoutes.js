var express = require('express');
var router = express.Router();
const jwt = require("jsonwebtoken");


const Invoice = require("../models/InvoiceForm");

const secretKey = require("../config/config")


router.post("/update", (req, res) => {
  const body = req.body;
  const token = body.token;
  const invoiceData = body.invoiceData;
  const id = invoiceData._id;
  jwt.verify(token, secretKey, function (err, _) {
    if (err) return res.status(401).json({ email: "no permissions" });
    Invoice.findOne({ _id: id }).then((invoice) => {
      if (!invoice) return res.status(404).json({ message: "Recibo no encontrado" });
      let doc = Invoice.findById(invoice.id);
      doc.updateOne(invoiceData).then((err, _) => {
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
    Invoice.findOne({ _id: id }).then((task) => {
      const exists = task;
      if (exists) {
        Invoice.deleteOne({ _id: id }).then((err, result) => {
          if (err) res.status(500);
          res.status(201).json({ message: "Elemento eliminado" });
        });
      }
    });
  });
});


router.get("/fetch", (req, res) => {
    const token = req.headers.authorization;
    jwt.verify(token, secretKey, function (err) {
      if (err) {
        return res.status(401).json({ email: "no permissions" });
      }
      // This is the way I found to make a get all from model.
      Invoice.find({}).populate('client').populate('insurance').then((invoices) => {
        res.json({ invoices });
      });
    });
});

module.exports = router;
