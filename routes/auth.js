const express = require("express");
const User = require("../models/User");
const jwt = require("jsonwebtoken");
const {
    checkLoginStatus,
    checkExistingUsers,
} = require("../services/authServices");

const router = express.Router();

// GET login
router.get("/", (req, res) => {
    res.sendStatus(200);
});

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

// GET logoff
router.get("/logoff", (req, res) => {
    res.sendStatus(200);
});

// Get Registration
router.get("/register", (req, res) => {
    res.sendStatus(200);
});

// POST Registration
router.post("/register", checkExistingUsers, async (req, res) => {
    try {
        const user = new User();
        user.name = req.body.name;
        user.email = req.body.email;
        user.phoneNumber = req.body.phoneNumber;
        user.role = req.body.role;
        user.description = req.body.description;
        user.tags = req.body.tags;
        user.password = user.generateHashPassword(req.body.password);
        await user.save();
        res.status(200).json({ data: user.returnableAuthJson() });
    } catch (error) {
        res.status(500).json({ Error: error });
    }
});

module.exports = router;
