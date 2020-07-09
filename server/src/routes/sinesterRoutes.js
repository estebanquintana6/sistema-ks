var express = require('express');
var router = express.Router();
const jwt = require("jsonwebtoken");

const Sinester = require("../models/SinesterForm");

const secretKey = require("../config/config");
const fs = require('fs');


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
            history: data.history,
            status: data.status,
            ramo: data.ramo,
            company: data.company,
            sinesterType: data.sinesterType
        });
        sinester.save()
        .then(() => {
            res.status(200).json({message: "Siniestro registrado"})
          }).catch((error) => {
            console.log(error);
            res.status(500).json({ error });
          });
  
    });
});

router.post("/update", (req, res) => {
  const body = req.body;
  const token = body.token;
  const data = body.sinesterData;
  jwt.verify(token, secretKey, function (err, _) {
    if (err) {
      return res.status(401).json({ email: "no permissions" });
    }
    Sinester.findOne({ _id: data._id }).then((sinester) => {
      if (sinester) {
        let doc = Sinester.findById(data._id);
        doc.updateOne(data).then((err, _) => {
          if (err) res.status(500);
          res.status(200).json({ message: "Elemento modificado" });
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
    Sinester.find({}).populate('client').populate('company').then((sinesters) => {
      res.json({ sinesters });
    });
  });
});


// archivos
router.post("/upload", (req, res) => {
  const body = req.body;
  const token = body.token;
  const id = body.id

  const validTypes = ['pdf', 'docx', 'xlsx', 'jpeg', 'jpg', 'gif', 'png'];


  jwt.verify(token, secretKey, function (err, _) {
    if (err) {
      return res.status(401).json({ email: "no permissions" });
    }
    if (req.files === null) {
      return res.status(400).json({ msg: 'No file uploaded' });
    }

    const file = req.files.file;

    let extensionRe = /(?:\.([^.]+))?$/;
    let ext = extensionRe.exec(file.name.toLowerCase())[1];

    if (!validTypes.includes(ext)) return res.status(500).send("El archivo recibo no es valido");

    const path = `/sinesters/${id}/${file.name}`
    file.mv(path, err => {
      if (err) {
        console.error(err);
        return res.status(500).send(err);
      }
    });

    Sinester.findOne({ _id: id }).then((sinester) => {
      if (sinester) {
        const doc = Sinester.findById(sinester.id);

        const newFile = {
          path: path
        }

        const files = [...sinester.files, newFile];
        doc.updateOne({ files: files }).then((err, _) => {
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
  const id = body.id;
  const fileroute = body.path;

  jwt.verify(token, secretKey, function (err, _) {
    if (err) {
      return res.status(401).json({ email: "no permissions" });
    }
    Sinester.findOne({ _id: id }).then((sinester) => {
      if (sinester) {
        let doc = Sinester.findById(sinester.id);
        let files = [...sinester.files];

        fs.unlink(fileroute, (err) => {
          if (err) {
            res.status(500).json({ error: err });
          } else {
            console.log(`File deleted: ${fileroute} `);
          }
        })

        const index = files.map((file) => { return file.path }).indexOf(fileroute);

        files.splice(index, 1);
        console.log('SIN', doc)
        console.log('FILE', files)
        doc.updateOne({ files: files }).then((err, _) => {
          if (err) res.status(500);
          res.status(200).json({ message: `${fileroute} eliminado` });
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
    const pathArray = path.split('/')
    const name = pathArray[pathArray.length - 1]
    const nameArray = name.split('.')
    const extension = nameArray[nameArray.length - 1]
    const fullName = nameArray.slice(0, -1).join('.')
    const contents = fs.readFileSync(path, { encoding: 'base64' });
    res.status(200).json({ encoded: contents, fullName, extension });
  });
});

router.post("/save_file", (req, res) => {
  const body = req.body;
  const token = body.token;
  const fileData = body.fileData
  const id = body.id

  jwt.verify(token, secretKey, function (err, _) {
    if (err) {
      return res.status(401).json({ email: "no permissions" });
    }
    Sinester.findOne({ _id: id }).then((insurance) => {
      if (insurance) {
        let doc = Sinester.findById(insurance.id);
        let files = [...insurance.files];
        const index = files.map((file) => { return file.path }).indexOf(fileData.path);
        files[index] = fileData
        doc.updateOne({ files: files }).then((err, _) => {
          if (err) res.status(500);
          res.status(200).json({ message: `archivo eliminado` });
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
    Sinester.findOne({ _id: id }).then((sinester) => {
      const exists = sinester;
      if (exists) {
        Sinester.deleteOne({ _id: id }).then((err, result) => {
          if (err) res.status(500);
          res.status(201).json({ message: "Elemento eliminado" });
        });
      }
    });
  });
});

router.get("/fetch/:id", (req, res) => {
  const token = req.headers.authorization;
  jwt.verify(token, secretKey, function (err) {
    if (err) return res.status(401).json({ email: "no permissions" });
    Sinester.findById(req.params.id).populate('client').populate('company').then((sinester) => {
      res.json(sinester);
    }).catch(err => {
      res.json(err)
    });
  });
});

router.get("/fetch_sinister/:id", (req, res) => {
  const token = req.headers.authorization;
  jwt.verify(token, secretKey, function (err) {
    if (err) return res.status(401).json({ email: "no permissions" });
    Sinester.findOne({ $and: [{ 'sinester': req.params.id }, { 'sinesterType': 'INICIAL' }] }).populate('client').populate('company').then((sinester) => {
      res.json(sinester);
    }).catch(err => {
      res.json(err)
    });
  });
});


module.exports = router;
