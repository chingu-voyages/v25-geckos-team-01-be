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
