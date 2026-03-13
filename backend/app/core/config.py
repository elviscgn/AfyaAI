
import os
from dotenv import load_dotenv

load_dotenv() 

class Settings:
    """
    Configuration class for loading environment variables securely.
    """

    FEATHERLESS_API_KEY: str = os.getenv("FEATHERLESS_API_KEY", "dummy_featherless_key")
    LLAMA_CHAT_MODEL_FEATHERLESS: str = os.getenv("LLAMA_CHAT_MODEL_FEATHERLESS", "meta-llama/Llama-3.1-8B-Instruct")
    FEATHERLESS_API_URL: str = os.getenv("FEATHERLESS_API_URL", "https://api.featherless.ai/v1")

    
    LLAMA_API_KEY: str = os.getenv("TOGETHER_API_KEY", "dummy_llama_key")
    LLAMA_CHAT_MODEL: str = os.getenv("LLAMA_CHAT_MODEL")
    LLAMA_API_URL: str = os.getenv("LLAMA_API_URL")

    GEMINI_API_KEY: str = os.getenv("GEMINI_API_KEY", "dummy_gemini_key")
    GEMINI_CHAT_MODEL: str = os.getenv("GEMINI_CHAT_MODEL", "gemini-2.5-flash") 

    AUDIO_LANGUAGE: str = os.getenv("AUDIO_LANGUAGE", "en-US")

    GOOGLE_CLIENT_ID: str = os.getenv("GOOGLE_CLIENT_ID", "")
    JWT_SECRET: str = os.getenv("JWT_SECRET", "dev-secret")
    JWT_ALGORITHM: str = os.getenv("JWT_ALGORITHM", "HS256")
    JWT_EXPIRE_MINUTES: int = int(os.getenv("JWT_EXPIRE_MINUTES", "60"))

    GOOGLE_APPLICATION_CREDENTIALS: str = os.getenv("GOOGLE_APPLICATION_CREDENTIALS", "")

settings = Settings()