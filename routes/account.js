const express = require("express");
const User = require("../models/User");
const Task = require("../models/Task");
const { isLoggedIn } = require("../services/authServices");
const { updateUserValidation } = require("../services/validators");

const router = express.Router();

// Get the currently logged in Users account info
router.get("/", isLoggedIn, async (req, res) => {
    try {
        const user = await User.findById(req.user.id);
        // logic separating volunteer and organization account pages
        if (user.role == "organization") {
            const userTasks = await Task.find({ postedBy: user.id });
            if (!Object.keys(userTasks).length) {
                // checking if tasks is empty aka no tasks by user
                res.status(200).json({
                    data: user.authenticatedResJson(),
                });
            } else {
                res.status(200).json({
                    data: user.authenticatedResJson(),
                    tasks: userTasks.authenticatedResJson(),
                });
            }
        } else if (user.role == "volunteer") {
            // user is a volunteer
            console.log("volunteer");
            res.status(200).json({ data: user.authenticatedResJson() });
        }
    } catch (err) {
        console.log(err);

        res.status(404).json({
            Errors: [{ msg: "User Not Found" }, { msg: err }],
        });
    }
});

// Update the currently logged in Users account info
router.put("/", isLoggedIn, updateUserValidation, async (req, res) => {
    // Should be able to change password now
    // At the moment Tags cannot be updated, and after save they must change the token to the returned token
    if (req.body.role) {
        res.status(401).json({
            Errors: [{ msg: "Unable To Change Password Or Role" }],
        });
    } else if (req.files && req.body) {
        try {
            const file = {
                image: {
                    data: req.files.file.data,
                    contentType: req.files.file.mimetype,
                },
            };
            req.body.tags = req.body.tags.split(",");
            const update = { ...req.body, ...file };
            let updatedUser = await User.findByIdAndUpdate(
                req.user.id,
                update,
                {
                    new: true,
                }
            );

            res.json({ data: updatedUser.authenticatedResJson() });
        } catch (error) {
            res.status(500).json({ Error: error });
        }
    } else {
        try {
            req.body.tags = req.body.tags.split(",");
            let updatedUser = await User.findByIdAndUpdate(
                req.user.id,
                req.body,
                {
                    new: true,
                }
            );

            res.json({ data: updatedUser.authenticatedResJson() });
        } catch (error) {
            res.status(500).json({ Error: error });
        }
    }
});

// Delete the currently logged in User info
router.delete("/", isLoggedIn, async (req, res, next) => {
    try {
        await User.findByIdAndDelete(req.user.id, (error) => {
            if (error) {
                return res
                    .status(404)
                    .json({ Errors: [{ msg: "User Could Not Be Deleted" }] });
            }
            res.status(200).json({ data: "User has been deleted" });
            // Here the client side would delete the token and be redirected to
        });
    } catch (error) {
        res.status(500).json({ Error: error });
    }
});

// Get a users profile regardless of login status
router.get("/:userId", async (req, res) => {
    try {
        let profile = await User.findOne({ _id: req.params.userId });
        // console.log(profile)
        if (profile) {
            res.status(200).json({ data: profile.resJson() });
        } else {
            res.status(404).json({ Errors: [{ msg: "No User By That Name" }] });
        }
    } catch (error) {
        res.status(500).json({ Error: error });
    }
});

module.exports = router;
