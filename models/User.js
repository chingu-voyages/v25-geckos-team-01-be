const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        maxlength: 125,
        index: true,
    },
    slug: {
      type: String,
    },
    // The name of the person or organization
    email: {
        type: String,
        lowercase: true,
        required: true,
        match: [/\S+@\S+\.\S+/, "is invalid"],
    },
    phoneNumber: {
        type: String,
    },
    role: {
        type: String,
        enum: ["organization", "volunteer"],
        require: true,
    },
    description: {
        type: String,
        maxlength: 450,
    },
    tags: [String],
    password: {
        type: String,
        required: true,
    },
});

userSchema.statics.generateHashPassword = (password) => {
    if (password) {
        const salt = bcrypt.genSaltSync(10);
        const hash = bcrypt.hashSync(password, salt);
        return hash;
    }
};

userSchema.methods.validatePassword = (password, hashedPassword) => {
    let res = bcrypt.compareSync(password, hashedPassword);
    return res;
};

userSchema.methods.generateJWT = function () {
    let today = new Date();
    let exp = new Date(today);
    exp.setDate(today.getDate() + 1);
    return jwt.sign(
        {
            id: this._id,
            name: this.name,
        },
        process.env.JWT_SECRET,
        { expiresIn: "10h" }
    );
};

userSchema.methods.returnableAuthJson = function () {
    return {
        name: this.name,
        email: this.email,
        phoneNumber: this.phoneNumber,
        role: this.role,
        description: this.description,
        tags: this.tags,
        token: this.generateJWT(),
    };
};

module.exports = mongoose.model("User", userSchema);
