const mongoose = require('mongoose');

const boardSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  name: { type: String, required: true },
  columns: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Column' }],
  tasks: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Task'}],
  color: { type : String },
  createdAt: { type: Date },
  favorite: { type: Boolean },
  members: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }]
});

const Board = mongoose.model('Board', boardSchema);

module.exports = Board;