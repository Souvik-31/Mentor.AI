const express = require('express');
const RAGService = require('../services/RAGService');
const authenticateJWT = require('../middleware/auth');
const router = express.Router();

router.post('/:videoId', authenticateJWT, async (req, res) => {
  const { videoId } = req.params;
  const { question, history } = req.body;

  if (!question) {
    return res.status(400).json({ error: 'Question is required' });
  }

  try {
    const result = await RAGService.answerQuestion(videoId, question, history || []);
    res.json(result);
  } catch (error) {
    console.error('Chat RAG Error:', error);
    res.status(500).json({ error: error.message || 'Failed to generate response' });
  }
});

module.exports = router;
