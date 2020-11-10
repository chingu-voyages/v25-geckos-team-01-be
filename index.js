var express = require("express");
var bodyParser = require("body-parser");
var dotenv = require("dotenv");

var app = express();

dotenv.config();
app.use(bodyParser.urlencoded({ extended: true })); // parse application/x-www-form-urlencoded
app.use(bodyParser.json()); // parse application/json
app.use(express.json());


var splashRouter = require("./routes/splash")
app.use("/", splashRouter)

var port = process.env.PORT || 5000;
app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`);
});
