const express = require("express");
const User = require("../models/User");
const jwt = require("jsonwebtoken");

const router = express.Router();

const checkAccountStatus = (req, res, next) => {
    // Need some kind of way to check if user not logged in. Else. Redirect to task
    next();
};

// GET login
router.get("/", checkAccountStatus, (req, res) => {});

// POST Login
router.post("/", checkAccountStatus, async (req, res) => {
    try {
        let user = await User.findOne({ email: req.body.email });
        if (user) {
            let userIsAuthenticated = user.validatePassword(
                req.body.password,
                user.password
            );
            // TODO: make sure User Model has token field, _id field,
            // TODO: make sure .env has a JWT_SECRET
            if (userIsAuthenticated) {
                user.token = jwt.sign(
                    { id: user._id },
                    process.env.JWT_SECRET,
                    { expiresIn: "10d" }
                );
                res.status(200).json({
                    status: 200,
                    data: "The Returned User Data",
                });
            } else {
                res.status(400).json({
                    status: 400,
                    message: "Password is incorrect",
                });
            }
        } else {
            res.status(400).json({
                status: 400,
                message: "User does not exist",
            });
        }
    } catch (err) {
        console.log(err);
        res.status(400).json({
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
router.get("/register", checkAccountStatus, (req, res) => {
    console.log("Get Registration Page");
});

// POST Registration
router.post("/register", checkAccountStatus, async (req, res) => {
    try {
        let user = new User();
        user.name = req.body.name;
        user.email = req.body.email;
        user.phoneNumber = req.body.phoneNumber;
        user.details = req.body.details;
        // TODO: make sure the user model has the hashPassword method
        user.password = user.generateHashedPassword(req.body.password);
        user = await user.save();
        // Figure out why the token is placed after the save()
        user.token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET, {
            expiresIn: "10d",
        });
        res.status(200).json({ data: user });
    } catch (err) {
        console.log(err);
        res.status(400).json({ message: "An error occurred", err });
    }
});

module.exports = router;
