require('dotenv').config();
const mongoose = require('mongoose');
const User = require('./src/models/User');
const passportConfig = require('./src/config/passport'); // this will load the strategy

mongoose.connect(process.env.MONGODB_URI).then(async () => {
  try {
    // The google strategy is registered in passport.
    // We can extract the verify function from it.
    const strategy = passportConfig._strategies['google'];
    if (!strategy) throw new Error('Google strategy not found');
    
    const verifyFn = strategy._verify;
    
    const profile = {
      id: 'mock_google_id_123',
      displayName: 'Mock User',
      emails: [{ value: 'mock@example.com' }],
      photos: [{ value: 'mock_photo_url' }]
    };
    
    console.log('Calling verify callback...');
    verifyFn('mock_access_token', 'mock_refresh_token', profile, (err, user, info) => {
      console.log('Result:', { err, user, info });
      mongoose.disconnect();
    });
    
  } catch(e) {
    console.error('Error:', e);
    mongoose.disconnect();
  }
});
