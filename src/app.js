const express = require('express');
const mongoose = require('mongoose');
require('dotenv').config();

PORT = process.env.PORT;
DB_PASSWORD = process.env.DB_PASSWORD;

const app = express();

const connectDB = async () => {
    await mongoose.connect(`mongodb+srv://prashanthandel2501:${DB_PASSWORD}@new-cluster.btwgta4.mongodb.net/plannerDB`);
}

connectDB().then(() => {
    app.listen(8080, () => {
        console.log(`App is listening on port ${PORT}`)
    })
}).catch((err) => {
    console.log('MongoDB connection error:', err);
});