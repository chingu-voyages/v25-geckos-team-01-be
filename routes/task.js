const express = require("express");
const Task = require("../models/Task");
const jwt = require("jsonwebtoken");

const router = express.Router();

// GET view Task screen
router.get("/task/:userName/:taskID", async (req, res) => {
  // search for task ID, task will contain user ID, return task info
  console.log(req.params.userName)
});

// POST to create a new Task
router.post("/addtask", async (req, res) => {
  // from user screen a new task can be created
    // purpose - form input, creates a new task that will be stored according to all input data
    console.log(req.body)
  try {
    let {
      userName,
      title,
      description,
      skillsRequired,
      location,
      endTask,
      status
    } = req.body;
    let task = new Task();
    task.postedBy = userName;
    task.title = title;
    task.description = description;
    task.skillsRequired = skillsRequired;
    task.location = location;
    task.endTask = endTask;
    task.status = status;
    await task.save();
    res.json({data: task});
  } catch (err) {
    console.log(err);
    res.json({message: "An error occured", err}).sendStatus(400);
  }
});

// PUT to edit a Task
router.put("/task/:userName/:taskID", async (req, res) => {
  // from user screen, select task and make edits
});

module.exports = router;
