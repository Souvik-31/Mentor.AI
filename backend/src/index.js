require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser');
const passport = require('./config/passport');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const RedisService = require('./services/RedisService');

const authRoutes = require('./routes/auth');
const videoRoutes = require('./routes/video');
const semprepRoutes = require('./routes/semprep');
const chatRoutes = require('./routes/chat');
const interviewRoutes = require('./routes/interview');

const app = express();
const PORT = process.env.PORT || 5000;

// Connect to MongoDB & Initialize Redis
mongoose.connect(process.env.MONGODB_URI)
  .then(() => {
    console.log('Connected to MongoDB');
    // Connect to Redis (or fallback to cache)
    return RedisService.connect();
  })
  .catch(err => console.error('Database/Redis Initialization Error:', err));

// Middleware
app.use(helmet());
app.use(morgan('dev'));
app.use(cors({
  origin: process.env.CLIENT_URL,
  credentials: true
}));
app.use(express.json());
app.use(cookieParser());
app.use(passport.initialize());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/videos', videoRoutes);
app.use('/api/semprep', semprepRoutes);
app.use('/api/chat', chatRoutes);
app.use('/api/interview', interviewRoutes);

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
