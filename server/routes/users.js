const express = require("express");
const router = express.Router();
const multer = require("multer");
const upload = multer({ dest: "./uploads/" });
const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const bodyParser = require("body-parser");
const User = require("../models/user");
router.use(bodyParser.json());
router.use(bodyParser.urlencoded({ extended: false }));
router.get("/", (req, res, next) => {
  res.send("respond with a resource");
});
router.post("/login", passport.authenticate("local"), function(req, res) {
  res.status(200).send("done");
});
passport.serializeUser(function(user, done) {
  done(null, user.id);
});
passport.deserializeUser(function(id, done) {
  User.getUserById(id, function(err, user) {
    done(err, user);
  });
});
passport.use(
  new LocalStrategy(function(username, password, done) {
    User.getUserByEmail(username, function(err, user) {
      if (err) throw err;
      if (!user) {
        return done(null, false, { message: "unknown user" });
      }
      User.comparePassword(password, user.password, function(err, isMatch) {
        if (err) {
          return done(err);
        }
        if (isMatch) {
          return done(null, user);
        } else {
          return done(null, false, { message: "invalid password" });
        }
      });
    });
  })
);

router.post("/register", upload.single("profileImage"), (req, res, next) => {
  const { name, username, password, confirmPassword } = req.body;
  let profileImage = "noimage.jpg";
  if (req.file) {
    profileImage = req.file.filename;
  }
  //form validation
  req.checkBody("name", "Name field is required").notEmpty();
  req.checkBody("username", "Email field is required").notEmpty();
  //req.checkBody("username", "Email is not valid").isEmail();
  req.checkBody("password", "Password field is required").notEmpty();
  req.checkBody("confirmPassword", "Passwords do not match").equals(password);

  //check errors
  let errors = req.validationErrors();
  User.getUserByEmail(username, (err, user) => {
    if (user) {
      res.status(400).send("change your email");
    } else {
      if (errors) {
        res.status(302).send({ errors });
      } else {
        const newUser = new User({ name, username, password, profileImage });
        User.createUser(newUser, function(err, user) {
          if (err) {
            throw err;
          }
          res.status(200).send(user);
        });
      }
    }
  });
});
router.get("/logout", function(req, res) {
  req.logout();
  res.status(200).send({ isAuthenticated: req.isAuthenticated() });
  //req.flash("success", "you are logged out");
  // res.location("/users/login");
});
module.exports = router;
