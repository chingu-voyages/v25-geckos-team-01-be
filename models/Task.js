const mongoose = require("mongoose");
mongoose.set("useCreateIndex", true);

const taskSchema = new mongoose.Schema({
    title: { type: String },
    postedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    description: { type: String },
    skillsRequired: [String],
    location: {
        city: { type: String },
        address: { type: String },
        country: { type: String },
        zipCode: { type: String },
    },
    endTask: { type: Date },
    status: { type: String, default: "open", enum: ["open", "closed"] },
    interestedIn: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
});

taskSchema.methods.authenticatedResJson = function () {
    return {
        title: this.title,
        postedBy: this.postedBy,
        description: this.description,
        skillsRequired: this.skillsRequired,
        location: this.location,
        endTask: this.endTask,
        status: this.status,
        interestedIn: this.interestedIn,
    };
};

taskSchema.methods.resJson = function () {
    return {
        title: this.title,
        postedBy: this.postedBy,
        description: this.description,
        skillsRequired: this.skillsRequired,
        location: this.location,
        endTask: this.endTask,
        status: this.status,
    };
};

module.exports = mongoose.model("Task", taskSchema);
