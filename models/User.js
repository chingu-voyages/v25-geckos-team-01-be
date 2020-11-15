const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const userSchema = new mongoose.Schema({
    name: { type: String, required: true, maxlength: 125 }, // The name of the person or organization
    email: { type: String, lowercase: true, required: true, unique: true },
    phoneNumber: { type: String }, // could set: num=> '(111) 111-1111 ext. 1111
    role: { type: String, enum: ["organization", "volunteer"], require: true },
    description: { type: String, maxlength: 450 },
    tags: [String],
    password: { type: String, required: true },
});

userSchema.methods.generateHashPassword = (password) => {
    const salt = bcrypt.genSaltSync(10);
    const hash = bcrypt.hashSync(password, salt);
    return hash;
};

userSchema.methods.validatePassword = (password, hashedPassword) => {
    let res = bcrypt.compareSync(password, hashedPassword);
    return res;
};

module.exports = mongoose.model("User", userSchema);
