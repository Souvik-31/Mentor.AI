/**
 * TranscriptService - Fetches YouTube video transcripts server-side.
 *
 * Strategy:
 * 1. Fetch the YouTube watch page HTML with browser-like headers.
 * 2. Directly extract timedtext caption URLs from the raw HTML
 *    (avoids trying to parse the massive ytInitialPlayerResponse JSON).
 * 3. Fetch the JSON3-format caption file from that URL.
 * 4. Flatten all text segments into a single transcript string.
 */

class TranscriptService {
  async getTranscript(videoId) {
    const watchUrl = `https://www.youtube.com/watch?v=${videoId}`;

    // Mimic a real browser to avoid bot detection
    const headers = {
      'User-Agent':
        'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/125.0.0.0 Safari/537.36',
      'Accept-Language': 'en-US,en;q=0.9',
      Accept: 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
    };

    // Step 1: Fetch the YouTube watch page
    const pageRes = await fetch(watchUrl, { headers });
    if (!pageRes.ok) {
      throw new Error(`Failed to load YouTube page: HTTP ${pageRes.status}`);
    }
    const html = await pageRes.text();

    // Step 2: Extract all timedtext caption URLs directly from the HTML.
    // YouTube embeds these as "baseUrl":"https://www.youtube.com/api/timedtext?..."
    // inside the serialized ytInitialPlayerResponse JavaScript variable.
    const captionUrlRegex =
      /"baseUrl"\s*:\s*"(https:\\?\/\\?\/www\.youtube\.com\\?\/api\\?\/timedtext[^"]+)"/g;

    const captionUrls = [];
    let match;
    while ((match = captionUrlRegex.exec(html)) !== null) {
      // Unescape unicode sequences and JSON-escaped slashes
      const rawUrl = match[1]
        .replace(/\\u0026/g, '&')
        .replace(/\\u003d/gi, '=')
        .replace(/\\\//g, '/')
        .replace(/\\"/g, '"');
      captionUrls.push(rawUrl);
    }

    if (captionUrls.length === 0) {
      // Try alternate format used in some regions
      const altMatch = html.match(/"captionTracks"/);
      if (!altMatch) {
        throw new Error(
          'No captions/transcript available for this video. Please try a video that has captions enabled.'
        );
      }
      throw new Error(
        'Could not extract caption URLs. The video may have restricted captions.'
      );
    }

    // Step 3: Prefer English track; fall back to first available
    const preferredUrl =
      captionUrls.find(u => u.includes('lang=en') || u.includes('lang%3Den')) ||
      captionUrls[0];

    // Append JSON3 format for easy parsing
    const separator = preferredUrl.includes('?') ? '&' : '?';
    const transcriptUrl = `${preferredUrl}${separator}fmt=json3`;

    // Step 4: Fetch the caption JSON
    const transcriptRes = await fetch(transcriptUrl, { headers });
    if (!transcriptRes.ok) {
      throw new Error(`Failed to fetch transcript data: HTTP ${transcriptRes.status}`);
    }

    const transcriptJson = await transcriptRes.json();

    // Step 5: Flatten events → segments → utf8 text
    const events = transcriptJson?.events || [];
    const fullText = events
      .flatMap(event => event.segs || [])
      .map(seg => seg.utf8 || '')
      .filter(t => t.trim() !== '\n' && t.trim() !== '')
      .join(' ')
      .replace(/\s+/g, ' ')
      .trim();

    if (!fullText) {
      throw new Error('Transcript was empty after parsing. The video may not have usable captions.');
    }

    console.log(`[TranscriptService] Successfully fetched transcript for ${videoId} (${fullText.length} chars)`);
    return fullText;
  }
}

module.exports = new TranscriptService();
