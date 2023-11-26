const mongoose = require('mongoose');

const boardSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  name: { type: String, required: true },
  privacy: { type: String, enum: ['public', 'private', 'invite-only'], required: true },
});

const Board = mongoose.model('Board', boardSchema);

module.exports = Board;