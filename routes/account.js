const express = require("express");
const User = require("../models/User");
const Task = require("../models/Task");
const { protectedRouteAccess } = require("../services/authServices");

const router = express.Router();

// Get the Users Account
router.get("/", protectedRouteAccess, async (req, res) => {
    try {
        const user = await User.findById(req.user._id);
        // logic separating volunteer and organization account pages
        if (user.role === "organization") {
            const userTasks = await Task.find({ postedBy: user._id });
            res.status(200).json({
                data: user.returnableAuthJson(),
                tasks: userTasks,
            });
        } else {
            // user is a volunteer
            res.status(200).json({ user: user.returnableAuthJson() });
        }
    } catch (err) {
        res.status(400);
    }
});

// Update the Users account

// Finish this logic
router.put("/", protectedRouteAccess, async (req, res) => {
    try {
        let user = await User.findById(req.user._id);
        user.update({
            name: req.body.name,
            email: req.body.email,
            phoneNumber: req.body.phoneNumber,
            role: req.body.role,
            description: req.body.description,
            tags: req.body.tags,
        });
    } catch (error) {
        res.status(500).json({ Error: error });
    }
});

module.exports = router;
