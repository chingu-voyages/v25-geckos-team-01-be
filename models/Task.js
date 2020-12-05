const mongoose = require("mongoose");

const taskSchema = new mongoose.Schema({
    title: { type: String, require: true },
    postedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        require: true,
    },
    description: { type: String, require: true },
    skillsRequired: [{ skill: { type: String } }],
    location: { type: String },
    taskEnd: { type: Date },
    status: { type: String, default: "open", enum: ["open", "closed"] },
    interestedIn: [
        {
            user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
            accepted: {
                type: String,
                default: null,
                enum: [null, "yes", "no"],
            },
            _id: false,
        },
    ],
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
