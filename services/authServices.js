const jwt = require("jsonwebtoken");
const User = require("../models/User");

const isLoggedIn = (req, res, next) => {
    // Gather the jwt access token from the request header
    const authHeader = req.headers["authorization"];
    const jsonToken = authHeader && authHeader.split(" ")[1];
    if (jsonToken == null) return res.sendStatus(403);

    jwt.verify(jsonToken, process.env.JWT_SECRET, (err, user) => {
        if (err) {
            console.log(err);
            res.status(500).status({ message: "Invalid Token" });
        }
        // console.log(user);
        req.user = user;
        next();
    });
};

const checkExistingUsers = async (req, res, next) => {
    try {
        const existingUser = await User.findOne({ email: req.body.email });
        const existingName = await User.findOne({ name: req.body.name });
        if (existingUser) {
            res.json({
                data:
                    "User With The Email " + req.body.email + " Already Exists",
            });
        } else if (existingName) {
            res.json({
                data: "User With The Name " + req.body.name + " Already Exists",
            });
        } else {
            next();
        }
    } catch (error) {
        res.status(500).json({ Error: error });
    }
};

module.exports = { isLoggedIn, checkExistingUsers };
