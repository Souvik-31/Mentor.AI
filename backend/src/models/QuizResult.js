const mongoose = require('mongoose');

const quizResultSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  videoId: { type: String, required: true },
  score: { type: Number, required: true },
  totalQuestions: { type: Number, required: true },
  completedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('QuizResult', quizResultSchema);
