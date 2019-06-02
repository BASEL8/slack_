const express = require("express");
const router = express.Router();
const multer = require("multer");
const mongoose = require("mongoose");
const LocalStrategy = require("passport-local").Strategy;
const passport = require("passport");

const bodyParser = require("body-parser");
require("../models/Channels");
const Channels = mongoose.model("channels");
require("../models/user");
const Users = mongoose.model("User");
router.use(bodyParser.json());
router.use(bodyParser.urlencoded({ extended: true }));
router.post("/", function(req, res) {
  console.log(req.body.userId);
  let channelsCopy = [];
  let usersCopy = [];
  Channels.find({})
    .sort({ data: "desc" })
    .then((channels) => {
      Users.find({})
        .then((users) => {
          for (let index = 0; index < users.length; index++) {
            users[index].password = undefined;
            usersCopy.push(users[index]);
          }
          let newChannels = channels.map((channel) => {
            if (
              channel.protectedChannel &&
              !channel.allowed.includes(req.body.userId)
            ) {
              channel.messages = [];
            }
            channelsCopy.push(channel);
            console.log(channelsCopy);
          });
        })
        .then(() => {
          res.send({ channels: channelsCopy, users: usersCopy });
        });
    });
});

module.exports = router;
