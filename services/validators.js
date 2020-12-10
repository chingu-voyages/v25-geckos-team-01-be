const { check, body } = require("express-validator");
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
    check("phoneNumber").custom((phoneNumber) => {
        if (phoneNumber) {
            phoneNumber
                .isMobilePhone()
                .withMessage("Must Be  A Valid Phone Number");
        } else {
            return true;
        }
    }),

    // role
    check("role")
        .isIn(["organization", "volunteer"])
        .withMessage("Must Be Either An organization Or A volunteer"),

    // description
    check("description").custom((description) => {
        if (description) {
            description.escape().trim();
        } else {
            return true;
        }
    }),

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
];

const updateUserValidation = [
    // name
    check("name").custom((name) => {
        if (name) {
            name.custom(async (value) => {
                const existingName = await User.findOne({ name: value });
                if (existingName) {
                    throw new Error(`Name Already In Use`);
                }
                return true;
            });
        } else return true;
    }),

    //email
    check("email").custom((email) => {
        if (email) {
            email
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
                .normalizeEmail();
        } else {
            return true;
        }
    }),

    // phoneNumber
    check("phoneNumber").custom((phoneNumber) => {
        if (phoneNumber) {
            phoneNumber
                .isMobilePhone()
                .withMessage("Must Be  A Valid Phone Number");
        } else {
            return true;
        }
    }),

    // description
    check("description").custom((description) => {
        if (description) {
            description.trim();
        } else return true;
    }),

    // tags
    check("tags").custom((tags) => {
        if (tags) {
            tags.isString();
        } else {
            return true;
        }
    }),

    // password
    check("password").custom((password) => {
        if (password) {
            password
                .isLength({ min: 8 })
                .withMessage("Password Must Be At Least 8 Characters In Length")
                .matches("[0-9]")
                .withMessage("Password Must Contain A Number")
                .matches("[A-Z]")
                .withMessage("Password Must Contain An Uppercase Letter");
        } else return true;
    }),
];

const taskValidation = [
    check("title").notEmpty().withMessage("Field Cannot Be Empty"),
    check("description").trim(),
    check("skillsRequired").isString(),
    check("location").isString(),
    check("taskEnd").isDate().withMessage("Date Must Be In Format YYYY/MM/DD"),
    check("status")
        .isIn(["open", "closed"])
        .withMessage("Must Be Either open Or closed"),
    check("interestedIn"),
];

module.exports = {
    registrationValidation,
    updateUserValidation,
    taskValidation,
};
