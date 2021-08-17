var arr = require('lodash/array');
var express = require('express');
var router = express.Router();
const fs = require('fs');

const jwt = require("jsonwebtoken");
const secretKey = require("../config/config")

const Insurance = require("../models/InsuranceForm");
const Invoice = require("../models/InvoiceForm");
const User = require("../models/UserForm");

const permissionMapper = {
  DANOS: 'DAÑOS',
  AUTOS: 'AUTO',
  GM: 'GMM',
  VIDA: 'VIDA'
}

const insuranceTypeMapper = {
  DAÑOS: 'DANOS',
  AUTO: 'AUTOS',
  GMM: 'GM',
  VIDA: 'VIDA'
}

relateInsuranceToInvoice = (invoice) => {
  Insurance.findOne({ _id: invoice.insurance }).then((insurance) => {
    if (!insurance.invoices.includes(invoice._id)) {
      insurance.invoices.push(invoice._id);
      insurance.save();
    }
  });
}

updateInvoice = (invoice, client) => {
  const update = {
    ...invoice,
    client: client
  }
  Invoice.findOneAndUpdate({ _id: invoice._id }, update).then((res, error) => {
    if (error) throw Error(error);
  });
}

onlyUnique = (value, index, self) => {
  return self.indexOf(value) === index;
}


