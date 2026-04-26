const mongoose = require("mongoose");
require("dotenv").config();

if (process.env.NODE_ENV !== 'production') {
  const dns = require('dns');
  dns.setServers(['8.8.8.8', '8.8.4.4']);
}

const mongoUri = process.env.MONGODB_URI;

let isConnected = false; // ✅ cache the connection

const initialiseDatabase = async () => {
  if (isConnected) {
    console.log("Using existing DB connection");
    return;
  }

  try {
    await mongoose.connect(mongoUri, {
      serverSelectionTimeoutMS: 10000,
    });
    isConnected = true;
    console.log("Connected to DataBase");
  } catch (error) {
    console.log("Error connecting to database", error);
    throw error; // ✅ throw so routes can catch it
  }
};

module.exports = { initialiseDatabase };