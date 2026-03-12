import base64
import json
import re
from google.cloud import texttospeech

# Initialize the async client so we don't block the FastAPI server
client = texttospeech.TextToSpeechAsyncClient()

async def stream_tts_and_visemes(text: str):
    """
    Chunks the text by sentences, generates audio and timepoints, 
    and yields them as they are ready to simulate real-time streaming.
    """
    # Split the AI response into sentences
    sentences = re.split(r'(?<=[.!?]) +', text)
    
    for sentence_index, sentence in enumerate(sentences):
        if not sentence.strip():
            continue
            
        # 1. Build the SSML with Word Marks
        words = sentence.split()
        ssml = "<speak>"
        for i, word in enumerate(words):
            # We insert a <mark> tag right before every word to generate a viseme
            ssml += f'<mark name="w_{sentence_index}_{i}"/>{word} '
        ssml += "</speak>"

        # 2. Configure the Google API Request
        synthesis_input = texttospeech.SynthesisInput(ssml=ssml)
        
        # Using a South African English voice for localization
        voice = texttospeech.VoiceSelectionParams(
            language_code="en-ZA",
            name="en-ZA-Standard-A" 
        )
        
        audio_config = texttospeech.AudioConfig(
            audio_encoding=texttospeech.AudioEncoding.MP3
        )

        # 3. Explicitly request the timepoints for the SSML marks
        request = texttospeech.SynthesizeSpeechRequest(
            input=synthesis_input,
            voice=voice,
            audio_config=audio_config,
            enable_time_pointing=[texttospeech.SynthesizeSpeechRequest.TimepointType.SSML_MARK]
        )

        # 4. Await the response from Google
        response = await client.synthesize_speech(request=request)

        # 5. Extract and format the viseme timepoints
        timepoints = [
            {"mark": tp.mark_name, "time_seconds": tp.time_seconds}
            for tp in response.timepoints
        ]

        # 6. Yield a JSON package containing both the Base64 audio and timepoints
        payload = {
            "type": "audio_chunk",
            "audio_base64": base64.b64encode(response.audio_content).decode("utf-8"),
            "timepoints": timepoints,
            "is_final": (sentence_index == len(sentences) - 1)
        }
        
        yield json.dumps(payload)