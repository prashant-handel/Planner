const express = require('express');
require('dotenv').config();
const connectDB = require('./config/database.js');
const authRouter = require('./routes/auth.js');
const cookieParser = require('cookie-parser');
const taskRouter = require('./routes/task.js');

PORT = process.env.PORT;

const app = express();
app.use(express.json());
app.use(cookieParser());

app.use('/auth', authRouter);
app.use('/task', taskRouter);

connectDB().then(() => {
    app.listen(8080, () => {
        console.log(`App is listening on port ${PORT}`);
    })
}).catch((err) => {
    console.log('MongoDB connection error:', err);
});