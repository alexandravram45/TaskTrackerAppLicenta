const express = require("express");
const app = express();
const cors = require("cors");
app.use(cors());
app.use(express.json());
const PORT = 5000;
const taskRoute = require('./tasks/route');

const Task = require('./tasks/task.model')

const mongoose = require("mongoose");

const Db = "mongodb+srv://alexandravram:03042001Ale@tasktrackercluster.wal4azi.mongodb.net/?retryWrites=true&w=majority";

mongoose.connect(Db)
    .then(() => {
        console.log('Connected to MongoDB');
    })
    .catch((error) => {
        console.error('Error connecting to MongoDB:', error);
    });


app.use('/tasks', taskRoute)

app.get('/', (req, res) => {
    res.send("hello there!")
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});