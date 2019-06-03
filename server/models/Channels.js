const mongoose = require("mongoose");
var bcrypt = require("bcryptjs");
mongoose.set("useCreateIndex", true);
mongoose
  .connect("mongodb://localhost/newSlack", { useNewUrlParser: true })
  .then(() => console.log("mongodb node auth connected"))
  .catch((err) => console.error(err));
const db = mongoose.connection;

const messages = mongoose.Schema({
  text: { type: String, required: true },
  by: { type: String, required: true },
  date: { type: Date, default: Date.now() },
  userID: { type: String, required: true },
  edited: { type: Boolean, default: false },
  profileImage: { type: String, required: false },
  color: { type: String }
});
const users = mongoose.Schema({
  name: { type: String, required: true },
  date: { type: Date, default: Date.now() },
  profileImage: { type: String, required: true }
});

const channelsSchema = mongoose.Schema({
  unreadMessages: {
    type: Number,
    required: true,
    default: 0
  },
  channelName: {
    type: String,
    required: true
  },
  users: [users],
  messages: [messages],
  date: {
    type: Date,
    default: Date.now()
  },
  by: {
    type: String,
    required: true
  },
  protectedChannel: {
    type: Boolean,
    required: true
  },
  password: {
    type: String
  },
  allowed: [],
  typing: []
});

const Channels = (module.exports = mongoose.model("channels", channelsSchema));
module.exports.createChannel = function(newChannel, callback) {
  bcrypt.genSalt(10, function(err, salt) {
    bcrypt.hash(newChannel.password, salt, function(err, hash) {
      newChannel.password = hash;
      newChannel.save(callback);
    });
  });
};
module.exports.comparePassword = function(candidatePassword, hash, callback) {
  bcrypt.compare(candidatePassword, hash, function(err, isMatch) {
    callback(null, isMatch);
  });
};
