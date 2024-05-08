const mongoose = require("mongoose");

const commentSchema = mongoose.Schema({
    content: { type: String },
    taskId: { type: mongoose.Schema.Types.ObjectId, ref: 'Task'},
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User'},
    createdAt: { type: Date }
});

const Comment = mongoose.model('Comment', commentSchema);
module.exports = Comment