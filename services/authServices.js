const User = require("../models/User");


////// File currently not in use. CONSIDER DELETING
const loginUser = async (payload) => {
    
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
