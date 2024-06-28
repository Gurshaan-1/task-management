const mongoose = require('mongoose')

const taskSchema = new mongoose.Schema({
  name: String,
  deadline: Date,
  priority: Number,
  assignedMembers: [String],
  notes: String,
  completed: { type: Boolean, default: false },
});

const Task = mongoose.model("Task", taskSchema)
module.exports = Task