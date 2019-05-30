const express = require("express");
const router = express.Router();
const multer = require("multer");
const LocalStrategy = require("passport-local").Strategy;
const bodyParser = require("body-parser");
const Message = require("../models/message");
router.use(bodyParser.json());
router.use(bodyParser.urlencoded({ extended: false }));
router.get("/", function(req, res) {
  if (req.isAuthenticated()) {
    io.on("connection", (socket) => {
      console.log("connected from messages");
      socket.on("hello", (data) => console.log(1));
    });
    res.send("done messages");
  }
});

module.exports = router;
