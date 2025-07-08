const express = require('express');
require('dotenv').config();
const connectDB = require('./config/database.js');
const authRouter = require('./routes/auth.js');
const cookieParser = require('cookie-parser');
const taskRouter = require('./routes/task.js');
const cors = require('cors');
const userRouter = require('./routes/user.js');

PORT = process.env.PORT;

const app = express();
app.use(cors({
  origin: 'http://localhost:4500',
  credentials: true,
}));
app.use(express.json());
app.use(cookieParser());

app.use('/auth', authRouter);
app.use('/task', taskRouter);
app.use('/user', userRouter);

connectDB().then(() => {
    app.listen(8080, () => {
        console.log(`App is listening on port ${PORT}`);
    })
}).catch((err) => {
    console.log('MongoDB connection error:', err);
});