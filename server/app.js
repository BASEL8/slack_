const express = require("express");
const path = require("path");
const favicon = require("favicon");
const logger = require("morgan");
const cookieParser = require("cookie-parser");
const bodyParser = require("body-parser");
const session = require("express-session");
const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const multer = require("multer");
const upload = multer({ dest: "./uploads/" });
const flash = require("connect-flash");
var bcrypt = require("bcryptjs");
var mongo = require("mongodb");
const mongoose = require("mongoose");
const db = mongoose.connection;
const expressValidator = require("express-validator");

const routes = require("./routes/index");
const users = require("./routes/users");
const channels = require("./routes/channnels");

const http = require("http");
const app = express();
var server = http.createServer(app);
global.io = require("socket.io").listen(server);

app.use(logger("dev"));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

//handle sessions
app.use(
  session({
    secret: "secret",
    saveUninitialized: true,
    resave: true
  })
);
//passport

app.use(passport.initialize());
app.use(passport.session());

//validator
app.use(
  expressValidator({
    errorFormatter: function(param, msg, value) {
      var namespace = param.split("."),
        root = namespace.shift(),
        formParam = root;
      while (namespace.length) {
        formParam += "[" + namespace.shift() + "]";
      }
      return {
        param: formParam,
        msg: msg,
        value: value
      };
    }
  })
);
app.use(require("connect-flash")());
app.use(function(req, res, next) {
  res.locals.messages = require("express-messages")(req, res);
  next();
});
app.get("*", function(req, res, next) {
  res.locals.user = req.user || null;
  next();
});
app.use("/isAuth", routes);
app.use("/users", users);
app.use("/channels", channels);
//catch 404 and forward to error handler
app.use(function(req, res, next) {
  const err = new Error("NOT FOUND");
  err.status = 404;
  next(err);
});

//error handler
//development error handler
if (app.get("env") === "development") {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.send("error", {
      message: err.message,
      error: err
    });
  });
}

//production error handler
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.send("error", {
    message: err.message,
    error: {}
  });
});
require("./models/Channels");
const Channels = mongoose.model("channels");

server.listen(3001, () => {
  io.on("connection", (socket) => {
    console.log("connected from messages");
    socket.on("create channel", ({ channelName, by }) => {
      console.log(channelName);
      new Channels({ channelName, by }).save().then((res) => {
        console.log(res);
        io.emit("update");
      });
    });
  });
});
