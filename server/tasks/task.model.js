const mongoose = require("mongoose");

const taskSchema = mongoose.Schema({
    title: {type: String},
    dueDate: {type: Date},
    status: { type: String, enum: ['todo', 'in_progress', 'done'], default: 'todo' },
    board: { type: mongoose.Schema.Types.ObjectId, ref: 'Board' },
    description: { type: String },
    points: { type: Number },
});

const Task = mongoose.model('Task', taskSchema);
module.exports = Task;