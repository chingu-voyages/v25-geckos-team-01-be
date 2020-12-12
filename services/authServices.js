const jwt = require("jsonwebtoken");
const User = require("../models/User");

const isLoggedIn = (req, res, next) => {
    // Gather the jwt access token from the request header
    const authHeader = req.headers["authorization"];
    const jsonToken = authHeader && authHeader.split(" ")[1];
    if (jsonToken == null) {
        return res
            .status(403)
            .json({ Errors: [{ msg: "Authorization Error.." }] });
    }
    jwt.verify(jsonToken, process.env.JWT_SECRET, (err, user) => {
        if (err) {
            console.log(err)
            res.status(403).json({ Errors: [{ msg: "Authorization Error" }] });
        }
        // console.log(user);
        req.user = user;
        next();
    });
};

module.exports = { isLoggedIn };
