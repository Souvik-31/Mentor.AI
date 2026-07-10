/**
 * TranscriptService - Fetches YouTube video transcripts server-side.
 *
 * Strategy:
 * 1. Fetch the YouTube watch page HTML to extract the player response JSON.
 * 2. Pull the captionTracks array from it.
 * 3. Fetch the XML/JSON3 caption track from the baseUrl.
 * 4. Parse and return the full transcript text.
 *
 * This avoids third-party packages that are frequently rate-limited or
 * blocked by YouTube on cloud server IPs.
 */

class TranscriptService {
  async getTranscript(videoId) {
    const watchUrl = `https://www.youtube.com/watch?v=${videoId}`;

    // Mimic a real browser to avoid bot detection
    const headers = {
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/125.0.0.0 Safari/537.36',
      'Accept-Language': 'en-US,en;q=0.9',
      'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
    };

    // Step 1: Fetch the YouTube watch page
    const pageRes = await fetch(watchUrl, { headers });
    if (!pageRes.ok) {
      throw new Error(`Failed to load YouTube page: HTTP ${pageRes.status}`);
    }
    const html = await pageRes.text();

    // Step 2: Extract ytInitialPlayerResponse JSON from the page
    const playerResponseMatch = html.match(/ytInitialPlayerResponse\s*=\s*(\{.+?\})\s*;/s);
    if (!playerResponseMatch) {
      throw new Error('Could not find player response in YouTube page. The page structure may have changed.');
    }

    let playerResponse;
    try {
      playerResponse = JSON.parse(playerResponseMatch[1]);
    } catch (e) {
      throw new Error('Failed to parse YouTube player response JSON.');
    }

    // Step 3: Extract caption tracks
    const captionTracks = playerResponse?.captions?.playerCaptionsTracklistRenderer?.captionTracks;
    if (!captionTracks || captionTracks.length === 0) {
      throw new Error('No captions/transcript available for this video.');
    }

    // Prefer English, fall back to first available track
    const track =
      captionTracks.find(t => t.languageCode === 'en') ||
      captionTracks.find(t => t.languageCode?.startsWith('en')) ||
      captionTracks[0];

    if (!track?.baseUrl) {
      throw new Error('No valid caption track URL found.');
    }

    // Step 4: Fetch the transcript XML (json3 format for easy parsing)
    const transcriptUrl = `${track.baseUrl}&fmt=json3`;
    const transcriptRes = await fetch(transcriptUrl, { headers });
    if (!transcriptRes.ok) {
      throw new Error(`Failed to fetch transcript data: HTTP ${transcriptRes.status}`);
    }

    const transcriptJson = await transcriptRes.json();

    // Step 5: Flatten all events → segs → utf8 text into one string
    const events = transcriptJson?.events || [];
    const fullText = events
      .flatMap(event => event.segs || [])
      .map(seg => seg.utf8 || '')
      .join(' ')
      .replace(/\s+/g, ' ')
      .trim();

    if (!fullText) {
      throw new Error('Transcript was empty after parsing.');
    }

    return fullText;
  }
}

module.exports = new TranscriptService();
