const mongoose = require('mongoose');

const refreshTokenSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  tokenId: {
    type: String,
    required: true
  },
  expiresAt: {
    type: Date,
    required: true
  }
});

// TTL index to automatically delete documents after their expiresAt date
refreshTokenSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });
refreshTokenSchema.index({ userId: 1, tokenId: 1 }, { unique: true });

module.exports = mongoose.model('RefreshToken', refreshTokenSchema);
