const { LRUCache } = require('lru-cache');
const TranscriptService = require('./TranscriptService');
const AIService = require('./AIService');

class ProcessingService {
  constructor() {
    this.cache = new LRUCache({
      max: 100, // Store 100 processed videos
      ttl: 1000 * 60 * 60 * 24, // 24 hours
    });
    this.inFlight = new Map(); // For deduplication
  }

  async processVideo(videoId) {
    // 1. Check Cache
    if (this.cache.has(videoId)) {
      return this.cache.get(videoId);
    }

    // 2. Check In-Flight (Deduplication)
    if (this.inFlight.has(videoId)) {
      return this.inFlight.get(videoId);
    }

    // 3. Start Processing
    const processingPromise = (async () => {
      try {
        console.log(`Processing video: ${videoId}`);
        const transcript = await TranscriptService.getTranscript(videoId);
        const { summary, quiz } = await AIService.generateSummaryAndQuiz(transcript);
        
        // Fetch YouTube title and thumbnail via oEmbed
        let title = 'YouTube Video';
        let thumbnail = `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`;
        
        try {
          const response = await fetch(`https://www.youtube.com/oembed?url=https://www.youtube.com/watch?v=${videoId}&format=json`);
          if (response.ok) {
            const data = await response.json();
            title = data.title || title;
            thumbnail = data.thumbnail_url || thumbnail;
          }
        } catch (metaErr) {
          console.warn('⚠️ oEmbed fetch failed, using fallback metadata:', metaErr.message);
        }

        const result = {
          videoId,
          title,
          thumbnail,
          transcript,
          summary,
          quiz,
          processedAt: new Date(),
        };

        this.cache.set(videoId, result);
        return result;
      } catch (error) {
        throw error;
      } finally {
        this.inFlight.delete(videoId);
      }
    })();

    this.inFlight.set(videoId, processingPromise);
    return processingPromise;
  }
}

module.exports = new ProcessingService();
