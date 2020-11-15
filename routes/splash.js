const express = require("express");
const Task = require("../models/Task");

const router = express.Router();

router.get("/", async (req, res) => {
    try {
        let tasks = await Task.find({});
        res.json(tasks);
    } catch (err) {
        res.sendStatus(500);
    }
});

module.exports = router;
