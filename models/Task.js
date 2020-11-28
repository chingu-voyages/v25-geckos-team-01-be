const mongoose = require("mongoose");

const taskSchema = new mongoose.Schema({
    title: { type: String, require: true },
    postedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    description: { type: String, require: true },
    skillsRequired: [String],
    location: { type: String },
    taskEnd: { type: Date },
    status: { type: String, default: "open", enum: ["open", "closed"] },
    interestedIn: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
});

taskSchema.methods.authenticatedResJson = function () {
    return {
        id: this._id,
        title: this.title,
        postedBy: this.postedBy,
        description: this.description,
        skillsRequired: this.skillsRequired,
        location: this.location,
        taskEnd: this.taskEnd,
        status: this.status,
        interestedIn: this.interestedIn,
    };
};

taskSchema.methods.resJson = function () {
    return {
        id: this._id,
        title: this.title,
        postedBy: this.postedBy,
        description: this.description,
        skillsRequired: this.skillsRequired,
        location: this.location,
        taskEnd: this.taskEnd,
        status: this.status,
    };
};

module.exports = mongoose.model("Task", taskSchema);
