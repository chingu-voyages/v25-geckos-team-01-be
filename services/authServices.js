const bcrypt = require("bcryptjs");
const User = require("../models/User");

const loginUser = async (payload) => {
    const { email, password } = payload;
    try {
        const user = await User.find({ email: email }); // logic checking if user exists
        const match = await bcrypt.compare(password, user.password);
        if (match) {
            // logic returning a token for logging in
        } else {
            throw new Error("User does not exist");
        }
    } catch (err) {
        throw new Error("Error logging in User");
    }
};

const registerUser = async (payload) => {
    const { name, email, phoneNumber, details, password } = payload;
    // logic checking if passwords and username are not empty -- could be done in the routes folder
    // logic checking if user exists
    // logic checking if passwords match, ideally they would enter password twice
    encryptPassword(password);
    // Logic saving user
};

module.exports = { loginUser, registerUser };
