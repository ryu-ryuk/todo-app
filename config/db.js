const mongoose = require('mongoose');
require('dotenv').config();

const connectDB = async () => {
  // Check if MONGO_URI is defined
  if (!process.env.MONGO_URI) {
    console.error('MONGO_URI is not defined in the environment variables');
    process.exit(1);
  }

  try {
    // Connect to MongoDB without deprecated options
    const conn = await mongoose.connect(process.env.MONGO_URI);
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (err) {
    console.error('MongoDB connection error:', err.message);
    process.exit(1);
  }
};

module.exports = connectDB;