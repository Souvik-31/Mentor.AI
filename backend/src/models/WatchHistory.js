const mongoose = require('mongoose');

const watchHistorySchema = new mongoose.Schema({
  user: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', 
    required: true 
  },
  videoId: { 
    type: String, 
    required: true 
  },
  title: {
    type: String,
    default: 'YouTube Video'
  },
  thumbnail: {
    type: String
  },
  watchedAt: { 
    type: Date, 
    default: Date.now 
  }
});

// Ensure a user only has one entry per video (updates the timestamp instead of duplicate entries)
watchHistorySchema.index({ user: 1, videoId: 1 }, { unique: true });

module.exports = mongoose.model('WatchHistory', watchHistorySchema);
