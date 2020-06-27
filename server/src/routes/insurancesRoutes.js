var arr = require('lodash/array');
var express = require('express');
var router = express.Router();
const fs = require('fs');

const jwt = require("jsonwebtoken");
const secretKey = require("../config/config")

const Insurance = require("../models/InsuranceForm");
const Invoice = require("../models/InvoiceForm");


relateInsuranceToInvoice = (invoice) => {
  Insurance.findOne({ _id: invoice.insurance }).then((insurance) => {
    insurance.invoices.push(invoice._id);
    insurance.save();
  });
}

updateInvoice = (invoice) => {
  const update = {
    invoice: invoice.invoice,
    due_date: invoice.due_date,
    bounty: invoice.bounty,
    payment_status: invoice.payment_status,
    pay_limit: invoice.pay_limit,
    pay_limit2: invoice.pay_limit2,
    comments: invoice.comments,
    email: invoice.email,
  }
  Invoice.findOneAndUpdate({_id: invoice._id}, update).then((res, error) => {
    if(error) throw Error(error);
  });
}

router.post("/save", (req, res) => {
  const token = req.headers.authorization;
  const body = req.body;
  const insuranceData = body.insuranceData;

  const invoices = insuranceData.invoices;
  delete insuranceData.invoices;

  jwt.verify(token, secretKey, function (err, _) {
    if (err) return res.status(401).json({ emailnotfound: "No tienes permisos para esta accion" });
    const insurance = new Insurance(insuranceData);

    insurance.save().then((insurance, err) => {
      
      invoices.map(invoice => {
        invoice.client = insurance.client;
        invoice.insurance = insurance._id;

        const newInvoice = new Invoice(invoice);
        
        newInvoice.save().then((invoiceResponse, err) => {
          relateInsuranceToInvoice(invoiceResponse);
        });
      });
      
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
    Insurance.find({ insurance_type: req.params.type }).populate('client').populate('insurance_company').populate('invoices').then((insurances) => {
      res.json({ insurances });
    }).catch(err => {
      res.json(err)
    });
  });
});

// Obtener todos las pólizas del tipo que se consulta
router.get("/fetch_all", (req, res) => {
  const token = req.headers.authorization;
  jwt.verify(token, secretKey, function (err) {
    if (err) return res.status(401).json({ email: "no permissions" });
    Insurance.find({}).populate('client').populate('insurance_company').populate('invoices').then((insurances) => {
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

  const invoices = insuranceData.invoices;
  delete insuranceData.invoices;

  jwt.verify(token, secretKey, function (err, _) {
    if (err) {
      return res.status(401).json({ email: "no permissions" });
    }
    Insurance.findOne({ _id: id }).then((insurance) => {
      if (insurance) {
        invoices.map(invoice => {
          updateInvoice(invoice);
        })
        const toD = invoices.map(inv => inv._id).filter(e=>e)
        const t = insurance.invoices.filter(e=>e).map(inv => {
          return String(inv)
        })
        const n = arr.difference(t, toD);
        Invoice.deleteMany({_id: {$in: n}}).exec()
        let doc = Insurance.findById(insurance.id);
        doc.updateOne(insuranceData).then((err, _) => {
          invoices.map(invoice => {
            invoice.client = insurance.client;
            invoice.insurance = insurance._id;
    
            const newInvoice = new Invoice(invoice);
            
            newInvoice.save().then((invoiceResponse, err) => {
              relateInsuranceToInvoice(invoiceResponse);
            });
          });
          if (err) res.status(500);
          res.status(200).json({ message: "Elemento modificado" });
        });
      }
    });
  });
});

router.post("/:id/delete", (req, res) => {
  const token = req.headers.authorization;

  jwt.verify(token, secretKey, function (err, _) {
    if (err) return res.status(401).json({ emailnotfound: "No tienes permisos para esta accion" });
    Insurance.findOne({ _id: req.params.id }).then((company) => {
      const exists = company;
      if (exists) {
        Insurance.deleteOne({ _id: req.params.id }).then((err, result) => {
          if (err) res.status(500);

          Invoice.find({insurance: req.params.id}).then((invoices, err) => {
            invoices.map(invoice => {
              Invoice.findByIdAndDelete(invoice._id).exec();
            })
          })

          res.status(201).json({ message: "Elemento eliminado" });
        });
      }
    });
  });
});


router.post("/:id/cancel", (req, res) => {
  const body = req.body;
  const token = req.headers.authorization;

  jwt.verify(token, secretKey, function (err, _) {
    if (err) return res.status(401).json({ emailnotfound: "No tienes permisos para esta accion" });
    Insurance.findOne({ _id: req.params.id }).then((company) => {
      const exists = company;
      if (exists) {
        Insurance.updateOne({ _id: req.params.id }, {active_status: false, cancelation_note: body.note, pay_status: "CANCELADA"}).then((err, result) => {
          if (err) res.status(500);

          Invoice.find({insurance: req.params.id}).then((invoices, err) => {
            invoices.map(invoice => {
              Invoice.update({_id: invoice._id}, {status: false}).exec();
            })
          })

          res.status(201).json({ message: "Elemento cancelado" });
        });
      }
    });
  });
});

router.post("/:id/activate", (req, res) => {
  const body = req.body;
  const token = req.headers.authorization;

  jwt.verify(token, secretKey, function (err, _) {
    if (err) return res.status(401).json({ emailnotfound: "No tienes permisos para esta accion" });
    Insurance.findOne({ _id: req.params.id }).then((company) => {
      const exists = company;
      if (exists) {
        Insurance.updateOne({ _id: req.params.id }, {active_status: true, cancelation_note: "", pay_status: ""}).then((err, result) => {
          if (err) res.status(500);

          Invoice.find({insurance: req.params.id}).then((invoices, err) => {
            invoices.map(invoice => {
              Invoice.update({_id: invoice._id}, {status: true}).exec();
            })
          })

          res.status(201).json({ message: "Elemento activado" });
        });
      }
    });
  });
});


router.post("/:id/payStatus", (req, res) => {
  const token = req.headers.authorization;
  const status = req.body.status;

  jwt.verify(token, secretKey, function (err, _) {
    if (err) return res.status(401).json({ emailnotfound: "No tienes permisos para esta accion" });
    Insurance.findOne({ _id: req.params.id }).then((insurance) => {
        insurance.pay_status = status;
        insurance.save();
        res.status(201).json({ message: "Elemento cambiado" });
    });
  });
});


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

    if(!validTypes.includes(ext)) return res.status(500).send("El archivo recibo no es valido");

    const path =`/insurances/${id}/${file.name}`
    // const path =`/app/client/public/uploads/clients/${id}/${file.name}`
    // const downloadPath = `/uploads/clients/${id}/${file.name}`
    file.mv(path, err => {
      if (err) {
        return res.status(500).send(err);
      }
    },);

    Insurance.findOne({ _id: id }).then((insurance) => {
      if (insurance) {
        const doc = Insurance.findById(insurance.id);
        
        const newFile = {
          path: path
        }

        const files = [...insurance.files, newFile];

        doc.updateOne({files: files}).then((err, _) => {
          if (err) res.status(500);
          res.status(200).json({ fileName: file.name, filePath: path });
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
    const contents = fs.readFileSync(path, {encoding: 'base64'});
    // console.log('CONTENT', contents)
    res.status(200).json({ encoded: contents, fullName, extension});
    // res.download(path);
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
    Insurance.findOne({ _id: id }).then((insurance) => {
      if (insurance) {
        let doc = Insurance.findById(insurance.id);
        let files = [...insurance.files];
        
        fs.unlink(fileroute, (err) => {
          if (err) {
            console.log(`File not found: ${fileroute} `);
          } else {
            console.log(`File deleted: ${fileroute} `);
          }        
        })
        
        const index = files.map((file) => { return file.path}).indexOf(fileroute);

        files.splice(index, 1);
        doc.updateOne({files: files}).then((err, _) => {
          if (err) res.status(500);
          res.status(200).json({ message: `${fileroute} eliminado`});
        });
      }
    });
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
    Insurance.findOne({ _id: id }).then((insurance) => {
      if (insurance) {
        let doc = Insurance.findById(insurance.id);
        let files = [...insurance.files];
        const index = files.map((file) => { return file.path}).indexOf(fileData.path);
        files[index] = fileData
        doc.updateOne({files: files}).then((err, _) => {
          if (err) res.status(500);
          res.status(200).json({ message: `archivo eliminado`});
        });
      }
    });
  });
});


module.exports = router;