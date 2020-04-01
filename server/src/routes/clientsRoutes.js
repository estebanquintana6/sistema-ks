var express = require('express');
var router = express.Router();
const jwt = require("jsonwebtoken");

const User = require("../models/UserForm");
const Client = require("../models/ClientForm");
const secretKey = require("../config/config")

router.post("/save", (req, res) => {
  const body = req.body;
  const token = body.token;

  jwt.verify(token, secretKey, function (err, decoded) {
    if (err) return res.status(401).json({ emailnotfound: "No tienes permisos para esta accion" });
    const userEmail = decoded.email;
    const clientForm = body.clientData;


    const client = new Client(clientForm);
    client.save()
      .then((result) => {
        User.findOne({ email: userEmail }).then(user => {
          user.clients.push(client);
          user.save();
        }).catch((error) => {
          res.status(500).json({ error });
        });


      });
    res.json({ message: 'Forma de cliente guardada.' });

  });
});

router.post("/update", (req, res) => {
  const body = req.body;
  const token = body.token;
  const clientData = body.clientData;
  const id = clientData._id;
  jwt.verify(token, secretKey, function (err, _) {
    if (err) {
      return res.status(401).json({ email: "no permissions" });
    }
    Client.findOne({ _id: id }).then((client) => {
      if (client) {
        let doc = Client.findById(client.id);
        doc.updateOne(clientData).then((err, _) => {
          if (err) res.status(500);
          res.status(200).json({ message: "Elemento modificado" });
        });
      }
    });
  });
});

router.post("/delete", (req, res) => {
  const body = req.body;
  const token = body.token;
  const id = body.id;

  jwt.verify(token, secretKey, function (err, decoded) {
    if (err) return res.status(401).json({ email: "no permissions" });
    Client.findOne({ _id: id }).then((client) => {
      const exists = client;
      if (exists) {
        Client.deleteOne({ _id: id }).then((err, result) => {
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
    Client.find({}).then((clients) => {
      res.json({ clients });
    });
  });
});




module.exports = router;
