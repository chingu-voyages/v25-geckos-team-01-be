const jwt = require("jsonwebtoken");

const checkLoginStatus = (req, res, next) => {
    // Gather the jwt access token from the request header
    const authHeader = req.headers["authorization"];
    const jsonToken = authHeader && authHeader.split(" ")[1];
    if (jsonToken == null) return res.sendStatus(401); // if there isn't any token

    jwt.verify(jsonToken, process.env.JWT_SECRET, (err, user) => {
        if (err) {
            console.log(err);
            res.sendStatus(403);
        }
        req.user = user;
        next(); // pass the execution off to whatever request the client intended
    });
};

module.exports = checkLoginStatus;
