const mongoose = require('mongoose');

const videoSchema = new mongoose.Schema({
  videoId: { type: String, required: true, unique: true },
  title: String,
  thumbnail: String,
  transcript: String,
  summary: String,
  quiz: [{
    question: String,
    options: [String],
    correctAnswer: String
  }],
  chunks: [{
    text: String,
    embedding: [Number]
  }],
  processedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Video', videoSchema);
