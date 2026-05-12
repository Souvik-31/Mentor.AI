const express = require('express');
const ProcessingService = require('../services/ProcessingService');
const Video = require('../models/Video');
const router = express.Router();

router.post('/process', async (req, res) => {
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
      return res.json(video);
    }

    // Process if not in DB
    const processedData = await ProcessingService.processVideo(videoId);
    
    // Save to DB
    video = await Video.create(processedData);
    
    res.json(video);
  } catch (error) {
    console.error('Video processing error:', error);
    res.status(500).json({ error: 'Failed to process video' });
  }
});

router.get('/:videoId', async (req, res) => {
  try {
    const video = await Video.findOne({ videoId: req.params.videoId });
    if (!video) return res.status(404).json({ error: 'Video not found' });
    res.json(video);
  } catch (error) {
    res.status(500).json({ error: 'Database error' });
  }
});

module.exports = router;
