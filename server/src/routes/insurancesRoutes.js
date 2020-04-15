var express = require('express');
var router = express.Router();

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
    due_date: invoice.due_date
  }
  Invoice.findOneAndUpdate({_id: invoice._id}, update).exec();
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

router.post("/update", (req, res) => {
  const body = req.body;
  const token = body.token;
  const insuranceData = body.insuranceData;
  const id = insuranceData._id;

  const invoices = insuranceData.invoices;
  delete insuranceData.invoices;

  invoices.map(invoice => {
    updateInvoice(invoice);
  })


  jwt.verify(token, secretKey, function (err, _) {
    if (err) {
      return res.status(401).json({ email: "no permissions" });
    }
    Insurance.findOne({ _id: id }).then((insurance) => {
      if (insurance) {
        let doc = Insurance.findById(insurance.id);
        doc.updateOne(insuranceData).then((err, _) => {
          if (err) res.status(500);
          res.status(200).json({ message: "Elemento modificado" });
        });
      }
    });
  });
});

router.post("/:id/delete", (req, res) => {
  const body = req.body;
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

module.exports = router;