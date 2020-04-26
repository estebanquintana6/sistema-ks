var express = require('express');
var router = express.Router();
const jwt = require("jsonwebtoken");


const Invoice = require("../models/InvoiceForm");

const secretKey = require("../config/config")

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
