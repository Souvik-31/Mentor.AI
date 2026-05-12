const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  googleId: String,
  displayName: String,
  email: { type: String, unique: true, sparse: true },
  password: { type: String, select: false },
  avatar: String,
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('User', userSchema);
