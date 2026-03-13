from pydantic import BaseModel
from typing import Optional, List, Dict, Any

class ChatRequest(BaseModel):
    latitude: Optional[float] = None
    longitude: Optional[float] = None
    user_input: str
    language:str = 'english'
    session_id:str 
    country: Optional[str] = "South Africa"
    tts_enabled: bool = False

class ChatResponse(BaseModel):
    response_text: str
    status: str = "success"
    severity_level:str
    clinics: Optional[List[Dict[str, Any]]] = None
    hotlines: Optional[Dict[str, str]] = None
    audio_url: Optional[str] = None
    visemes: Optional[List[Dict[str, Any]]] = None


class CheckInRequest(BaseModel):
    session_id:str
    sleep_hours:Optional[float] = None
    mood:Optional[int]=None
    hydration:Optional[int]=None
    symptoms:Optional[List[str]]=None

class CheckInResponse(BaseModel):
    status:str="success"
