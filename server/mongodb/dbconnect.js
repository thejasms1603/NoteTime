require("dotenv").config();
const config = require("../config.json");

const mongoose = require("mongoose");

const connectToDatabase = async () => {
  try {
    const dbURL = config.connectionString;
    if (!dbURL) throw new Error("Database is not defined in ENV File");
    await mongoose.connect(dbURL);
    console.log("Successfully connected to the database");
  } catch (err) {
    console.log("Failed to connect to the database:", err.message);
    process.exit(1);
  }
};

module.exports = connectToDatabase;
