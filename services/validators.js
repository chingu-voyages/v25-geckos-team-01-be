const { check, validationResult } = require("express-validator");
const User = require("../models/User");

const registrationValidation = [
    // name
    check("name")
        .notEmpty()
        .withMessage("Field Cannot Be Empty")
        .custom(async (value) => {
            const existingName = await User.findOne({ name: value });
            if (existingName) {
                throw new Error(`Name Already In Use`);
            }
            return true;
        }),

    //email
    check("email")
        .notEmpty()
        .withMessage("Field Cannot Be Empty")
        .isEmail()
        .withMessage("Must Be A Valid Email Address")
        .custom(async (value) => {
            const existingEmail = await User.findOne({ email: value });
            if (existingEmail) {
                throw new Error("Email Already In Use");
            }
            return true;
        })
        .trim()
        .normalizeEmail(),

    // phoneNumber
    check("phoneNumber")
        .isMobilePhone()
        .withMessage("Must Be A Valid Phone Number"),

    // images
    check("image").isString(),

    // role
    check("role")
        .isIn(["organization", "volunteer"])
        .withMessage("Must Be Either An organization Or A volunteer"),

    // description
    check("description").escape().trim(),

    // tags
    check("tags").isString(),

    // password
    check("password")
        .notEmpty()
        .withMessage("Field Cannot Be Empty")
        .isLength({ min: 8 })
        .withMessage("Password Must Be At Least 8 Characters In Length")
        .matches("[0-9]")
        .withMessage("Password Must Contain A Number")
        .matches("[A-Z]")
        .withMessage("Password Must Contain An Uppercase Letter"),

    // password confirm
    check("passwordConfirm").custom((value, { req }) => {
        if (value !== req.body.password) {
            throw new Error("Password Confirmation Does Not Match Password");
        }
    }),
];

module.exports = { registrationValidation };