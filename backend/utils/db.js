const mongoose = require("mongoose");

const connectDb = async () => {
  try {
    await mongoose.connect(process.env.DB_URI);
    console.log("MongoDB connected successfully hey");
  } catch (err) {
    console.error(" MongoDB connection failed", err);
    throw err;
  }
};
module.exports = connectDb;