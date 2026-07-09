require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser');
const passport = require('./config/passport');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const authRoutes = require('./routes/auth');
const videoRoutes = require('./routes/video');
const semprepRoutes = require('./routes/semprep');
const chatRoutes = require('./routes/chat');
const interviewRoutes = require('./routes/interview');

const app = express();
app.set('trust proxy', 1);
const PORT = process.env.PORT || 5000;

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI)
  .then(() => {
    console.log('Connected to MongoDB');
  })
  .catch(err => console.error('Database Initialization Error:', err));

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
