const express = require("express");
const User = require("../models/User");
const Task = require("../models/Task");
const jwt = require("jsonwebtoken");

const router = express.Router();

//TODO: Seperate the Organization and volunteers function

// Get the Users Account
router.get("/", (req, res) => {});

// Update the Users account
router.put("/", (req, res) => {});

module.exports = router;
