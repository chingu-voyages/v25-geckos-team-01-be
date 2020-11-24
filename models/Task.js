const mongoose = require("mongoose");
mongoose.set("useCreateIndex", true);

const taskSchema = new mongoose.Schema({
    title: { type: String },
    postedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    description: { type: String },
    skillsRequired: [String],
    location: {        
        address: { type: String },
        city: { type: String },
        zipCode: { type: String },
        country: { type: String },
    },
    endTask: { type: Date },
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
        endTask: this.endTask,
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
        endTask: this.endTask,
        status: this.status,
    };
};

module.exports = mongoose.model("Task", taskSchema);
