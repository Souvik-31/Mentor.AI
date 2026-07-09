const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const LocalStrategy = require('passport-local').Strategy;
const User = require('../models/User');

// Passport setup (sessions disabled, JWT-based auth used instead)

// Google Strategy
passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: "/api/auth/google/callback"
  },
  async (accessToken, refreshToken, profile, done) => {
    try {
      const email = profile.emails?.[0]?.value;
      
      // 1. Search by Google ID first
      let user = await User.findOne({ googleId: profile.id });
      
      if (!user && email) {
        // 2. Search by email to see if they registered locally
        user = await User.findOne({ email });
        if (user) {
          // Link Google ID to existing account
          user.googleId = profile.id;
          if (!user.avatar && profile.photos?.[0]?.value) {
            user.avatar = profile.photos[0].value;
          }
          await user.save();
        }
      }
      
      // 3. Create a new user if neither exists
      if (!user) {
        user = await User.create({
          googleId: profile.id,
          displayName: profile.displayName,
          email: email || undefined,
          avatar: profile.photos?.[0]?.value || `https://api.dicebear.com/7.x/adventurer/svg?seed=${encodeURIComponent(profile.displayName || 'User')}`
        });
      }
      
      return done(null, user);
    } catch (err) {
      return done(err, null);
    }
  }
));

// Local Strategy
passport.use(new LocalStrategy({ usernameField: 'email' },
  async (email, password, done) => {
    try {
      const user = await User.findOne({ email }).select('+password');
      if (!user) return done(null, false, { message: 'Incorrect email.' });
      
      // Use the comparePassword method to compare hashed passwords
      const isMatch = await user.comparePassword(password);
      if (!isMatch) return done(null, false, { message: 'Incorrect password.' });
      
      return done(null, user);
    } catch (err) {
      return done(err);
    }
  }
));

module.exports = passport;
