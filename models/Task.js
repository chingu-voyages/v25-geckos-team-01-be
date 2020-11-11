const mongoose = require("mongoose");

const taskSchema = new mongoose.Schema({
    title: { type: String },
    organization: [], //TODO: find out how to reference organization as author
    description: { type: String },
    skillsRequired: [String],
    location: { type: String },
    endTask: { type: Date },
    status: { type: String, default: "open", enum: ["open", closed] },
});

module.exports = mongoose.model("Task", taskSchema);
