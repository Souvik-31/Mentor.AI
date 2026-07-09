const express = require('express');
const multer = require('multer');
const AIService = require('../services/AIService');
const SemPrep = require('../models/SemPrep');
const authenticateJWT = require('../middleware/auth');
const router = express.Router();

const storage = multer.memoryStorage();
const upload = multer({ 
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB limit
});

router.post('/generate', authenticateJWT, upload.array('files'), async (req, res) => {
  try {
    const { title } = req.body;
    const files = req.files;

    if (!title || !files || files.length === 0) {
      return res.status(400).json({ error: 'Title and files are required' });
    }

    const generatedPaper = await AIService.generateSemPrep(files, title);

    const semPrep = new SemPrep({
      user: req.user._id,
      title,
      generatedPaper,
    });

    await semPrep.save();

    res.json(semPrep);
  } catch (error) {
    console.error('SemPrep Route Error:', error);
    res.status(500).json({ error: error.message });
  }
});

router.get('/history', authenticateJWT, async (req, res) => {
  try {
    const history = await SemPrep.find({ user: req.user._id })
      .sort({ createdAt: -1 });
    res.json(history);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get('/:id', authenticateJWT, async (req, res) => {
  try {
    const semPrep = await SemPrep.findOne({ _id: req.params.id, user: req.user._id });
    if (!semPrep) return res.status(404).json({ error: 'Not found' });
    res.json(semPrep);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
