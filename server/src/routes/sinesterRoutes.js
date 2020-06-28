var express = require('express');
var router = express.Router();
const jwt = require("jsonwebtoken");

const secretKey = require("../config/config");


router.post("/save", (req, res) => {
    const body = req.body;
    const token = body.token;

    jwt.verify(token, secretKey, function (err, decoded) {
        if (err) return res.status(401).json({ emailnotfound: "No tienes permisos para esta accion" });
        const formData = body.data;

    });
});

module.exports = router;
