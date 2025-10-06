const mongoose = require("mongoose");

const conneceDB = async()=>{
    try {
        await mongoose.connect(process.env.MONGO_URI)
        console.log("MongoDB connected successfully");
    } catch (error) {
        console.log("mongodb connection failed :", error.message)
        process.exit(1);
    }
}

module.exports = conneceDB;