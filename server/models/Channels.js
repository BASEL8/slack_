const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const messages = new Schema({
  text: { type: String, required: true },
  by: { type: String, required: true },
  date: { type: Date, default: Date.now() }
});
const users = new Schema({
  name: { type: String, required: true },
  date: { type: Date, default: Date.now() }
});

const channelsSchema = new Schema({
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
  }
});

mongoose.model("channels", channelsSchema);
