const express = require("express");
const app = express();
require('dotenv/config');
const { authenticate } = require('./middleware/auth.js');
const cors = require("cors");
const cookieParser = require('cookie-parser');
const mongoose = require("mongoose");
const { confirmEmail } = require('./user/controller.js')

const taskRoutes = require('./tasks/route');
const userRoutes = require('./user/route');
const boardRoutes = require('./boards/route.js');
const columnroutes = require('./columns/route.js');
const commentRoutes = require('./comments/route.js');
const tokenRoutes = require('./token/route.js');

app.use(cors({
    origin: 'http://localhost:3000',  // Replace with the actual origin of your client application
    credentials: true,
  }));

app.use(cookieParser());
app.use(express.json());

app.use(cookieParser());

const db = process.env.DB_URI
const port = process.env.PORT

mongoose.connect(db)
    .then(() => {
        console.log('Connected to MongoDB');
    })
    .catch((error) => {
        console.error('Error connecting to MongoDB:', error);
    });


app.use('/tasks', taskRoutes)
app.use('/user', userRoutes)
app.use('/board', boardRoutes)
app.use('/column', columnroutes)
app.use('/token', tokenRoutes)
app.use('/comment', commentRoutes)

app.get('/profile', authenticate, (req, res) => {
    console.log(req.user)
    res.status(200).json({ 
        message: `Welcome ${req.user.username}`,
        user: req.user
    });
  });

// app.get('users/:id/verify/:token', confirmEmail, (req, res) => {
//     res.json({
//       message: "Email verified",
//       token: req.params.token,
//       id: req.params.id
//     })
//   })
  
app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
