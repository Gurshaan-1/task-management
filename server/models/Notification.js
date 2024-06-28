const mongoose = require("mongoose");

const notificationSchema = new mongoose.Schema({
  recipient: String,
  notificationText: String,
  timestamp: { type: Date, default: Date.now },
});

const Notification = mongoose.model("Notification", notificationSchema)
module.exports = Notification