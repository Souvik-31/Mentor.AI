require('dotenv').config();
const mongoose = require('mongoose');
const User = require('./src/models/User');

mongoose.connect(process.env.MONGODB_URI).then(async () => {
  try {
    const user = await User.findOne({ email: 'student@mentor.ai' }).select('+password');
    if (!user) {
      console.log('User NOT FOUND');
    } else {
      console.log('User found:', user.email);
      console.log('Has password field?', !!user.password);
      if (user.password) {
        console.log('Password hash:', user.password);
        const match = await user.comparePassword('password');
        console.log('Does password match "password"?', match);
      } else {
        console.log('User has NO password field (probably created via Google OAuth)');
      }
    }
  } catch(e) {
    console.error(e);
  } finally {
    mongoose.disconnect();
  }
});
