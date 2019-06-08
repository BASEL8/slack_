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
    socket.on(
      "create channel",
      ({ channelName, by, protectedChannel, password }) => {
        const newChannel = new Channels({
          channelName,
          by,
          password,
          protectedChannel,
          date: Date.now()
        });
        Channels.createChannel(newChannel, function(err, user) {
          if (err) {
            throw err;
          }
          io.emit("update");
        });
        //
      }
    );
    socket.on("loggedOut", ({ _id }) => {
      io.emit("update");
    });
    socket.on("loggedIn", () => {
      io.emit("update");
    });
    socket.on("delete.channel", ({ id }) => {
      Channels.findById(id, function(err, doc) {
        if (err) {
          console.log(err);
        }
        doc.remove();
        io.emit("update");
      });
    });
    socket.on("message.sent", ({ _id, text, by, Data, userID }) => {
      console.log(Date.now());
      Channels.findOne({ _id: _id }).then((channel) => {
        channel.messages.push({
          text,
          by,
          userID,
          profileImage: Data.profileImage,
          date: Date.now()
        });
        if (!channel.users.find((x) => x.id === Data._id))
          channel.users.push(Data);
        channel.save();
      });
      io.emit("update");
    });
    socket.on("delete.message", ({ channelId, _id }) => {
      Channels.update(
        { _id: channelId },
        { $pull: { messages: { _id: _id } } },
        { safe: true, multi: true },
        function(err, obj) {
          //do something smart
          if (err) {
            console.log(err);
          } else {
            io.emit("update");
          }
        }
      );
    });
    socket.on("edit.message", ({ channelId, _id, value }) => {
      Channels.findOneAndUpdate(
        {
          _id: channelId,
          messages: { $elemMatch: { _id: _id } }
        },
        {
          $set: {
            "messages.$.text": value,
            "messages.$.edited": true
          }
        }, // list fields you like to change
        { new: true, safe: true, upsert: true },
        function(err, obj) {
          //do something smart
          if (err) {
            console.log(err);
          } else {
            io.emit("update");
          }
        }
      );
    });
    socket.on("channel.open", ({ _id, password, userId }) => {
      Channels.findOne({ _id: _id }).then((channel) => {
        Channels.comparePassword(password, channel.password, function(
          err,
          isMatch
        ) {
          if (err) {
            return console.log(err);
          }
          if (isMatch) {
            channel.allowed.push(userId);
            channel.save();
            io.emit("update");
            return console.log(null, "done");
          } else {
            return console.log(null, false, { message: "invalid password" });
          }
        });
      });
    });
    socket.on("user writing", ({ name, id, channelId }) => {
      Channels.findById(channelId, function(err, channel) {
        if (err) {
          console.log(err);
        }

        if (!channel.typing.find((x) => x.id === id)) {
          console.log("user");
          channel.typing.push({ name, id });
        }
        channel.save();
        io.emit("update");
      });
      socket.on("user not writing", ({ name, id, channelId }) => {
        Channels.findById(channelId, function(err, channel) {
          if (err) {
            console.log(err);
          }

          console.log("user");
          channel.typing = channel.typing.filter((user) => user.id !== id);
          channel.save();
          io.emit("update");
        });
      });
    });
    //join room test start
    socket.on("joinRoom", (roomToJoin, numberOfMembersCallback) => {
      socket.join(roomToJoin, () => {
        let rooms = Object.keys(socket.rooms);
        console.log(rooms, "rooms");
      });
      io.in(roomToJoin).clients((err, clients) => {
        console.log(clients, "clients");
        numberOfMembersCallback(clients.length);
      });
    });
    //join room test end
  });
});
