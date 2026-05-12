import sys
import json
from youtube_transcript_api import YouTubeTranscriptApi

def get_transcript(video_id):
    try:
        transcript_list = YouTubeTranscriptApi.get_transcript(video_id)
        # Combine transcript text
        full_text = " ".join([t['text'] for t in transcript_list])
        return {"success": True, "transcript": full_text}
    except Exception as e:
        return {"success": False, "error": str(e)}

if __name__ == "__main__":
    if len(sys.argv) < 2:
        print(json.dumps({"success": False, "error": "No video ID provided"}))
        sys.exit(1)
    
    video_id = sys.argv[1]
    result = get_transcript(video_id)
    print(json.dumps(result))
