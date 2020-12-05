const mongoose = require("mongoose");
mongoose.set("useCreateIndex", true);
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const slug = require("mongoose-slug-generator");

mongoose.plugin(slug);

const userSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
            index: true,
        },
        slug: { type: String, slug: "name" },
        email: {
            type: String,
            lowercase: true,
            required: true,
            index: true,
        },
        phoneNumber: { type: String },
        image: { type: String },
        role: {
            type: String,
            enum: ["organization", "volunteer"],
            require: true,
        },
        description: { type: String },
        tags: [{ tag: { type: String } }],
        password: {
            type: String,
            required: true,
        },
    },
    { timestamps: true }
);

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
            role: this.role,
        },
        process.env.JWT_SECRET,
        { expiresIn: "10h" }
    );
};

userSchema.methods.authenticatedResJson = function () {
    return {
        id: this._id,
        name: this.name,
        slug: this.slug,
        email: this.email,
        phoneNumber: this.phoneNumber,
        image: this.image,
        role: this.role,
        description: this.description,
        tags: this.tags,
        token: this.generateJWT(),
    };
};

userSchema.methods.resJson = function () {
    return {
        id: this._id,
        name: this.name,
        image: this.image,
        role: this.role,
        description: this.description,
        tags: this.tags,
    };
};

module.exports = mongoose.model("User", userSchema);
