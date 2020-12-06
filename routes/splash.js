const express = require("express");
const Task = require("../models/Task");

const router = express.Router();

router.get("/", async (req, res) => {
    try {
        let tasks = await Task.find({});
        res.status(200).json(tasks);
    } catch (err) {
        res.status(500).json({ Error: err });
    }
});

module.exports = router;
