import os
import uuid
from google.cloud import texttospeech
from app.core.config import settings

# Ensure the system knows where the Google key is located using your settings
os.environ["GOOGLE_APPLICATION_CREDENTIALS"] = settings.GOOGLE_APPLICATION_CREDENTIALS

# 1. Directory Setup
AUDIO_DIR = os.path.join("static", "audio")
os.makedirs(AUDIO_DIR, exist_ok=True)

# 2. Voice Mapping based on your available languages
VOICE_MAPPING = {
    "english": "en-GB-Standard-A", 
    "afrikaans": "af-ZA-Standard-A",
    "swahili": "sw-KE-Chirp3-HD-Achernar",
    "zulu": "en-GB-Standard-A", # Fallback to British English
    "northern sotho": "en-GB-Standard-A" # Fallback to British English
}

async def generate_and_save_tts(text: str, language: str = "english"):
    """
    Synthesizes speech, saves it locally, and returns the URL.
    """
    client = texttospeech.TextToSpeechClient()
    
    # Clean text to prevent parsing errors
    clean_text = text.replace("&", "and").replace("<", "").replace(">", "")
    synthesis_input = texttospeech.SynthesisInput(text=clean_text)

    # Determine the correct voice code using British English as the ultimate fallback
    voice_code = VOICE_MAPPING.get(language.lower(), "en-GB-Standard-A")
    
    voice = texttospeech.VoiceSelectionParams(
        language_code=voice_code[:5],
        name=voice_code
    )

    audio_config = texttospeech.AudioConfig(
        audio_encoding=texttospeech.AudioEncoding.MP3
    )

    try:
        # Standard request to ensure maximum library compatibility
        response = client.synthesize_speech(
            request={
                "input": synthesis_input,
                "voice": voice,
                "audio_config": audio_config
            }
        )

        # Generate a unique filename and path
        filename = f"afya_{uuid.uuid4().hex}.mp3"
        filepath = os.path.join(AUDIO_DIR, filename)

        # Save the audio content to disk
        with open(filepath, "wb") as out:
            out.write(response.audio_content)
        
        print(f"DEBUG: Audio saved successfully: {filename}")

        # Static viseme array to satisfy the Pydantic schema without crashing
        visemes = [{"markName": "start", "timeSeconds": 0.0}]

        return f"/audio/{filename}", visemes

    except Exception as e:
        print(f"TTS FAILURE: {e}")
        return "", []