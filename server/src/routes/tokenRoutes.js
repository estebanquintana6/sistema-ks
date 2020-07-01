var express = require('express');
var router = express.Router();

const bcrypt = require("bcryptjs");
const crypto = require('crypto');


//Schema
var ResetPassword = require('../models/ResetPassword');
var User = require('../models/UserForm');

// Add item
router.post('/validate', (req, res) => {
  const body = req.body;
  const token = body.token;
  const email = body.email;

  User.findOne({ email }).then(user => {
    if (!user) {
      return res.status(200).json({ "status": false });
    }
    ResetPassword.findOne({
      resetPasswordToken: token,
      userId: user._id
    }).then((reset) => {
      if (reset) {
        return res.status(200).json({ "status": true });
      } else {
        return res.status(200).json({ "status": false });
      }
    });
  })

});


module.exports = router;
