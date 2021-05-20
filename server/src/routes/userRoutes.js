const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const secretKey = require("../config/config");

const nodemailer = require("nodemailer");
const crypto = require('crypto');
const moment = require('moment');

// Load input validation
const validateRegisterInput = require("../validation/register");
const validateLoginInput = require("../validation/login");
const validateChangePassword = require("../validation/changePassword");

// Load User model
const User = require("../models/UserForm");
const ResetPassword = require("../models/ResetPassword");

// @route POST api/users/register
// @desc Register user
// @access Public
router.post("/register", (req, res) => {
  // Form validation

  const { errors, isValid } = validateRegisterInput(req.body);

  // Check validation
  if (!isValid) {
    return res.status(400).json(errors);
  }

  User.findOne({ email: req.body.email }).then(user => {
    if (user) {
      return res.status(400).json({ email: "Email already exists" });
    } else {
      const newUser = new User({
        name: req.body.name,
        last_name: req.body.last_name,
        email: req.body.email,
        password: req.body.password,
        role: "user"
      });

      // Hash password before saving in database
      bcrypt.genSalt(10, (err, salt) => {
        bcrypt.hash(newUser.password, salt, (err, hash) => {
          if (err) throw err;
          newUser.password = hash;
          newUser
            .save()
            .then(user => res.json(user))
            .catch(err => res.status(500));
        });
      });
    }
  });
});

// @route POST api/users/login
// @desc Login user and return JWT token
// @access Public
router.post("/login", (req, res) => {
  // Form validation

  const { errors, isValid } = validateLoginInput(req.body);

  // Check validation
  if (!isValid) {
    return res.status(400).json(errors);
  }

  const email = req.body.email;
  const password = req.body.password;

  // Find user by email
  User.findOne({ email }).then(user => {
    // Check if user exists
    if (!user) return res.status(404).json({ emailnotfound: "El email no existe" });

    if (!user.active) return res.status(404).json({ emailnotfound: "El usuario no esta activado" });

    // Check password
    bcrypt.compare(password, user.password).then(isMatch => {
      if (isMatch) {
        // User matched
        // Create JWT Payload
        const payload = {
          name: user.name,
          last_name: user.last_name,
          email: user.email,
          role: user.role,
          id: user._id
        };

        // Sign token
        jwt.sign(
          payload,
          secretKey,
          {
            expiresIn: 31536000 // 1 year in seconds
          },
          (err, token) => {
            res.json({
              success: true,
              token: token
            });
          }
        );
      } else {
        return res
          .status(400)
          .json({ passwordincorrect: "Contraseña incorrecta" });
      }
    });
  });
});


router.post("/recover", (req, res) => {
  const body = req.body;
  const email = body.email;

  User.findOne({ email }).then(user => {
    // Check if user exists
    if (!user) {
      return res.status(404).json({ errors: { email: "Email no existe" } });
    }

    ResetPassword.find({ userId: user.id, status: 0 }).remove().exec();

    const token = crypto.randomBytes(32).toString('hex');

    ResetPassword.create({
      userId: user._id,
      resetPasswordToken: token,
      expire: moment.utc().add(86400, 'seconds')
    }).then(function (item) {
      if (!item)
        return res.status(501).json({ error: "Error al crear token de recuperacion de contraseña" });
      let transporter = nodemailer.createTransport({
        host: "smtp.gmail.com",
        port: 465,
        secure: true, // true for 465, false for other ports
        auth: {
          user: "norepy.omseguros@gmail.com", // generated ethereal user
          pass: "Valentina09" // generated ethereal password
        }, tls: {
          rejectUnauthorized: false
        }
      });

      const recoverLink = "http://www.omseguro.com/reset/" + email + "/" + token;

      let mailOptions = {
        to: email, // list of receivers
        subject: "Recuperacion de contraseña", // Subject line
        html: "<b>Hola " + user.name + "!</b><br/><p>Para recuperar tu contraseña del sistema OMSeguros haz click en el siguiente link:</p>" + recoverLink // html body
      };


      transporter.sendMail(mailOptions, (error) => {
        if (error) {
          res.status(500).json({ message: "Error mandando mail" });
        }
        res.status(200).json({ message: "Correo mandado." });
      })

    });

  });
});


router.post("/changePassword", (req, res) => {
  const body = req.body;

  const { errors, isValid } = validateChangePassword(body);

  if (!isValid) {
    return res.status(400).json(errors);
  }

  const email = body.user;
  const token = body.resetToken;
  const password = body.password;

  User.findOne({ email }).then(user => {
    if (!user) {
      return res.status(200).json({ "status": false });
    }
    ResetPassword.findOne({
      resetPasswordToken: token,
      userId: user._id
    }).then((reset) => {
      if (reset) {
        if (reset.expire > moment.now()) {
          bcrypt.genSalt(10, (err, salt) => {
            bcrypt.hash(password, salt, (err, hash) => {
              user.password = hash;
              user.save().then(data => {
                reset.remove();
                return res.status(200).json({ message: "Contraseña cambiada" });
              })
            });
          });
        }
      } else {
        return res.status(404).json({ message: "Token caducado" });
      }
    });
  })

});


router.post("/list", (req, res) => {
  const body = req.body;
  const token = body.token;

  jwt.verify(token, secretKey, function (err, decoded) {
    if (err) res.status(402);
    const role = decoded.role;

    User.findById(decoded.id).then(user => {
      if (!user) {
        return res.status(402);
      }
    })
    
    if (role) {
      User.find().select(["-password", "-referidos", "-secoms", "-clients"]).then((users) => {
        res.status(200).json(users);
      });

    } else {
      res.status(402);
    }
  });
});

router.post("/changeRol", (req, res) => {
  const body = req.body;
  const token = body.token;
  const userId = body.id;
  const newRole = body.role;

  if (newRole !== "admin" || newRole !== "user") {
    res.status(400, { error: "Peticion erronea" });
  }

  jwt.verify(token, secretKey, function (err, decoded) {
    if (err) res.status(402);
    const role = decoded.role;

    User.findById(decoded.id).then(user => {
      if (!user) {
        return res.status(402);
      }
    })

    if (role === "admin") {
      User.findOneAndUpdate({ _id: userId }, { role: newRole }).then((err, doc) => {
        if (err) res.status(500, { error: "El rol no se modifico" })
        res.status(200, { message: "Rol modificado" });
      });
    }
  });

});

router.post("/delete", (req, res) => {
  const body = req.body;
  const token = body.token;
  const userId = body.id;

  jwt.verify(token, secretKey, function (err, decoded) {
    if (err) res.status(402);
    const role = decoded.role;

    User.findById(decoded.id).then(user => {
      if (!user) {
        return res.status(402);
      }
    })

    if (role === "admin") {
      User.findByIdAndDelete(userId).then((err, doc) => {
        if (err) res.status(500, { error: "El usuario no se elimino" })
        res.status(200, { message: "Usuario eliminado" });
      })
    } else {
      res.status(402);
    }
  });
});

router.post("/activate", (req, res) => {
  const body = req.body;
  const token = req.headers.authorization;
  const userId = body.id;

  jwt.verify(token, secretKey, function (err, decoded) {
    if (err) res.status(402);
    const role = decoded.role;

    User.findById(decoded.id).then(user => {
      if (!user) {
        return res.status(402);
      }
    })


    if (role === "admin") {
      User.findByIdAndUpdate(userId, { active: true }).then((err, doc) => {
        if (err) res.status(500, { error: "El usuario no se activó" })
        res.status(200, { message: "Usuario activado" });
      })
    } else {
      res.status(402);
    }
  });

})

module.exports = router;
