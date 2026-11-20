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

const { execFile } = require('child_process');
const path = require('path');

class TranscriptService {
  // Fallback to local Python youtube_transcript_api script
  fetchViaPython(videoId) {
    return new Promise((resolve, reject) => {
      const scriptPath = path.join(__dirname, '../../scripts/get_transcript.py');
      execFile('python', [scriptPath, videoId], { maxBuffer: 10 * 1024 * 1024 }, (error, stdout) => {
        if (error) return reject(error);
        try {
          const res = JSON.parse(stdout.trim());
          if (res.success && res.transcript) {
            resolve(res.transcript);
          } else {
            reject(new Error(res.error || 'Python transcript script failed'));
          }
        } catch (parseErr) {
          reject(parseErr);
        }
      });
    });
  }

  async getTranscript(videoId) {
    try {
      const host = 'www.youtube.com';
      const playerEndpoint = `https://${host}/youtubei/v1/player?prettyPrint=false`;

      const playerRes = await fetch(playerEndpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'User-Agent': 'com.google.android.youtube/19.09.37 (Linux; U; Android 11) gzip',
        },
        body: JSON.stringify({
          context: {
            client: {
              clientName: 'ANDROID',
              clientVersion: '19.09.37',
              androidSdkVersion: 30,
              hl: 'en',
              gl: 'US',
            },
          },
          videoId,
        }),
      });

      if (!playerRes.ok) {
        throw new Error(`Player HTTP ${playerRes.status}`);
      }

      const playerData = await playerRes.json();
      const tracks = playerData?.captions?.playerCaptionsTracklistRenderer?.captionTracks;

      if (!tracks || tracks.length === 0) {
        throw new Error('No caption tracks returned from InnerTube');
      }

      const track = tracks.find(t => t.languageCode === 'en' || t.languageCode?.startsWith('en')) || tracks[0];
      const transcriptUrl = `${track.baseUrl}&fmt=json3`;

      const transcriptRes = await fetch(transcriptUrl, {
        headers: {
          'User-Agent': 'com.google.android.youtube/19.09.37 (Linux; U; Android 11) gzip',
        },
      });

      const rawBody = await transcriptRes.text();
      if (!rawBody) {
        throw new Error('Empty transcript response body');
      }

      const transcriptJson = JSON.parse(rawBody);
      const events = transcriptJson?.events || [];
      const fullText = events
        .flatMap(event => event.segs || [])
        .map(seg => seg.utf8 || '')
        .filter(t => t.trim() !== '\n' && t.trim() !== '')
        .join(' ')
        .replace(/\s+/g, ' ')
        .trim();

      if (!fullText) {
        throw new Error('Transcript empty after parsing');
      }

      console.log(`[TranscriptService] Fetched transcript for ${videoId} (${fullText.length} chars)`);
      return fullText;
    } catch (innerTubeErr) {
      console.warn(`[TranscriptService] InnerTube failed (${innerTubeErr.message}), trying Python fallback...`);
      return await this.fetchViaPython(videoId);
    }
  }
}

module.exports = new TranscriptService();