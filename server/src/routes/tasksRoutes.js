var express = require('express');
var router = express.Router();
const jwt = require("jsonwebtoken");

const Task = require("../models/TaskForm.js");
const secretKey = require("../config/config")

router.post("/save", (req, res) => {
  const body = req.body;
  const token = body.token;

  jwt.verify(token, secretKey, function (err, decoded) {
    if (err) return res.status(401).json({ emailnotfound: "No tienes permisos para esta accion" });
    const taskForm = { ...body.taskData, initiator: decoded.id };
    const task = new Task(taskForm);
    task.save().then((result) => {
      res.json({ message: 'Aseguradora guardada.' });
    }).catch((error) => {
      res.status(500).json({ error });
    });
  });
});

router.post("/update", (req, res) => {
  const body = req.body;
  const token = body.token;
  const taskData = body.taskData;
  const id = taskData._id;
  jwt.verify(token, secretKey, function (err, _) {
    if (err) return res.status(401).json({ email: "no permissions" });
    Task.findOne({ _id: id }).then((task) => {
      if (!task) return res.status(404).json({ message: "Aseguradora no encontrada" });
      let doc = Task.findById(task.id);
      doc.updateOne(taskData).then((err, _) => {
        if (err) res.status(500);
        res.status(200).json({ message: "Elemento modificado" });
      });
    });
  });
});


router.post("/delete", (req, res) => {
  const body = req.body;
  const token = body.token;
  const id = body.id;

  jwt.verify(token, secretKey, function (err, decoded) {
    if (err) return res.status(401).json({ email: "no permissions" });
    Task.findOne({ _id: id }).then((task) => {
      const exists = task;
      if (exists) {
        Task.deleteOne({ _id: id }).then((err, result) => {
          if (err) res.status(500);
          res.status(201).json({ message: "Elemento eliminado" });
        });
      }
    });
  });
});

router.get("/fetch", (req, res) => {
  const token = req.headers.authorization;
  jwt.verify(token, secretKey, function (err, decoded) {
    if (err) return res.status(401).json({ email: "no permissions" });
    // This is the way I found to make a get all from model.

    Task.find({ $or: [{ 'assignee': decoded.id }, { 'initiator': decoded.id }] }).populate('assignee').populate('initiator').then((tasks) => {
      res.json({ tasks });
    });
  });
});




module.exports = router;
