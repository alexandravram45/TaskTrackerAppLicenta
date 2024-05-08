const mongoose = require("mongoose");

const columnSchema = mongoose.Schema({
    title: { type: String },
    boardId: { type: mongoose.Schema.Types.ObjectId, ref: 'Board'},
    tasks: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Task' }],
    done: { type: Boolean },
});

const Column = mongoose.model('Column', columnSchema);
module.exports = Column