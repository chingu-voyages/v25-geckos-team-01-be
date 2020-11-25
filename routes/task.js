const express = require("express");
const Task = require("../models/Task");
const { isLoggedIn } = require("../services/authServices");
const mongoose = require("mongoose");
mongoose.set('useCreateIndex', true);

const router = express.Router();

// POST to create a new Task
router.post("/add", isLoggedIn, async (req, res) => {
    // from user screen a new task can be created
    // purpose - form input, creates a new task that will be stored according to all input data
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
    task.postedBy = req.user.id;
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

// PUT update Task
router.put("/update/:taskId", isLoggedIn, (req, res) => {
  // From user screen, select task, which then requests the task Database - bring over task id and user which is identified by jwt jsonwebtoken
  // Find task based on param, check that user postedby is logged in, find and update task, then return data
  Task.findOne({_id: req.params.taskId}, (err, doc) => {
    if (err) {
      console.log(err);
    } else {
    if (req.user.id == doc.postedBy) { // name matches logon
      Task.findByIdAndUpdate(
        req.params.taskId,
        req.body,
        { new: true},
        (error, task) => {
          if (error) console.log(error);
          else {
            console.log("updated task");
            res.status(200).json({data: req.body});
          };
        }
      );
    } else {
      console.log("User not authorized to edit that task.")
      mongoose.connection.close();
    }
  }
  });
});

// GET to view a Task in edit mode
router.get("/edit/:taskId", isLoggedIn, (req, res) => {
  // from organization profile screen, click on task and go to an edit screen where values can be changed.
    // verify logged in user matches postedBy for task, find and provide data
    //** currently not working,not sure why, getting unhandled error event, postedBy is returning null
  Task.findOne({_id: req.params.taskId}, (err, doc) => {
    if (err) {
      console.log(err);
    } else {
      if (req.user.id == doc.postedBy) {
        Task.findOne({_id: doc.postedBy}, (error, task) => {
          if (error) {
            console.log(error);
          } else {
            console.log("task found", task.postedBy);
            res.status(200).json({data: task});
          }
        });
      } else {
        console.log("User not authorized to edit that task.")
        mongoose.connection.close();
      }
    }
  });


});

// GET view Task screen
router.get("/:userName/:taskId", (req, res) => {
    // search for task ID, task will contain user ID, return task info. userName serves no purpose, could remove. But it might be nice to see the business in the url.
    Task.findOne({_id: req.params.taskId}, (err, doc) => {
      if (err) {
        console.log(err);
      } else {
        console.log("task found");
        res.status(200).json({data: doc});
      }
    });
});

// DELETE task
router.delete("/delete/:taskId", isLoggedIn, (req, res) => {
  // need to find task per req.body, and if user logged in matches the postBy for the task, then delete
  Task.findOne({_id: req.params.taskId}, (err, doc) => {
    if (err) {
      console.log(err);
    } else {
      if (req.user.id == doc.postedBy) {
        Task.deleteOne({_id: req.params.taskId}, (error) => {
          if (error) {
            console.log(error);
          } else {
            console.log("successful delete");
            res.status(200).json({data: doc});
          }
        });
      }
    }
  });

});

module.exports = router;
