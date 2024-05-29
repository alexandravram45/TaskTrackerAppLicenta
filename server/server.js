const express = require("express");
const app = express();
require('dotenv/config');
const { authenticate } = require('./middleware/auth.js');
const cors = require("cors");
const cookieParser = require('cookie-parser');
const mongoose = require("mongoose");
const path = require('path');

const taskRoutes = require('./tasks/route');
const userRoutes = require('./user/route');
const boardRoutes = require('./boards/route.js');
const columnroutes = require('./columns/route.js');
const commentRoutes = require('./comments/route.js');
const tokenRoutes = require('./token/route.js');

app.use(cors({
    origin: process.env.CLIENT_URL,
    credentials: true,
  }));

app.use(cookieParser());
app.use(express.json());

const db = process.env.DB_URI
const port = process.env.PORT

mongoose.connect(db)
    .then(() => {
        console.log('Connected to MongoDB');
    })
    .catch((error) => {
        console.error('Error connecting to MongoDB:', error);
    });

app.use('/user', userRoutes)
app.use('/tasks', taskRoutes)
app.use('/board', boardRoutes)
app.use('/column', columnroutes)
app.use('/token', tokenRoutes)
app.use('/comment', commentRoutes)
app.get('/profile', authenticate, (req, res) => {
    res.json({ 
        message: `Welcome ${req.user.username}`,
        user: req.user,
        username: req.user.username
    });
})

app.use('/images', express.static(path.join(__dirname, '../src/images')));  

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
