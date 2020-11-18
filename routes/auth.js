const express = require("express");
const User = require("../models/User");
const jwt = require("jsonwebtoken");
const { checkExistingUsers } = require("../services/authServices");

const router = express.Router();

// POST Login
router.post("/login", async (req, res) => {
    try {
        const user = await User.findOne({ email: req.body.email });
        if (user) {
            let userIsAuthenticated = user.validatePassword(
                req.body.password,
                user.password
            );
            if (userIsAuthenticated) {
                res.status(200).json({ data: user.returnableAuthJson() });
            } else {
                res.status(400).json("Email or password do not match");
            }
        } else {
            res.status(404).json("User not found");
        }
    } catch (error) {
        console.log(error);
        res.status(500).json("Database error: ", error);
    }
});

// POST Registration
router.post("/register", checkExistingUsers, async (req, res) => {
    try {
        const user = new User();
        user.name = req.body.name;
        user.slug = req.body.name; // lodash
        user.email = req.body.email;
        user.phoneNumber = req.body.phoneNumber;
        user.role = req.body.role;
        user.description = req.body.description;
        user.tags = req.body.tags;
        user.password = User.generateHashPassword(req.body.password);
        await user.save();
        res.status(200).json({ data: user.returnableAuthJson() });
    } catch (error) {
        res.status(500).json({ Error: error });
    }
});

module.exports = router;
