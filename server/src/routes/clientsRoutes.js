var express = require('express');
var router = express.Router();
const jwt = require("jsonwebtoken");

const User = require("../models/UserForm");
const Client = require("../models/ClientForm");
const Referido = require("../models/ReferidoForm");
const secretKey = require("../config/config")
const moment = require('moment');

getProducts = (obj) => {
    const products = [];

    let i = 1;
    while(true){
        let key = "producto" + i;
        if(obj.hasOwnProperty(key)){
            products.push(obj[key]);
            delete obj[key];
        } else {
            break;
        }
        i++;
    }

    return products;
}

getPorCerrar = (obj) => {
    const products = [];
    const cerrados = [];
    let i = 1;
    while(true){
        let key = "porCerrar" + i;
        if(obj.hasOwnProperty(key)){
            let statusKey = "status" + key;

            let value = obj[key];
            let status = obj[statusKey];
            if(status !== "Venta"){
                products.push({
                    producto: value,
                    status: status
                });
            } else {
                cerrados.push(value);
            }
            delete obj[key];
            delete obj[statusKey];

        } else {
            break;
        }
        i++;
    }

    return {
        products,
        cerrados
    };
}

router.post("/save", (req, res) => {
    const body = req.body;
    const token = body.token;

    jwt.verify(token, secretKey, function(err, decoded) {
        if(err) return res.status(401).json({ emailnotfound: "No tienes permisos para esta accion" });
        const userEmail = decoded.email;
        const clientForm = body.clientData;

        let products = getProducts(clientForm);
        let productosPendientes = getPorCerrar(clientForm);

        console.log(productosPendientes.cerrados);
        console.log(productosPendientes.products);

        products = products.concat(productosPendientes.cerrados);

        clientForm.porCerrar = productosPendientes.products;
        clientForm.productos = products;
        delete clientForm.llamarField;
        clientForm.whatsapp = clientForm.wp;
        delete clientForm.wp;
        delete clientForm.porcerrar;

        let birthday = moment(clientForm.cumpleanos);
        clientForm.cumpleanos = birthday.format("DD/MM/YYYY");

        let callDate = moment(clientForm.callDate);
        clientForm.callDate = callDate.format("DD/MM/YYYY");


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
        let referido;

        if(clientForm.referido1){
            let nombre = clientForm.referido1;
            let contacto = clientForm.contactoreferido1;
            let telefono = clientForm.telefonoreferido1;

            let data = {
                referido: nombre,
                contactoreferido: contacto,
                telefono: telefono
            }
            referido = new Referido(data);
            referido.save()
            .then((result) => {
                User.findOne({ email: userEmail }).then(user => {
                    user.referidos.push(referido);
                    user.save();

                });
            });
        }
        if(clientForm.referido2){
            referido = new Referido();
            let nombre = clientForm.referido2;
            let contacto = clientForm.contactoreferido2;
            let telefono = clientForm.telefonoreferido2;

            let data = {
                referido: nombre,
                contactoreferido: contacto,
                telefono: telefono
            }

            referido = new Referido(data);
            referido.save()
            .then((result) => {
                User.findOne({ email: userEmail }).then(user => {
                    user.referidos.push(referido);
                    user.save();
                });
            });
        }

        res.json({ message: 'Forma de cliente guardada.' });

     });
});

router.post("/update", (req, res) => {
    const body = req.body;
    const token = body.token;
    const clientData = body.clientData;
    const id = body.id;

    jwt.verify(token, secretKey, function(err, decoded) {
        if (err) {
            return res.status(401).json({ email: "no permissions" });
        }
        const userEmail = decoded.email;
        User.findOne({ email: userEmail }).then((user) => {
            const exists = user.clients.includes(id);
            if(exists){
                let doc = Client.findById(id);
                doc.update(clientData).then((err, result) => {
                    if(err) res.status(500);
                    res.status(201).json({message: "Elemento modificado"});
                });
            }
        });
    });
});

router.post("/delete", (req, res) => {
    const body = req.body;
    const token = body.token;
    const id = body.id;

    jwt.verify(token, secretKey, function(err, decoded) {
        if (err) {
            return res.status(401).json({ email: "no permissions" });
        }
        const userEmail = decoded.email;
        User.findOne({ email: userEmail }).then((user) => {
            const exists = user.clients.includes(id);
            if(exists){
                Client.deleteOne({_id: id}).then((err, result) => {
                    if(err) res.status(500);
                    res.status(201).json({message: "Elemento eliminado"});
                });
            }
        });
    });
});

router.post("/fetch", (req, res) => {
    const body = req.body;
    const token = body.token;

    jwt.verify(token, secretKey, function(err, decoded) {
        if (err) {
            return res.status(401).json({ email: "no permissions" });
        }
        const userEmail = decoded.email;
        User.findOne({ email: userEmail }).populate("clients").then((user) => {
            res.json({ clients: user.clients });
        });
    });
});

router.post("/referals", (req, res) => {
    const body = req.body;
    const token = body.token;

    jwt.verify(token, secretKey, function(err, decoded) {
        if (err) {
            return res.status(401).json({ email: "no permissions" });
        }
        const userEmail = decoded.email;
        User.findOne({ email: userEmail }).populate("referidos").then((user) => {
            res.json({ referals: user.referidos });
        });
    });
});





module.exports = router;
