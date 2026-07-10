const express = require('express');
const ProcessingService = require('../services/ProcessingService');
const Video = require('../models/Video');
const WatchHistory = require('../models/WatchHistory');
const authenticateJWT = require('../middleware/auth');
const router = express.Router();

// Helper to log video watch history for the user
const logWatchHistory = async (userId, video) => {
  const videoId = video.videoId;
  let title = video.title || 'YouTube Video';
  let thumbnail = video.thumbnail || `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`;

  // If the video has an empty or default title, attempt to repair it using oEmbed
  if (!video.title || video.title === 'YouTube Video') {
    try {
      const response = await fetch(`https://www.youtube.com/oembed?url=https://www.youtube.com/watch?v=${videoId}&format=json`);
      if (response.ok) {
        const data = await response.json();
        title = data.title || title;
        thumbnail = data.thumbnail_url || thumbnail;
        
        // Save the metadata back to the shared Video cache in DB
        video.title = title;
        video.thumbnail = thumbnail;
        await video.save();
      }
    } catch (err) {
      console.warn('⚠️ Watch history logger failed to fetch oEmbed metadata:', err.message);
    }
  }

  try {
    await WatchHistory.findOneAndUpdate(
      { user: userId, videoId },
      { title, thumbnail, watchedAt: new Date() },
      { upsert: true, new: true }
    );
  } catch (err) {
    console.error('Failed to save watch history entry:', err.message);
  }
};

// Route: Get current user's watchlist history (sorted by recents)
router.get('/watchlist', authenticateJWT, async (req, res) => {
  try {
    const list = await WatchHistory.find({ user: req.user._id })
      .sort({ watchedAt: -1 });
    res.json(list);
  } catch (error) {
    console.error('Fetch watchlist error:', error);
    res.status(500).json({ error: 'Failed to fetch watchlist' });
  }
});

// Route: Delete a video from the user's watchlist
router.delete('/watchlist/:videoId', authenticateJWT, async (req, res) => {
  try {
    await WatchHistory.deleteOne({ user: req.user._id, videoId: req.params.videoId });
    res.json({ success: true, message: 'Removed from watchlist' });
  } catch (error) {
    console.error('Delete from watchlist error:', error);
    res.status(500).json({ error: 'Failed to remove video from watchlist' });
  }
});

// Route: Process and log a video
router.post('/process', authenticateJWT, async (req, res) => {
  const { videoUrl } = req.body;
  if (!videoUrl) return res.status(400).json({ error: 'Video URL is required' });

  // Extract video ID from URL
  const videoIdMatch = videoUrl.match(/(?:https?:\/\/)?(?:www\.)?(?:youtube\.com\/watch\?v=|youtu\.be\/)([a-zA-Z0-9_-]{11})/);
  if (!videoIdMatch) return res.status(400).json({ error: 'Invalid YouTube URL' });
  const videoId = videoIdMatch[1];

  try {
    // Check DB first
    let video = await Video.findOne({ videoId });
    if (video) {
      await logWatchHistory(req.user._id, video);
      return res.json(video);
    }

    // Process if not in DB
    const processedData = await ProcessingService.processVideo(videoId);
    
    // Save to DB
    video = await Video.create(processedData);
    
    // Log to user watchlist
    await logWatchHistory(req.user._id, video);
    
    res.json(video);
  } catch (error) {
    console.error('Video processing error:', error);
    res.status(500).json({
      error: 'Failed to process video',
      // Include actual error message to help with debugging on deployed services
      details: error.message || 'Unknown error'
    });
  }
});

// Route: Get single video and log watch history
router.get('/:videoId', authenticateJWT, async (req, res) => {
  try {
    const video = await Video.findOne({ videoId: req.params.videoId });
    if (!video) return res.status(404).json({ error: 'Video not found' });
    
    // Log this view event to watch history
    await logWatchHistory(req.user._id, video);
    
    res.json(video);
  } catch (error) {
    console.error('Fetch video error:', error);
    res.status(500).json({ error: 'Database error' });
  }
});

module.exports = router;
