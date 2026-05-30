require("dotenv").config();
const mongoose = require('mongoose');

const MONGODB_URI = process.env.MONGODB_URI;

// database connection
async function connectDB() {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log("Connected to MongoDB");
  } catch (err) {
    console.error("Could not connect to MongoDB", err);
  }
}

module.exports = connectDB;