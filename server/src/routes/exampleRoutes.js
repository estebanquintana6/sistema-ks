var express = require('express');
var router = express.Router();

//Schema
var TestForm = require('../models/TestForm');

// Get Specific
router.route('/:id').get(function (req, res) {
  var id = req.params.id;
  TestForm.findById(id, function (err, item) {
    res.json(item);
  });
});

// Get All Items
router.route('/').get(function (req, res) {
  TestForm.find(function (err, items) {
    if (err) {
      console.log(err);
    } else {
      res.json(items);
    }
  });
});

// Add item
router.route('/add').post(function (req, res) {
  var item = new TestForm(req.body);
  item.save()
    .then(item => {
      res.json('Added');
    })
    .catch(err => {
      res.status(400).send("unable to save to database");
    });
});

//  Update Specific
router.route('/update/:id').post(function (req, res) {
  TestForm.findById(req.params.id, function (err, item) {
    if (!item)
      return next(new Error('Could not load Document'));
    else {
      item.desc = req.body.desc;

      item.save().then(item => {
        res.json('Updated');
      })
        .catch(err => {
          res.status(400).send("unable to update the database");
        });
    }
  });
});

// Delete Specific
router.route('/delete/:id').get(function (req, res) {
  TestForm.findByIdAndRemove({ _id: req.params.id },
    function (err, item) {
      if (err) res.json(err);
      else res.json('Deleted');
    });
});

module.exports = router;
