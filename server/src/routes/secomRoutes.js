var express = require('express');
var router = express.Router();

const jwt = require("jsonwebtoken");

const User = require("../models/UserForm");
const Secom = require("../models/SecomForm");
const Client = require("../models/ClientForm");
const secretKey = require("../config/config");

router.post("/save", (req, res) => {
    const body = req.body;
    const token = body.token;

    jwt.verify(token, secretKey, function(err, decoded) {
        if (err) {
            return res.status(401).json({ error: "no permissions" });
        }
        const secomForm = body.secomData;
        delete secomForm.llamarField;
        delete secomForm.fecha;
        
        const userEmail = decoded.email;
        
        if(secomForm.status == "Venta"){
            let clientData = {
                origen: "SECOM",
                name: secomForm.name,
                last_name1: secomForm.last_name1,
                last_name2: secomForm.last_name2,
                telefono: secomForm.telefono,
                productos: [secomForm.campana]
            }

            const client = new Client(clientData);

            client.save()
                .then((result) => {
                    User.findOne({ email: userEmail }).then(user => {
                        user.clients.push(client);
                        user.save();
                        res.json({ message: 'Forma de cliente guardada.' });
                    })
                }).catch((error) => {
                    res.status(500).json({ error });
                });

        } else {
            const secom = new Secom(secomForm);
            secom.save()
            .then((result) => {
                User.findOne({ email: userEmail }).then(user => {
                    user.secoms.push(secom);
                    user.save();
                    res.json({ message: 'Forma de secom guardada.' });
                }).catch((error) => {
                    res.status(500).json({ error });
                });

            });
        }

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
        User.findOne({ email: userEmail }).populate("secoms").then((user) => {
            res.json({ secoms: user.secoms });
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
            const exists = user.secoms.includes(id);
            if(exists){
                Secom.deleteOne({_id: id}).then((err, result) => {
                    if(err) res.status(500);
                    res.status(201).json({message: "Elemento eliminado"});
                });
            }
        });
    });
});

router.post("/makeClient", (req, res) => {
    const body = req.body;
    const token = body.token;  
    const id = body.id;

    jwt.verify(token, secretKey, function(err, decoded) {
        if (err) {
            return res.status(401).json({ email: "no permissions" });
        }
        const userEmail = decoded.email;
        User.findOne({ email: userEmail }).then((user) => {
            const exists = user.secoms.includes(id);
            if(exists){

                const secom = Secom.findById(id).then((result) => {
                    let clientData = {
                        origen: "SECOM",
                        name: result.name,
                        last_name1: result.last_name1,
                        last_name2: result.last_name2,
                        telefono: result.telefono,
                        productos: [result.campana]
                    }

                    const client = new Client(clientData);

                    client.save()
                        .then(() => {
                            User.findOne({ email: userEmail }).then(user => {
                                user.clients.push(client);
                                user.save();

                                Secom.deleteOne({_id: id}).then(() => {
                                    res.json({ message: 'Forma de cliente guardada.' });
                                });
                            })
                        }).catch((error) => {
                            res.status(500).json({ error });
                        });
                });

            }
        });
    });
});

module.exports = router;