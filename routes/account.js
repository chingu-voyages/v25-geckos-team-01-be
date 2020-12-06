const express = require("express");
const User = require("../models/User");
const Task = require("../models/Task");
const { isLoggedIn } = require("../services/authServices");

const router = express.Router();

// Get the currently logged in Users account info
router.get("/", isLoggedIn, async (req, res) => {
    try {
        const user = await User.findById(req.user.id);
        // logic separating volunteer and organization account pages
        if (user.role === "organization") {
            const userTasks = await Task.find({ postedBy: user._id });
            res.status(200).json({
                data: user.authenticatedResJson(),
                tasks: userTasks.authenticatedResJson(),
            });
        } else {
            // user is a volunteer
            res.status(200).json({ data: user.authenticatedResJson() });
        }
    } catch (err) {
        res.status(400);
    }
});

// Update the currently logged in Users account info
router.put("/", isLoggedIn, async (req, res) => {
    // Should not be able to change the password here.
    // changing the password would require generating a new token and generating a new hash password
    if (req.body.password || req.body.role) {
        res.status(401).json({ Errors: [{ msg: "Unable To Change Password Or Role" }] });
    } else {
        try {
            let updatedUser = await User.findByIdAndUpdate(
                req.user.id,
                [
                    req.body,
                    {
                        image: {
                            data: req.files.file.data,
                            contentType: req.files.file.mimetype, // Add image buffer
                        },
                    },
                ],
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
router.get("/:userSlug", async (req, res) => {
    try {
        let profile = await User.findOne({ slug: req.params.userSlug });
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
