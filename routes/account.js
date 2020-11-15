const express = require("express");
const User = require("../models/User");
const Task = require("../models/Task");
const jwt = require("jsonwebtoken");
const checkLoginStatus = require("../services/authServices");

const router = express.Router();

//TODO: Seperate the Organization and volunteers function

// TODO: if user is an organization also list out their tasks

// on Postman Headers -- token == Bearer: <token>

// Get the Users Account
router.get("/", checkLoginStatus, async (req, res) => {
    try{
        const user = await User.findById(req.user.id)
        res.status(200).json(user)
    } catch (err) {
        res.status(400)
    }
});

// Update the Users account
router.put("/", checkLoginStatus, async (req, res) => {});

module.exports = router;
