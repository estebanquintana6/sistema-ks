var express = require('express');
var router = express.Router();
const jwt = require("jsonwebtoken");

const Sinester = require("../models/SinesterForm");

const secretKey = require("../config/config");


router.post("/save", (req, res) => {
    const body = req.body;
    const token = body.token;

    jwt.verify(token, secretKey, function (err, decoded) {
        if (err) return res.status(401).json({ emailnotfound: "No tienes permisos para esta accion" });
        const data = body.sinesterData;
        
        const sinester = new Sinester({
            client: data.client,
            affected: data.affected,
            folio: data.folio,
            sinester: data.sinester,
            description: data.description,
            begin_date: data.begin_date,
            history: data.history
        });

        sinester.save()
        .then(() => {
            res.status(200).json({message: "Siniestro registrado"})
          }).catch((error) => {
            res.status(500).json({ error });
          });
  
    });
});

module.exports = router;
