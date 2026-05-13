import sys
import json
from youtube_transcript_api import YouTubeTranscriptApi

def get_transcript(video_id):
    try:
        # Based on my research, the local version requires instantiation
        # and returns objects instead of dictionaries.
        api = YouTubeTranscriptApi()
        transcript_list = api.list(video_id)
        
        # Try to find an English transcript
        try:
            transcript = transcript_list.find_transcript(['en'])
        except:
            # If English not found, just take the first one available
            # This is safer than specific language list
            transcript = next(iter(transcript_list))
            
        data = transcript.fetch()
        
        # The objects in 'data' are 'FetchedTranscriptSnippet' and not subscriptable.
        # We must access the '.text' attribute.
        full_text = " ".join([snippet.text for snippet in data])
        
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
