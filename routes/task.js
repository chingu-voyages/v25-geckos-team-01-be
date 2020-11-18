const express = require("express");
const Task = require("../models/Task");
const {
    checkLoginStatus,
    checkExistingUsers,
} = require("../services/authServices");

const router = express.Router();

// GET view Task screen
router.get("/:userName/:taskID", async (req, res) => {
  // search for task ID, task will contain user ID, return task info
  console.log(req.params.userName)
});

// POST to create a new Task
router.post("/add", checkLoginStatus, async (req, res) => {
  // from user screen a new task can be created
    // purpose - form input, creates a new task that will be stored according to all input data
    console.log("**************test********", req.user)
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
    task.postedBy = req.user; // tried req.user, but user name was not being added to task DB.
    task.title = title;
    task.description = description;
    task.skillsRequired = skillsRequired;
    task.location = location;
    task.endTask = endTask;
    task.status = status;
    await task.save();
    res.status(200).json({data: task});
  } catch (err) {
    console.log(err);
    res.json({message: "An error occured", err}).sendStatus(400);
  }
});

// PUT to edit a Task
router.put("/:userName/:taskID", async (req, res) => {
  // from user screen, select task and make edits
});

module.exports = router;
