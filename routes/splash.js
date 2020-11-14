const express = require("express");
const Task = require("../models/Task");

const router = express.Router();

router.get("/", async (req, res) => {
    Task.find({}, (err, tasks) => {
        if (err) res.json("Database error").sendStatus(500);
        res.json(task).sendStatus(200);
    });
});

module.exports = router;
