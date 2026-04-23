const mongoose = require("mongoose");
require("dotenv").config();

if (process.env.NODE_ENV !== 'production') {
  const dns = require('dns');
  dns.setServers(['8.8.8.8', '8.8.4.4']);
}

const mongoUri = process.env.MONGODB_URI;

const initialiseDatabase = async () => {
  await mongoose
    .connect(mongoUri, {
      serverSelectionTimeoutMS: 10000,
    })
    .then(() => {
      console.log("Connected to DataBase");
    })
    .catch((error) => console.log("Error connecting to database", error));
};

module.exports = { initialiseDatabase };