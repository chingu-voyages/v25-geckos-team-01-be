const express = require("express");
const bodyParser = require("body-parser");
const dotenv = require("dotenv");
const connectDB = require("./models/db")

dotenv.config();
const app = express();

connectDB()

app.use(bodyParser.urlencoded({ extended: true })); // parse application/x-www-form-urlencoded
app.use(bodyParser.json()); // parse application/json


const splashRouter = require("./routes/splash")
app.use("/", splashRouter)

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Example app listening at http://localhost:${port}`);
});
