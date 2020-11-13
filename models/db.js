const mongoose = require("mongoose");

const options = {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    // useCreateIndex: true,
    // useFindAndModify: false,
    // autoIndex: false, // Don't build indexes
    // poolSize: 10, // Maintain up to 10 socket connections
    // serverSelectionTimeoutMS: 5000, // Keep trying to send operations for 5 seconds
    // socketTimeoutMS: 45000, // Close sockets after 45 seconds of inactivity
    // family: 4 // Use IPv4, skip trying IPv6
};

const connectDB = async () => {
    try {
        const conn = await mongoose.connect(process.env.MONGO_URL, options);
        console.log("MongoDB connected: ", conn.connection.host);
    } catch (err) {
        console.log(err);
    }
};


module.exports = connectDB;