router.post("/save", (req, res) => {
  const token = req.headers.authorization;
  const body = req.body;
  const insuranceData = body.insuranceData;

  const invoices = insuranceData.invoices;
  delete insuranceData.invoices;

  jwt.verify(token, secretKey, function (err, decoded) {
    if (err) return res.status(401).json({ emailnotfound: "No tienes permisos para esta accion" });

    User.findById(decoded.id).then(user => {
      if (!user) {
        return res.status(402);
      }
    })
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
  jwt.verify(token, secretKey, (err, decoded) => {
    if (err) {
      res.status(401).json({ email: "no permissions" });
      return
    }

    User.findById(decoded.id).then(user => {
      if (!user) {
        return res.status(402);
      }

      if (user.permissions.includes(permissionMapper[req.params.type])) {
        Insurance.find({ insurance_type: req.params.type })
          .populate('client')
          .populate('insurance_company')
          .populate('invoices')
          .then((insurances) => {
            res.status(200).json({ insurances });
          }).catch(err => {
            res.status(500).json(err)
          });
      } else {
        res.status(200).json({ insurances: [] });
      }
    })
  });
});

router.get("/fetchOne/:id", (req, res) => {
  const token = req.headers.authorization;
  jwt.verify(token, secretKey, function (err, decoded) {
    if (err) return res.status(401).json({ email: "no permissions" });

    User.findById(decoded.id).then(user => {
      if (!user) {
        return res.status(402);
      }
    })

    Insurance.findById(req.params.id)
      .populate('client')
      .populate('insurance_company')
      .populate('invoices')
      .then((insurance) => {
        res.json(insurance);
      }).catch(err => {
        res.json(err)
      });
  });
});

// Obtener todos las pólizas del tipo que se consulta
router.get("/fetch_all", (req, res) => {
  const token = req.headers.authorization;
  jwt.verify(token, secretKey, function (err, decoded) {

    User.findById(decoded.id).then(user => {
      if (!user) {
        return res.status(402);
      }

      if (err) return res.status(401).json({ email: "no permissions" });

      let permissions = user.permissions;
      let mappedPermissions = permissions.map((per) => insuranceTypeMapper[per])

      Insurance.find({
        insurance_type: { $in: mappedPermissions }
      })
        .populate('client')
        .populate('insurance_company')
        .populate('invoices')
        .then((insurances) => {
          res.json({ insurances });
        }).catch(err => {
          res.json(err)
        });
    });
  })

});

router.post("/update", (req, res) => {
  const body = req.body;
  const token = body.token;
  const insuranceData = body.insuranceData;
  const id = insuranceData._id;

  const invoices = insuranceData.invoices;
  delete insuranceData.invoices;

  jwt.verify(token, secretKey, function (err, decoded) {
    if (err) {
      return res.status(401).json({ email: "no permissions" });
    }

    User.findById(decoded.id).then(user => {
      if (!user) {
        return res.status(402);
      }
    })

    Insurance.findOne({ _id: id }).then(async (insurance) => {
      if (insurance) {
        insurance.invoices = insurance.invoices.filter(onlyUnique)
        insurance.save().then((insurance) => {
          invoices.map(invoice => {
            updateInvoice(invoice, insuranceData.client);
          })

          const toD = invoices.map(inv => inv._id).filter(e => e)
          const t = insurance.invoices.filter(e => e).map(inv => {
            return String(inv)
          })

          const n = arr.difference(t, toD);
          Invoice.deleteMany({ _id: { $in: n } }).exec()
          let doc = Insurance.findById(insurance.id);
          doc.updateOne(insuranceData).then((err, _) => {
            if (err) res.status(500);
            invoices.map(invoice => {
              try {
                invoice.client = insurance.client;
                invoice.insurance = insurance._id;
                Invoice.findById(invoice._id).then((res, err) => {
                  if (!res) {
                    const newInvoice = new Invoice(invoice);
                    newInvoice.save().then((invoiceResponse, err) => {
                      relateInsuranceToInvoice(invoiceResponse);
                    });
                  }
                })
              } catch (err) {
                res.status(500).json({ message: "Error al actualizar recibos" })
              }
            });
            res.status(200).json({ message: "Elemento modificado" });
          });
        })
      }
    });
  });
});

router.post("/:id/delete", (req, res) => {
  const token = req.headers.authorization;

  jwt.verify(token, secretKey, function (err, decoded) {
    if (err) return res.status(401).json({ emailnotfound: "No tienes permisos para esta accion" });

    User.findById(decoded.id).then(user => {
      if (!user) {
        return res.status(402);
      }
    })

    Insurance.findOne({ _id: req.params.id }).then((company) => {
      const exists = company;
      if (exists) {
        Insurance.deleteOne({ _id: req.params.id }).then((err, result) => {
          if (err) res.status(500);

          Invoice.find({ insurance: req.params.id }).then((invoices, err) => {
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

  jwt.verify(token, secretKey, function (err, decoded) {
    if (err) return res.status(401).json({ emailnotfound: "No tienes permisos para esta accion" });

    User.findById(decoded.id).then(user => {
      if (!user) {
        return res.status(402);
      }
    })

    Insurance.findOne({ _id: req.params.id }).then((company) => {
      const exists = company;
      if (exists) {
        Insurance.updateOne({ _id: req.params.id }, { active_status: false, cancelation_note: body.note, pay_status: "CANCELADA" }).then((err, result) => {
          if (err) res.status(500);

          Invoice.find({ insurance: req.params.id }).then((invoices, err) => {
            invoices.map(invoice => {
              Invoice.update({ _id: invoice._id }, { status: false }).exec();
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

  jwt.verify(token, secretKey, function (err, decoded) {
    if (err) return res.status(401).json({ emailnotfound: "No tienes permisos para esta accion" });

    User.findById(decoded.id).then(user => {
      if (!user) {
        return res.status(402);
      }
    })

    Insurance.findOne({ _id: req.params.id }).then((company) => {
      const exists = company;
      if (exists) {
        Insurance.updateOne({ _id: req.params.id }, { active_status: true, cancelation_note: "", pay_status: "" }).then((err, result) => {
          if (err) res.status(500);

          Invoice.find({ insurance: req.params.id }).then((invoices, err) => {
            invoices.map(invoice => {
              Invoice.update({ _id: invoice._id }, { status: true }).exec();
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

  jwt.verify(token, secretKey, function (err, decoded) {
    if (err) return res.status(401).json({ emailnotfound: "No tienes permisos para esta accion" });

    User.findById(decoded.id).then(user => {
      if (!user) {
        return res.status(402);
      }
    })

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

  const validTypes = ['pdf', 'docx', 'xlsx', 'jpeg', 'jpg', 'gif', 'png', 'zip'];

  jwt.verify(token, secretKey, function (err, decoded) {
    if (err) {
      return res.status(401).json({ email: "no permissions" });
    }

    User.findById(decoded.id).then(user => {
      if (!user) {
        return res.status(402);
      }

      if (req.files === null) {
        return res.status(400).json({ msg: 'No file uploaded' });
      }

      const file = req.files.file;

      let extensionRe = /(?:\.([^.]+))?$/;
      let ext = extensionRe.exec(file.name.toLowerCase())[1];

      if (!validTypes.includes(ext)) return res.status(402).send("El archivo recibo no es valido");

      const path = `/insurances/${id}/${file.name}`
      // const path =`/app/client/public/uploads/clients/${id}/${file.name}`
      // const downloadPath = `/uploads/clients/${id}/${file.name}`
      file.mv(path, err => {
        if (err) {
          return res.status(500).send(err);
        }
      });

      Insurance.findOne({ _id: id }).then((insurance) => {
        if (insurance) {
          const doc = Insurance.findById(insurance.id);

          const newFile = {
            path: path,
            uploader: `${user.name} ${user.last_name}`
          }

          const files = [...insurance.files, newFile];

          doc.updateOne({ files: files }).then((err, _) => {
            if (err) res.status(500);
            res.status(200).json({ fileName: file.name, filePath: path });
          });
        }
      });
    });
  })
});


router.post("/download", (req, res) => {
  const body = req.body;
  const token = body.token;
  const path = body.path

  jwt.verify(token, secretKey, function (err, decoded) {
    if (err) {
      return res.status(401).json({ email: "no permissions" });
    }

    User.findById(decoded.id).then(user => {
      if (!user) {
        return res.status(402);
      }
    })

    const pathArray = path.split('/')
    const name = pathArray[pathArray.length - 1]
    const nameArray = name.split('.')
    const extension = nameArray[nameArray.length - 1]
    const fullName = nameArray.slice(0, -1).join('.')
    const contents = fs.readFileSync(path, { encoding: 'base64' });
    // console.log('CONTENT', contents)
    res.status(200).json({ encoded: contents, fullName, extension });
    // res.download(path);
  });
});


router.post("/remove_file", (req, res) => {
  const body = req.body;
  const token = body.token;
  const id = body.id;
  const fileroute = body.path;
  jwt.verify(token, secretKey, function (err, decoded) {
    if (err) {
      return res.status(401).json({ email: "no permissions" });
    }

    User.findById(decoded.id).then(user => {
      if (!user) {
        return res.status(402);
      }
    })

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

        const index = files.map((file) => { return file.path }).indexOf(fileroute);

        files.splice(index, 1);
        doc.updateOne({ files: files }).then((err, _) => {
          if (err) res.status(500);
          res.status(200).json({ message: `${fileroute} eliminado` });
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

  jwt.verify(token, secretKey, function (err, decoded) {
    if (err) {
      return res.status(401).json({ email: "no permissions" });
    }

    User.findById(decoded.id).then(user => {
      if (!user) {
        return res.status(402);
      }
    })

    Insurance.findOne({ _id: id }).then((insurance) => {
      if (insurance) {
        let doc = Insurance.findById(insurance.id);
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


module.exports = router;