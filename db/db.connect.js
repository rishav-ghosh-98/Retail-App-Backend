const mongoose = require("mongoose")
require("dotenv").config()
const mongoUri = process.env.MONGODB
const initialiseDatabase = async() => {
    await mongoose
    .connect(mongoUri)
    .then(() => {
        console.log("Connected to DataBase")
    })
    .catch((error) => console.log("Error connecting to database", error))
}
module.exports = { initialiseDatabase }