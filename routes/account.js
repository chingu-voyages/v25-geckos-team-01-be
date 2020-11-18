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
        // logic separating volunteer and organization account pages
        if (user.role === "organization") {
            const userTasks = await Task.find({ postedBy: user._id });
            res.status(200).json({
                data: user.returnableAuthJson(),
                tasks: userTasks,
            });
        } else {
            // user is a volunteer
            res.status(200).json({ data: user.returnableAuthJson() });
        }
    } catch (err) {
        res.status(400);
    }
});

// Update the Users account
router.put("/", protectedRouteAccess, async (req, res) => {
    console.log(req.user);
    console.log(req.body);
    // if req.password encrypt the password
    try {
        let updatedUser = await User.findByIdAndUpdate(req.user.id, req.body, {
            new: true,
        });

        res.json({ data: updatedUser.returnableAuthJson() });
    } catch (error) {
        console.log(error);
    }
});

module.exports = router;
