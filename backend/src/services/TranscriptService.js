const { YoutubeTranscript } = require('youtube-transcript');

class TranscriptService {
  async getTranscript(videoId) {
    try {
      // Fetch transcript segments from YouTube
      const segments = await YoutubeTranscript.fetchTranscript(videoId, { lang: 'en' }).catch(() =>
        // Fallback: fetch without language preference if English not found
        YoutubeTranscript.fetchTranscript(videoId)
      );

      if (!segments || segments.length === 0) {
        throw new Error('No transcript available for this video.');
      }

      // Join all text segments into a single string
      const fullText = segments.map(s => s.text).join(' ');
      return fullText;
    } catch (err) {
      console.error('TranscriptService error:', err.message);
      throw new Error(`Failed to fetch transcript: ${err.message}`);
    }
  }
}

module.exports = new TranscriptService();
