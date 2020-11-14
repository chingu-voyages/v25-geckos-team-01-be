const express = require("express");
const User = require("../models/User");
const jwt = require("jsonwebtoken");

const router = express.Router();

// GET login
router.get("/", (req, res) => {
    res.sendStatus(200);
});

// POST Login
router.post("/", async (req, res) => {
    try {
        let user = await User.findOne({ email: req.body.email });
        if (user) {
            let userIsAuthenticated = user.validatePassword(
                req.body.password,
                user.password
            );
            if (userIsAuthenticated) {
                user.token = jwt.sign(
                    { _id: user._id, name: user.name },
                    process.env.JWT_SECRET,
                    { expiresIn: "10d" }
                );
                res.json({
                    status: 200,
                    data: user,
                });
            } else {
                res.json({
                    status: 400,
                    message: "Password is incorrect",
                });
            }
        } else {
            res.json({
                status: 400,
                message: "User does not exist",
            });
        }
    } catch (err) {
        console.log(err);
        res.json({
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
        user.token = jwt.sign(
            { _id: user._id, name: user.name },
            process.env.JWT_SECRET,
            {
                expiresIn: "10d",
            }
        );
        res.json({ data: user });
    } catch (err) {
        console.log(err);
        res.json({ message: "An error occurred", err }).sendStatus(400);
    }
});

module.exports = router;
