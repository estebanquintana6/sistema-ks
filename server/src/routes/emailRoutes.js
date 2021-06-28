const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
const secretKey = require("../config/config");
//Schema
const Email = require('../models/EmailForm');
const User = require("../models/UserForm")

// Get Specific
router.get("/fetch", (req, res) => {
    const token = req.headers.authorization;

    jwt.verify(token, secretKey, function (err, decoded) {

        if (err) {
            res.status(401).json({ email: "no permissions" });
            return;
        }

        User.findById(decoded.id).then(user => {
            if (!user || user.role !== ('admin' || 'superadmin')) {
                res.status(402);
                return;
            }
        })
        // This is the way I found to make a get all from model.
        Email.find({}).then((emails) => {
            res.json({ emails });
        });
    });
});


router.post("/update", (req, res) => {
    const body = req.body;
    const token = req.headers.authorization;
    const emailData = body.email;

    jwt.verify(token, secretKey, function (err, decoded) {

        if (err) {
            res.status(401).json({ email: "no permissions" });
            return;
        }

        User.findById(decoded.id).then(user => {
            if (!user || user.role !== ('admin' || 'superadmin')) {
                res.status(402);
                return;
            }
        })

        Email.findOne({ _id: emailData._id }).then((email) => {
            if (!email) {
                res.status(404).json({ message: "Email no encontrado" });
                return;
            }
            email.update(emailData).then((updated) => {
                res.status(200).json(updated)
            }).catch((err) => {
                res.status(500).json(err)
            })
        });

    })
});

module.exports = router;
