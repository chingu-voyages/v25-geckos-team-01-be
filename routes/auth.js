const express = require("express");
const User = require("../models/User");
const jwt = require("jsonwebtoken");

const router = express.Router();

// GET login
router.get("/", (req, res) => {
    res.sendStatus(200);
});

// POST Login
router.post("/login", async (req, res) => {
    try {
        let user = await User.findOne({ email: req.body.email });
        if (user) {
            let userIsAuthenticated = user.validatePassword(
                req.body.password,
                user.password
            );
            if (userIsAuthenticated) {
                let token = jwt.sign(
                    { _id: user._id, name: user.name },
                    process.env.JWT_SECRET,
                    { expiresIn: "10d" }
                );
                res.status(200).json({
                    data: user,
                    token: token,
                });
            } else {
                res.status(400).json({
                    message: "Password is incorrect",
                });
            }
        } else {
            res.status(400).json({
                message: "User does not exist",
            });
        }
    } catch (err) {
        console.log(err);
        res.status(500).json({
            message: "Some database error...maybe...?",
            err,
        });
    }
});

// GET logoff
router.get("/logoff", (req, res) => {
    console.log("Get to Logoff");
});

// Get Registration
router.get("/register", (req, res) => {
    res.sendStatus(200);
});

// POST Registration
router.post("/register", async (req, res) => {
    try {
        let {
            name,
            email,
            phoneNumber,
            role,
            description,
            tags,
            password,
        } = req.body;
        let user = new User();
        user.name = name;
        user.email = email;
        user.phoneNumber = phoneNumber;
        user.role = role;
        user.description = description;
        user.tags = tags;
        user.password = user.generateHashPassword(password);
        await user.save();
        let token = jwt.sign(
            { _id: user._id, name: user.name },
            process.env.JWT_SECRET,
            {
                expiresIn: "10d",
            }
        );
        res.status(200).json({ data: user, token: token });
    } catch (err) {
        console.log(err);
        res.status(500).json("An error occurred");
    }
});

module.exports = router;
