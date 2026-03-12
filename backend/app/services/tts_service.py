import base64
import json
import re
from google.cloud import texttospeech_v1beta1 as texttospeech

async def stream_tts_and_visemes(text: str):
    """
    Chunks the text by sentences, generates audio and timepoints, 
    and yields them as they are ready to simulate real-time streaming.
    """
    client = texttospeech.TextToSpeechAsyncClient()
    
    sentences = re.split(r'(?<=[.!?]) +', text)
    
    for sentence_index, sentence in enumerate(sentences):
        if not sentence.strip():
            continue
            
        words = sentence.split()
        ssml = "<speak>"
        for i, word in enumerate(words):
            ssml += f'<mark name="w_{sentence_index}_{i}"/>{word} '
        ssml += "</speak>"

        synthesis_input = texttospeech.SynthesisInput(ssml=ssml)
        
        voice = texttospeech.VoiceSelectionParams(
            language_code="en-GB",
            name="en-GB-Neural2-A" 
        )
        
        audio_config = texttospeech.AudioConfig(
            audio_encoding=texttospeech.AudioEncoding.MP3
        )

        request = texttospeech.SynthesizeSpeechRequest(
            input=synthesis_input,
            voice=voice,
            audio_config=audio_config,
            enable_time_pointing=[texttospeech.SynthesizeSpeechRequest.TimepointType.SSML_MARK]
        )

        response = await client.synthesize_speech(request=request)

        timepoints = [
            {"mark": tp.mark_name, "time_seconds": tp.time_seconds}
            for tp in response.timepoints
        ]

        payload = {
            "type": "audio_chunk",
            "audio_base64": base64.b64encode(response.audio_content).decode("utf-8"),
            "timepoints": timepoints,
            "is_final": (sentence_index == len(sentences) - 1)
        }
        
        yield json.dumps(payload)