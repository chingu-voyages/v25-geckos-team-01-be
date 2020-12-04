const express = require("express");
const Task = require("../models/Task");
const { isLoggedIn } = require("../services/authServices");
const mongoose = require("mongoose");

const router = express.Router();

// POST to create a new Task
router.post("/add", isLoggedIn, async (req, res) => {
    // from user screen a new task can be created
    // purpose - form input, creates a new task that will be stored according to all input data
    console.log(req.body);
    if (req.user.role === "organization") {
        try {
            const task = new Task();
            task.title = req.body.title;
            task.postedBy = req.user.id;
            task.description = req.body.description;
            task.skillsRequired = req.body.skillsRequired;
            task.location = req.body.location;
            task.taskEnd = req.body.taskEnd;
            task.status = req.body.status;
            await task.save();
            res.status(200).json({ data: task.authenticatedResJson() });
        } catch (error) {
            res.status(400).json({ Error: error });
        }
    } else {
        res.status(401).json({
            response: "You must be an organization to add a Task",
        });
    }
});

// GET to view a Task in edit mode
router.get("/edit/:taskId", isLoggedIn, async (req, res) => {
    try {
        let task = await Task.findById(req.params.taskId); // find task by ID
        // check if the logged in user is task author
        if (task.postedBy == req.user.id) {
            res.status(200).json({ data: task.authenticatedResJson() });
        } else {
            res.status(401).json({
                response: `${req.user.name} is not authorized to edit Task`,
            });
        }
    } catch (error) {
        res.status(400).json({ Error: error });
    }
});

// PUT update Task
router.put("/edit/:taskId", isLoggedIn, (req, res) => {
    // From user screen, select task, which then requests the task Database - bring over task id and user which is identified by jwt jsonwebtoken
    // Find task based on param, check that user postedby is logged in, find and update task, then return data
    Task.findOne({ _id: req.params.taskId }, (err, doc) => {
        if (err) {
            console.log(err);
        } else {
            if (req.user.id == doc.postedBy) {
                // name matches logon
                Task.findByIdAndUpdate(
                    req.params.taskId,
                    req.body,
                    { new: true },
                    (error, task) => {
                        if (error) console.log(error);
                        else {
                            res.status(200).json({
                                data: task.authenticatedResJson(),
                            });
                        }
                    }
                );
            } else {
                res.status(401).json({
                    response: `${req.user.name} is not authorized to edit Task`,
                });
                mongoose.connection.close();
            }
        }
    });
});

// GET view Task screen
router.get("/:userName/:taskId", (req, res) => {
    // search for task ID, task will contain user ID, return task info. userName serves no purpose, could remove. But it might be nice to see the business in the url.
    Task.findOne({ _id: req.params.taskId }, (err, doc) => {
        if (err) {
            console.log(err);
        } else {
            console.log("task found");
            res.status(200).json({ data: doc.resJson() });
        }
    });
});

// PUT - add interestedIn user from task
router.put("/add-interest/:taskId", isLoggedIn, (req, res) => {
  // if logged in user clicks interest in a task, they are added to interestedIn array. Duplication of interest is prohibited
    // $addToSet can be used instead of forEach loop, instead, will only add 1 total instance
  if (req.user.role === "organization") {
    console.log("Not authorized. Only volunteers can add interest");
    res.sendStatus(403);
  } else {
    Task.findOne({ _id: req.params.taskId }, (err, doc) => {
      let addInterestedUser = {
        user: req.user.id,
        accepted: null
      }
      let userAdded = false;
      if (err) {
        console.log(err);
      } else {
        doc.interestedIn.forEach(e => {
          if (e.user == req.user.id) {
            console.log("Duplicate request. User interest already added.");
            res.status(403).json({ data: doc.resJson() });
            return userAdded = true;
          }
        });

        if (!userAdded) {
          Task.findOneAndUpdate({ _id: req.params.taskId }, {$push: {interestedIn: addInterestedUser} }, (error, task) => {
            if (error) {
              console.log(error);
            } else {
              console.log("user added interest to task");
              res.status(200).json({data: task.resJson()});
          }
          });
        }
      }
    });
  }
});

// PUT - remove interestedIn user from task
router.put("/remove-interest/:taskId", isLoggedIn, (req, res) => {
  Task.findOneAndUpdate({ _id: req.params.taskId }, {$pullAll: {interestedIn: [{user: req.user.id }] } }, (err, doc) => {
    if (err) {
      console.log(err);
    } else {
      console.log("User removed, if they were on list.");
      res.status(200).json({data: doc.resJson() });
        }
      });

});

// PUT - org. to accept or decline interestedIn user
router.put("/accept-interest/:taskId", isLoggedIn, async (req,res) => {
  // on task screen, org. can click on a volunteer that is interestedIn task. If the org. is the creator of the task, then they can either click accept yes, or no.
  let { acceptedStatus, volunteer } = req.body;
  Task.findOne({_id: req.params.taskId }, (err, doc) => {
    let volunteerInterestFound = false;

    if (err) {
      console.log(err);
    } else if (req.user.id == doc.postedBy) {
        doc.interestedIn.forEach(e => {
          if (e.user == volunteer) {
            //user matched - make change
            volunteerInterestFound = true;
            e.accepted = acceptedStatus;
            doc.save();
            console.log("Volunteer acceptedStatus updated");
            res.status(200).json( {data: doc.authenticatedResJson() });
          }
        });
        if (!volunteerInterestFound) {
          console.log("Volunteer not found on list.");
          res.status(404).json({data: doc.resJson() });
        }

    } else {
      console.log("User is not creator of task and authorized to update interestedIn status.");
      res.status(403).json({ data: doc.resJson() });
    }

  });

});

// DELETE task
router.delete("/delete/:taskId", isLoggedIn, (req, res) => {
    // need to find task per req.body, and if user logged in matches the postBy for the task, then delete
    Task.findOne({ _id: req.params.taskId }, (err, doc) => {
        if (err) {
            console.log(err);
        } else {
            if (req.user.id == doc.postedBy) {
                Task.deleteOne({ _id: req.params.taskId }, (error) => {
                    if (error) {
                        console.log(error);
                    } else {
                        console.log("successful delete");
                        res.status(200).json({
                            data: doc.authenticatedResJson(),
                        });
                    }
                });
            } else{
                res.status(401).json({response: `${req.user.name} is not authorized to delete this post`})
            }
        }
    });
});

module.exports = router;
