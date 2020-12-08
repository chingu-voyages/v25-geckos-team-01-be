const express = require("express");
const User = require("../models/User");
const { validationResult } = require("express-validator");
const { registrationValidation } = require("../services/validators");

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
                res.status(200).json({ data: user.authenticatedResJson() });
            } else {
                res.status(400).json({
                    Errors: [{ msg: "Email Or Password Do Not Match" }],
                });
            }
        } else {
            res.status(404).json({ Errors: [{ msg: "User Not Found" }] });
        }
    } catch (error) {
        res.status(500).json({ Errors: error });
    }
});

// POST Registration
router.post("/register", registrationValidation, async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ Errors: errors.array() });
    } else {
        try {
            const user = new User(req.body);
            // user.name = req.body.name;
            // user.email = req.body.email;
            // user.
            await user.save();
            res.status(200).json({ data: user.authenticatedResJson() });
        } catch (error) {
            res.status(500).json({ Error: error });
        }
    }
});

module.exports = router;
