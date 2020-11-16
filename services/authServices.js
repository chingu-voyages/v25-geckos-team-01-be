const jwt = require("jsonwebtoken");
const User = require("../models/User");

const checkLoginStatus = (req, res, next) => {
    // Gather the jwt access token from the request header
    const authHeader = req.headers["token"];
    const jsonToken = authHeader && authHeader.split(" ")[1];
    if (jsonToken == null) return res.sendStatus(401); // if there isn't any token

    jwt.verify(jsonToken, process.env.JWT_SECRET, (err, user) => {
        if (err) {
            console.log(err);
            res.status(500).status({ message: "Invalid Token" });
        }
        req.user = user;
        next();
    });
};

const checkExistingUsers = async (req, res, next) => {
    try {
        const existingUser = await User.findOne({ email: req.body.email });
        if (existingUser) {
            res.json({ response: "User with that email already exists" });
        } else {
            next();
        }
    } catch (error) {
        res.status(500).json({ Error: error });
    }
};

module.exports = { checkLoginStatus, checkExistingUsers };
