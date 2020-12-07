const mongoose = require("mongoose");
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
        image: { data: { type: Buffer }, contentType: { type: String } },
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

userSchema.pre("save", function (next) {
    var user = this;
    const salt = bcrypt.genSaltSync(10);
    bcrypt.hash(user.password, salt, function (err, hash) {
        if (err) return next(err);
        user.password = hash;
        next();
    });
});

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
