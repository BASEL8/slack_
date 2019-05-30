const express = require("express");
const router = express.Router();

router.get("/", ensureAuthenticated, (req, res, next) => {
  console.log(1);
  res.status(200).send({ isAuthenticated: req.isAuthenticated() });
});

function ensureAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }
  res.send("not allowed basel");
  //res.redirect("/users/login");
}
module.exports = router;
