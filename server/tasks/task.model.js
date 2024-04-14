const mongoose = require("mongoose");

const taskSchema = mongoose.Schema({
    title: {type: String},
    dueDate: {type: Date},
    columnId: { type: mongoose.Schema.Types.ObjectId, ref: 'Column' },
    description: { type: String },
    points: { type: Number },
    assignee: { type: mongoose.Schema.Types.ObjectId, ref: 'User'},
});

const Task = mongoose.model('Task', taskSchema);
module.exports = Task;