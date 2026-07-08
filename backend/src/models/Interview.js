const mongoose = require('mongoose');

const interviewSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  role: { type: String, required: true }, // 'frontend', 'backend', 'fullstack', 'aiml'
  category: { type: String, default: 'General' }, // AI-categorized topic (e.g. 'React Hooks')
  question: { type: String, required: true },
  answer: { type: String, required: true },
  askedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Interview', interviewSchema);
