require('dotenv').config();
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const RefreshToken = require('./src/models/RefreshToken');
const User = require('./src/models/User');

const generateTokens = async (user) => {
  const accessToken = jwt.sign(
    { userId: user._id, email: user.email },
    process.env.JWT_SECRET || 'fallback_secret_key',
    { expiresIn: '15m' }
  );

  const tokenId = crypto.randomBytes(16).toString('hex');
  const refreshToken = jwt.sign(
    { userId: user._id, tokenId },
    process.env.JWT_REFRESH_SECRET || 'fallback_refresh_secret_key',
    { expiresIn: '7d' }
  );

  const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
  await RefreshToken.create({ userId: user._id, tokenId, expiresAt });

  return { accessToken, refreshToken };
};

mongoose.connect(process.env.MONGODB_URI).then(async () => {
  try {
    const user = await User.findOne({});
    if (!user) throw new Error('No user to test with');
    console.log('Generating tokens for user:', user._id);
    const tokens = await generateTokens(user);
    console.log('Tokens generated successfully');
  } catch(e) {
    console.error('Error:', e);
  } finally {
    mongoose.disconnect();
  }
});
