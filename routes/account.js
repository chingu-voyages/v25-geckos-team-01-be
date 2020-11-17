const express = require("express");
const User = require("../models/User");
const Task = require("../models/Task");
const { protectedRouteAccess } = require("../services/authServices");

const router = express.Router();

// Get the Users Account
router.get("/", protectedRouteAccess, async (req, res) => {
    try {
        console.log("Got this far");
        const user = await User.findById(req.user.id);
        console.log("Got a little farther");
        // logic separating volunteer and organization account pages
        if (user.role === "organization") {
            const userTasks = await Task.find({ postedBy: user._id });
            console.log("Got farther still");
            res.status(200).json({
                data: user.returnableAuthJson(),
                tasks: userTasks,
            });
        } else {
            // user is a volunteer
            console.log("Why isnt this working");
            res.status(200).json({ data: user.returnableAuthJson() });
        }
    } catch (err) {
        res.status(400);
    }
});

// Update the Users account
router.put("/", protectedRouteAccess, async (req, res) => {
    try {
        let updatedUser = await User.findByIdAndUpdate(
            req.user._id,
            {
                name: req.body.name,
                email: req.body.email,
                phoneNumber: req.body.phoneNumber,
                description: req.body.description,
                tags: req.body.tags,
                password: User.generateHashPassword(req.body.password),
            },
            { new: true }
        );

        console.log(updatedUser);
    } catch (error) {
        console.log(error);
    }
});

module.exports = router;
