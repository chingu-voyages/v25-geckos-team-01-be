require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const connectDB = require("./models/db");

const app = express();

connectDB();

app.use(bodyParser.urlencoded({ extended: true })); // parse application/x-www-form-urlencoded
app.use(bodyParser.json()); // parse application/json

// CORS DEV
app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "127.0.0.1:3000");
    next();
});

// Routes
const splashRouter = require("./routes/splash");
app.use("/splash", splashRouter);

const authRouter = require("./routes/auth");
app.use("/auth/", authRouter);

const taskRouter = require("./routes/task");
app.use("/task/", taskRouter);

const accountRouter = require("./routes/account");
app.use("/account/", accountRouter);

//
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Example app listening at http://localhost:${PORT}`);
});
