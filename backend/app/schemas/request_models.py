from pydantic import BaseModel
from typing import Optional, List, Dict, Any

class ChatRequest(BaseModel):
    latitude: Optional[float] = None
    longitude: Optional[float] = None
    user_input: str
    language:str = 'english'
    session_id:str 

class ChatResponse(BaseModel):
    response_text: str
    audio_url: Optional[str] = None 
    status: str = "success"
    severity_level:str
    clinics: Optional[List[Dict[str, Any]]] = None
    hotlines: Optional[Dict[str, str]] = None
