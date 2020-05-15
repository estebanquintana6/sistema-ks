var express = require('express');
var router = express.Router();
const jwt = require("jsonwebtoken");

const User = require("../models/UserForm");
const Client = require("../models/ClientForm");
const secretKey = require("../config/config")
const fileUpload = require('express-fileupload');


const { isEmpty, removeDiacritics } = require("../utils/bulkUtils");

router.post("/save", (req, res) => {
  const body = req.body;
  const token = body.token;

  jwt.verify(token, secretKey, function (err, decoded) {
    if (err) return res.status(401).json({ emailnotfound: "No tienes permisos para esta accion" });
    const userEmail = decoded.email;
    const clientForm = body.clientData;

    clientForm.name = removeDiacritics(clientForm.name).trim();

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

router.post("/bulk", (req, res) => {
  const body = req.body;
  const token = body.token;

  jwt.verify(token, secretKey, function (err, _) {
    if (err) return res.status(401).json({ emailnotfound: "No tienes permisos para esta accion" });
    const allData = body.bulkData;

    allData.map((clientData) => {
      delete clientData.no;
      
      const contactKeys = ["contact", "correo", "tel"];
      const contactTransformationKeys = ["name", "email", "telephone"];

      clientData.name = removeDiacritics(clientData.name).trim();

      let contacts = [];

      for(let i = 1; i<4; i++){
        let contact = {};
        contactKeys.map((key, index) => {
          let dataKey = `${key}${i}`;
          let targetKey = contactTransformationKeys[index];
          if(clientData[dataKey] != undefined) {
            contact[targetKey] = clientData[dataKey]
            delete clientData[dataKey];
          };
        })
        if(!isEmpty(contact)) contacts.push(contact);
      }

      clientData["contacts"] = contacts;

      const client = new Client(clientData);

      Client.find({
        $and: [{rfc: clientData.rfc}, {name: clientData.name}]
      }).then((res, err) => {
        if(isEmpty(res)) client.save();
      })

    })
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

router.post("/upload", (req, res) => {
  const body = req.body;
  const token = body.token;
  const id = body.id

  console.log('BODY', token, id)
  jwt.verify(token, secretKey, function (err, _) {
    if (err) {
      return res.status(401).json({ email: "no permissions" });
    }
    if (req.files === null) {
      return res.status(400).json({ msg: 'No file uploaded' });
    }
  
    const file = req.files.file;
    const path =` ${__dirname}/clients/${id}/${file.name}`
    // const path =`/app/client/public/uploads/clients/${id}/${file.name}`
    // const downloadPath = `/uploads/clients/${id}/${file.name}`
    file.mv(path, err => {
      if (err) {
        console.error(err);
        return res.status(500).send(err);
      }
    },);
    Client.findOne({ _id: id }).then((client) => {
      if (client) {
        let doc = Client.findById(client.id);
        const files = [...client.files, path]
        doc.updateOne({files: files}).then((err, _) => {
          if (err) res.status(500);
          res.status(200).json({ fileName: file.name, filePath: path });
        });
      }
    });
  });
});

router.post("/remove_file", (req, res) => {
  const body = req.body;
  const token = body.token;
  const id = body.id
  const fileroute = body.route

  jwt.verify(token, secretKey, function (err, _) {
    if (err) {
      return res.status(401).json({ email: "no permissions" });
    }
    Client.findOne({ _id: id }).then((client) => {
      if (client) {
        let doc = Client.findById(client.id);
        let files = [...client.files]
        const index = files.indexOf(fileroute)
        files = files.splice(index, 1)
        doc.updateOne({files: files}).then((err, _) => {
          if (err) res.status(500);
          res.status(200).json({ message: `${fileroute} eliminado`});
        });
      }
    });
  });
});

router.post("/download", (req, res) => {
  const body = req.body;
  const token = body.token;
  const path = body.path
  
  jwt.verify(token, secretKey, function (err, _) {
    if (err) {
      return res.status(401).json({ email: "no permissions" });
    }
    console.log('AUTHORIZED AND', token, path)
    res.download(path);
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
