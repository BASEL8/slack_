const mongoose = require("mongoose");
var bcrypt = require("bcryptjs");
mongoose.set("useCreateIndex", true);

mongoose
  .connect("mongodb://localhost/newSlack", { useNewUrlParser: true })
  .then(() => console.log("mongodb node auth connected"))
  .catch((err) => console.error(err));
const db = mongoose.connection;

const UserSchema = mongoose.Schema({
  username: {
    type: String,
    index: true
  },
  password: {
    type: String
  },
  name: {
    type: String
  },
  profileImage: {
    type: String
  },
  status: {
    type: Boolean,
    default: false
  }
});
const User = (module.exports = mongoose.model("User", UserSchema));
module.exports.getUserById = function(id, callback) {
  User.findById(id, callback);
};
module.exports.getUserByEmail = function(username, callback) {
  const query = { username };
  // User.findOne(query, callback);
  User.findOneAndUpdate(query, { $set: { status: true } }, callback);
};
module.exports.logOut = function(_id, callback) {
  const query = { _id };
  // User.findOne(query, callback);
  User.findOneAndUpdate(query, { $set: { status: false } }, callback);
};
module.exports.checkIfRegistered = function(username, callback) {
  const query = { username, callback };
};
module.exports.comparePassword = function(candidatePassword, hash, callback) {
  bcrypt.compare(candidatePassword, hash, function(err, isMatch) {
    callback(null, isMatch);
  });
};
module.exports.createUser = function(newUser, callback) {
  bcrypt.genSalt(10, function(err, salt) {
    bcrypt.hash(newUser.password, salt, function(err, hash) {
      newUser.password = hash;
      newUser.save(callback);
    });
  });
};
