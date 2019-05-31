const express = require("express");
const router = express.Router();
const multer = require("multer");
const mongoose = require("mongoose");
const LocalStrategy = require("passport-local").Strategy;
const bodyParser = require("body-parser");
require("../models/Channels");
const Channels = mongoose.model("channels");
require("../models/user");
const Users = mongoose.model("User");
//const Users = require("../models/user");
router.use(bodyParser.json());
router.use(bodyParser.urlencoded({ extended: false }));
router.get("/", function(req, res) {
  Channels.find({})
    .sort({ data: "desc" })
    .then((channels) => {
      Users.find({}).then((users) => res.send({ channels, users }));
    });
});

module.exports = router;
