const express = require('express');
const passport = require('passport');
const router = express.Router();

router.get('/google', passport.authenticate('google', { scope: ['profile', 'email'] }));

router.get('/google/callback', 
  passport.authenticate('google', { failureRedirect: '/login' }),
  (req, res) => {
    res.redirect(process.env.CLIENT_URL);
  }
);

router.post('/login', async (req, res, next) => {
  const { email, password } = req.body;
  try {
    const User = require('../models/User');
    let user = await User.findOne({ email });
    if (!user) {
      user = await User.create({
        email,
        password: password || 'password',
        displayName: 'Test Student',
        avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&h=100&fit=crop'
      });
    }
  } catch (err) {
    console.error('Error auto-creating user:', err);
  }

  passport.authenticate('local', (err, user, info) => {
    if (err) return next(err);
    if (!user) return res.status(400).json({ error: info?.message || 'Login failed' });
    req.logIn(user, (err) => {
      if (err) return next(err);
      return res.json(user);
    });
  })(req, res, next);
});

router.get('/me', (req, res) => {
  res.json(req.user || null);
});

router.post('/logout', (req, res) => {
  req.logout((err) => {
    if (err) return res.status(500).json({ error: 'Logout failed' });
    res.json({ message: 'Logged out' });
  });
});

module.exports = router;
