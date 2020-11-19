const mongoose = require("mongoose");
mongoose.set('useCreateIndex', true);

const taskSchema = new mongoose.Schema({
    title: { type: String },
    postedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    description: { type: String },
    skillsRequired: [String],
    location: { type: String },
    endTask: { type: Date },
    status: { type: String, default: "open", enum: ["open", "closed"] },
});

module.exports = mongoose.model("Task", taskSchema);
