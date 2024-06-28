const mongoose = require("mongoose");

const fileSchema = new mongoose.Schema({
  filename: String,
  filepath: String,
  task: String,
  recipient: String,
  upload_date: { type: Date, default: Date.now },
});

const File = mongoose.model("File", fileSchema)
module.exports = File
