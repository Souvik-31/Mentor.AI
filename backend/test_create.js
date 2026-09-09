require('dotenv').config();
const mongoose = require('mongoose');
const User = require('./src/models/User');

mongoose.connect(process.env.MONGODB_URI).then(async () => {
  try {
    // Delete existing
    await User.deleteOne({ email: 'student2@mentor.ai' });
    
    console.log('Creating user...');
    const user = await User.create({
      email: 'student2@mentor.ai',
      password: 'password'
    });
    console.log('User created. Password in memory:', user.password);
    
    // Fetch from DB
    const fetched = await User.findOne({ email: 'student2@mentor.ai' }).select('+password');
    console.log('Password in DB:', fetched.password);
    
  } catch(e) {
    console.error(e);
  } finally {
    mongoose.disconnect();
  }
});
