const mongoose = require("mongoose");

const organizationSchema = new mongoose.Schema({
    status: { type: Boolean, default: false },
    description: { type: String, minlength: 25, maxlength: 350 },
    industryTags: [String],
    organizationLink: { type: String },
});

const volunteerSchema = new mongoose.Schema({
    status: { type: Boolean, default: true },
    description: { type: String, minlength: 25, maxlength: 350 },
    skillTags: [String],
    // ideally there would be a map to their previous completed tasks -- completedTasks: []
});

const userSchema = new mongoose.Schema({
    name: { type: String, required: true, minlength: 5, maxlength: 65 }, // The name of the person or organization
    email: { type: String, lowercase: true, required: true, unique: true },
    phoneNumber: { type: String }, // could set: num=> '(111) 111-1111 ext. 1111
    details: {
        organization: organizationSchema,
        volunteer: volunteerSchema,
    },
    password: { type: String, required: true },
});

module.exports = mongoose.model("User", userSchema);

