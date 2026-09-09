require('dotenv').config();
const mongoose = require('mongoose');
const User = require('./src/models/User');

mongoose.connect(process.env.MONGODB_URI).then(async () => {
  try {
    await User.deleteOne({ email: 'google_test@example.com' });
    
    console.log('Creating google user...');
    const user = await User.create({
      googleId: '123456789',
      displayName: 'Google Test User',
      email: 'google_test@example.com',
      avatar: 'https://example.com/avatar.png'
    });
    console.log('Google user created successfully:', user.email);
    
  } catch(e) {
    console.error('Error creating google user:', e);
  } finally {
    mongoose.disconnect();
  }
});
