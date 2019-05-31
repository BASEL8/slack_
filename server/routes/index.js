const express = require("express");
const router = express.Router();

router.get("/", ensureAuthenticated, (req, res, next) => {
  res.status(200).send({ isAuthenticated: req.isAuthenticated() });
});

function ensureAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }
  res.send("not allowed basel");
}
module.exports = router;
