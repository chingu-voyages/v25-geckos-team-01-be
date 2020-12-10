const express = require("express");
const Task = require("../models/Task");
const { isLoggedIn } = require("../services/authServices");
const { taskValidation } = require("../services/validators");
const { validationResult } = require("express-validator");
const mongoose = require("mongoose");

const router = express.Router();

// POST to create a new Task
router.post("/add", isLoggedIn, taskValidation, async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ Errors: errors.array() });
    } else if (req.user.role !== "organization") {
        return res.status(400).json({
            Errors: [
                {
                    msg: "User Must Be An Organization",
                    param: "user.role",
                },
            ],
        });
    } else {
        try {
            const task = new Task();
            task.title = req.body.title;
            task.postedBy = req.user.id;
            task.description = req.body.description;
            task.skillsRequired = req.body.skillsRequired.split(",");
            task.location = req.body.location;
            task.taskEnd = req.body.taskEnd;
            task.status = req.body.status;
            await task.save();
            res.status(200).json({ data: task.authenticatedResJson() });
        } catch (error) {
            res.status(500).json({ Error: error });
        }
    }
});

// GET to view a Task in edit mode
router.get("/edit/:taskId", isLoggedIn, async (req, res) => {
    try {
        let task = await Task.findById(req.params.taskId);
        if (task.postedBy !== req.user.id) {
            res.status(401).json({
                Errors: [
                    { msg: `${req.user.name} Is Not Authorized To Edit Task` },
                ],
            });
        } else {
            res.status(200).json({ data: task.authenticatedResJson() });
        }
    } catch (error) {
        res.status(500).json({ Error: error });
    }
});

// PUT update Task
router.put("/edit/:taskId", isLoggedIn, (req, res) => {
    // From user screen, select task, which then requests the task Database - bring over task id and user which is identified by jwt jsonwebtoken
    // Find task based on param, check that user postedBy is logged in, find and update task, then return data
    Task.findOne({ _id: req.params.taskId }, (err, doc) => {
        if (err) {
            res.status(500).json({ Error: error });
        } else if (req.user.id != doc.postedBy) {
          console.log("testing result:", req.user.id, doc.postedBy);
            res.status(401).json({
                Errors: [
                    { msg: `${req.user.name} Is Not Authorized To Edit Task` },
                ],
            });
            mongoose.connection.close();
        } else {
            // name matches logon
            req.body.skillsRequired = req.body.skillsRequired.split(",");
            Task.findByIdAndUpdate(
                req.params.taskId,
                req.body,
                { new: true },
                (error, task) => {
                    if (error) res.status(500).json({ Error: error });
                    else {
                        res.status(200).json({
                            data: task.authenticatedResJson(),
                        });
                    }
                }
            );
        }
    });
});

// GET view Task screen
router.get("/:userName/:taskId", (req, res) => {
    // search for task ID, task will contain user ID, return task info. userName serves no purpose, could remove. But it might be nice to see the business in the url.
    Task.findOne({ _id: req.params.taskId }, (err, doc) => {
        if (err) {
            res.status(500).json({ Error: err });
        } else {
            res.status(200).json({ data: doc.resJson() });
        }
    });
});

// PUT - add interestedIn user from task
router.put("/add-interest/:taskId", isLoggedIn, (req, res) => {
    // if logged in user clicks interest in a task, they are added to interestedIn array. Duplication of interest is prohibited
    // $addToSet can be used instead of forEach loop, instead, will only add 1 total instance
    if (req.user.role === "organization") {
        res.status(403).json({
            Errors: [
                {
                    msg: `${req.user.role} Is Not Authorized To Show Interest In A Task`,
                },
            ],
        });
    } else {
        Task.findOne({ _id: req.params.taskId }, (err, doc) => {
            let addInterestedUser = {
                user: req.user.id,
                accepted: null,
            };
            let userAdded = false;
            if (err) {
                res.status(500).json({ Error: error });
            } else {
                doc.interestedIn.forEach((e) => {
                    if (e.user == req.user.id) {
                        res.status(403).json({
                            Error: [
                                {
                                    msg:
                                        "Duplicate Request. User Already Showed Interest",
                                },
                            ],
                        });
                        return (userAdded = true);
                    }
                });

                if (!userAdded) {
                    Task.findOneAndUpdate(
                        { _id: req.params.taskId },
                        { $push: { interestedIn: addInterestedUser } },
                        (error, task) => {
                            if (error) {
                                res.status(500).json({ Error: error });
                            } else {
                                res.status(200).json({
                                    msg: "User Has Shown Interest In Task",
                                    data: task.resJson(),
                                });
                            }
                        }
                    );
                }
            }
        });
    }
});

// PUT - remove interestedIn user from task
// TODO: the only users that should be able to remove interest is the person that showed interest
router.put("/remove-interest/:taskId", isLoggedIn, (req, res) => {
    Task.findOneAndUpdate(
        { _id: req.params.taskId },
        { $pullAll: { interestedIn: [{ user: req.user.id }] } },
        (err, doc) => {
            if (err) {
                console.log(err);
            } else {
                console.log("User removed, if they were on list.");
                res.status(200).json({ data: doc.resJson() });
            }
        }
    );
});

// PUT - org. to accept or decline interestedIn user
router.put("/accept-interest/:taskId", isLoggedIn, async (req, res) => {
    // on task screen, org. can click on a volunteer that is interestedIn task. If the org. is the creator of the task, then they can either click accept yes, or no.
    let { acceptedStatus, volunteer } = req.body;
    Task.findOne({ _id: req.params.taskId }, (err, doc) => {
        let volunteerInterestFound = false;

        if (err) {
            res.status(500).json({ Error: err });
        } else if (req.user.id == doc.postedBy) {
            doc.interestedIn.forEach((e) => {
                if (e.user == volunteer) {
                    //user matched - make change
                    volunteerInterestFound = true;
                    e.accepted = acceptedStatus;
                    doc.save();
                    console.log("Volunteer acceptedStatus updated");
                    res.status(200).json({ data: doc.authenticatedResJson() });
                }
            });
            if (!volunteerInterestFound) {
                res.status(404).json({
                    msg: "Volunteer Has Not Shown Interest",
                    data: doc.resJson(),
                });
            }
        } else {
            res.status(403).json({
                Errors: [
                    {
                        msg: "User Not Authorized to Accept Interest",
                        data: doc.resJson(),
                    },
                ],
            });
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
            } else {
                res.status(401).json({
                    response: `${req.user.name} is not authorized to delete this post`,
                });
            }
        }
    });
});

module.exports = router;
