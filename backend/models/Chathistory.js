// backend/models/ChatHistory.js
const mongoose = require('mongoose');

const ChatHistorySchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  original:  { type: String, required: true },
  enhanced:  { type: String, required: true },
  context:   { type: String, default: 'Experience' },
  tone:      { type: String, default: 'Professional' },
  domain:    { type: String, default: 'general' },
  metric_tip:{ type: String, default: '' },
  message: String,
  response: String,
}, { timestamps: true });

module.exports = mongoose.model('ChatHistory', ChatHistorySchema);