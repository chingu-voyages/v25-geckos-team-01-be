const express = require("express");
const router = express.Router();

// GET login
router.get("/", (req, res) => {
    try {
        const user = req.body;
        res.status(200);
    } catch (err) {
        console.log("Error: ", err);
    }
});

// POST Login
router.post("/", (req, res) => {
    console.log("Post to Login Page");
});

// GET logoff
router.get("/logoff", (req, res) => {
    console.log("Get to Logoff");
});

// Get Registration
router.get("/register", (req, res) => {
    console.log("Get Registration Page");
});

// POST Registration
router.post("/register", (req,res) =>{
    console.log("Post to Registration Page")
});

module.exports = router;
