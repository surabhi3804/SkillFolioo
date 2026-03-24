// backend/models/CustomRole.js
const mongoose = require('mongoose');

const CustomRoleSchema = new mongoose.Schema({
  user:  { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  label: { type: String, required: true, trim: true },
  jd:    { type: String, default: '' },
}, { timestamps: true });

module.exports = mongoose.model('CustomRole', CustomRoleSchema);