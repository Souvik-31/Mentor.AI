const mongoose = require('mongoose');

const SemPrepSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  title: {
    type: String,
    required: true
  },
  syllabusText: String,
  pyqTexts: [String],
  generatedPaper: {
    sections: [{
      title: String,
      questions: [{
        question: String,
        marks: Number,
        topic: String
      }]
    }]
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('SemPrep', SemPrepSchema);
