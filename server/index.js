const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const EmployeeModel = require("./models/Employees");
const Task = require("./models/Tasks");
const Notification = require("./models/Notification");
const File = require("./models/FileSharing");
const app = express();
const fs = require("fs");
const path = require("path");
app.use(express.json());
app.use(cors());

mongoose.connect("mongodb://127.0.0.1:27017/employees");

app.post("/signup", (req, res) => {
  const { email } = req.body;
  EmployeeModel.findOne({ email: email }).then((existingUser) => {
    if (existingUser) {
      return res.status(400).json({ error: "Email already exists" });
    } else {
      EmployeeModel.create(req.body)
        .then((employee) => res.json(employee))
        .catch((err) => res.json(err));
    }
  });
});

app.post("/login", (req, res) => {
  const { email, password } = req.body;
  EmployeeModel.findOne({ email: email }).then((user) => {
    if (user) {
      if (user.password === password) {
        res.json({ success: true, role: user.role, name: user.name });
      } else {
        res
          .status(401)
          .json({ success: false, message: "Invalid email or password" });
      }
    } else {
      res
        .status(401)
        .json({ success: false, message: "Invalid email or password" });
    }
  });
});

app.get("/users", async (req, res) => {
  try {
    EmployeeModel.find({ role: "user" }).then((data) => {
      res.send({ status: "ok", data: data });
    });
  } catch (error) {
    res.json({ status: error });
  }
});

app.get("/notifications/:username", async (req, res) => {
  const username = req.params.username;
  try {
    const notifications = await Notification.find({ recipient: username });
    res.status(200).json(notifications);
  } catch (error) {
    console.error("Error fetching notifications:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

// POST a new notification
app.post("/notifications", async (req, res) => {
  const { recipient, notificationText } = req.body;
  try {
    await Notification.create({ recipient, notificationText });
    res.status(201).json({ message: "Notification sent successfully" });
  } catch (error) {
    console.error("Error creating notification:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});
// app.post("/fileSharing", async (req, res) => {
//   const { recipient, filename  } = req.body;
//   try {
//     await File.create({ recipient, filename });
//     res.status(201).json({ message: "File shared successfully" });
//   } catch (error) {
//     console.error("Error sending file:", error);
//     res.status(500).json({ message: "Internal Server Error" });
//   }
// });

// DELETE a notification by ID
app.delete("/notifications/:id", async (req, res) => {
  const notificationId = req.params.id;
  try {
    await Notification.findByIdAndDelete(notificationId);
    res.status(200).json({ message: "Notification removed successfully" });
  } catch (error) {
    console.error("Error removing notification:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});
// GET all tasks
app.get("/tasks", async (req, res) => {
  try {
    const tasks = await Task.find();
    res.status(200).json(tasks);
  } catch (error) {
    console.error("Error fetching tasks:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

// GET tasks assigned to a specific member
app.get("/tasks/:assignedMember", async (req, res) => {
  const { assignedMember } = req.params;
console.log(assignedMember);
  try {
    const tasks = await Task.find({
      assignedMembers: assignedMember
    });
    res.status(200).json(tasks);
  } catch (error) {
    console.error("Error fetching tasks:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

// POST a new task
app.post("/tasks", async (req, res) => {
  const { name, deadline, priority, assignedMembers, notes, completed } = req.body;
  try {
    await Task.create({ name, deadline, priority, assignedMembers, notes, completed });
    res.status(201).json({ message: "Task created successfully" });
  } catch (error) {
    console.error("Error creating task:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

// PUT/update a task deadline
app.put("/tasks/:id/deadline", async (req, res) => {
  const { id } = req.params;
  const { deadline } = req.body;
  try {
    await Task.findByIdAndUpdate(id, { deadline });
    res.status(200).json({ message: "Task deadline updated successfully" });
  } catch (error) {
    console.error("Error updating task deadline:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

// DELETE a task
app.delete("/tasks/:id", async (req, res) => {
  const { id } = req.params;
  try {
    await Task.findByIdAndDelete(id);
    res.status(200).json({ message: "Task deleted successfully" });
  } catch (error) {
    console.error("Error deleting task:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

// PUT/update task completion status
app.put("/tasks/:id/completed", async (req, res) => {
  const { id } = req.params;
  const { completed } = req.body;
// console.log(id)
  try {
    await Task.findByIdAndUpdate(id, { completed });
    res
      .status(200)
      .json({ message: "Task completion status updated successfully" });
  } catch (error) {
    console.error("Error updating task completion status:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

// PUT/update task status
app.put("/tasks/:id/status", async (req, res) => {
  const { id } = req.params;
  const { completed } = req.body;
  try {
    await Task.findByIdAndUpdate(id, { completed });
    res.status(200).json({ message: "Task status updated successfully" });
  } catch (error) {
    console.error("Error updating task status:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});
app.get("/members", async (req, res) => {
  try {
    const members = await User.aggregate([
      {
        $match: { role: "user" },
      },
      {
        $lookup: {
          from: "tasks",
          localField: "name",
          foreignField: "assignedMembers",
          as: "tasks",
        },
      },
      {
        $project: {
          _id: 1,
          name: 1,
          totalTasks: { $size: "$tasks" },
        },
      },
    ]);
    res.status(200).json(members);
  } catch (error) {
    console.error("Error fetching team members:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

// POST a file upload
const multer = require("multer");

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/");
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  },
});

const upload = multer({ storage: storage });
app.post("/files/upload", upload.single("file"), async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ message: "No file uploaded" });
  }

  const { task, recipient } = req.body;
  const { filename, path:filepath } = req.file;
  console.log(task+" "+recipient+" "+filename+" "+filepath);
  try {
    await File.create({ filename, filepath, task, recipient });
    res.status(200).json({ message: "File uploaded successfully" });
  } catch (error) {
    console.error("Error saving file details:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

// GET files by recipient name
app.get("/files/:recipientName", async (req, res) => {
  const recipientName = req.params.recipientName;
  try {
    const files = await File.find({ recipient: recipientName });
    res.status(200).json(files);
  } catch (error) {
    console.error("Error fetching shared files:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

// GET file download
app.get("/files/download/:filename", (req, res) => {
  const filename = req.params.filename;
  const filePath = path.join(__dirname, "uploads", filename);

  // Send the file as a response with appropriate headers
  res.download(filePath, filename, (error) => {
    if (error) {
      console.error("Error downloading file:", error);
      res.status(500).json({ message: "Error downloading file" });
    }
  });
});


app.use("/uploads", express.static(path.join(__dirname, "uploads")));
app.get("/files/:filename", (req, res) => {
  const filename = req.params.filename;
  const filePath = path.join(__dirname, "uploads", filename);
  fs.access(filePath, fs.constants.F_OK, (err) => {
    if (err) {
      res.status(404).send("File not found");
    } else {
      
      const fileExtension = path.extname(filePath).slice(1);
      const contentType = getContentType(fileExtension);
      res.setHeader("Content-Type", contentType);

      const fileStream = fs.createReadStream(filePath);
      fileStream.pipe(res);
    }
  });
});

function getContentType(fileExtension) {
  switch (fileExtension) {
    case "pdf":
      return "application/pdf";
    case "jpg":
    case "jpeg":
      return "image/jpeg";
    case "png":
      return "image/png";
    case "doc":
      return "application/msword";
    case "docx":
      return "application/vnd.openxmlformats-officedocument.wordprocessingml.document";
    default:
      return "application/octet-stream"; 
  }
}
app.listen(3001, () => {
  console.log("server is running");
});
