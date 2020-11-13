require('dotenv').config();
const express = require("express");
const bodyParser = require("body-parser");
const connectDB = require("./models/db");
const mongoose = require("mongoose");

const app = express();

connectDB()

app.use(bodyParser.urlencoded({ extended: true })); // parse application/x-www-form-urlencoded
app.use(bodyParser.json()); // parse application/json


const splashRouter = require("./routes/splash")
app.use("/", splashRouter)

const authRouter = require("./routes/auth")
app.use("auth/", authRouter)

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Example app listening at http://localhost:${PORT}`);
});


//Testing MongoDB connection - Success. Use later if need to reconfirm connection.
// const userSchema = new mongoose.Schema({
//   fName: String,
//   lName: String
// });
//
// const User = mongoose.model("User", userSchema);
//
// const arr = [
//   {
//   fName: "Bob",
//     lName: "Smith"
// },
// {
//     fName: "Judy",
//     lName: "Garland"
//   }
// ];
//
// User.insertMany(arr, function(error) {
//   if (error) {
//     console.log(error)
//   } else {
//     console.log("success");
//     mongoose.connection.close();
//   }
// })
