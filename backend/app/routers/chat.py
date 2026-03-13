from fastapi import APIRouter, HTTPException, File, UploadFile, Form
from fastapi.concurrency import run_in_threadpool
from typing import Optional
import json

from app.services.pdf_service import extract_text_from_pdf
from app.schemas.request_models import ChatRequest, ChatResponse, CheckInRequest, CheckInResponse
from app.services.llama_service import LlamaClient
from app.services.memory_service import MemoryService
from app.services.ai_context import build_system_prompt
from app.services.maps_service import REGIONAL_HOTLINES, get_nearest_clinics
from app.services.tts_service import generate_and_save_tts

router = APIRouter()

ai_client = LlamaClient()
memory_service = MemoryService()

@router.post("/chat", response_model=ChatResponse)
async def chat_with_afya(request: ChatRequest):
    if not ai_client:
        raise HTTPException(status_code=500, detail="AI Service is not initialized.")

    try:
        user_text = request.user_input
        selected_language = request.language
        session_id = request.session_id
        user_country = request.country or "South Africa"

        # 1. Fetch History
        chat_history = []
        if memory_service:
            chat_history = memory_service.get_recent_messages(session_id)

        history_context = ""
        for msg in chat_history:
            role = "USER" if msg['role'] == 'user' else "ASSISTANT"
            history_context += f"{role}: {msg['content']}\n"

        # 2. Hardened AI Prompt
        full_input = (
            f"PREVIOUS CONVERSATION:\n{history_context}\n\n"
            f"USER MESSAGE: {user_text}\n\n"
            f"SYSTEM INSTRUCTION: You are Afya, a medical assistant. "
            f"If the user mentions emergency symptoms (chest pain, breathing issues, heavy bleeding, stroke signs), "
            f"you MUST assign HIGH severity. "
            f"At the end of your response, append the tag [SEVERITY:LEVEL] where LEVEL is LOW, MEDIUM, or HIGH."
        )

        ai_response_text = await run_in_threadpool(
            ai_client.generate_content,
            system_prompt=build_system_prompt(user_id=session_id, db=memory_service),
            user_input=full_input,
            source_lang=selected_language,
            target_lang=selected_language
        )

        # 3. Robust Severity Extraction
        severity_level = "LOW"
        found_clinics = None
        regional_numbers = REGIONAL_HOTLINES.get(user_country, REGIONAL_HOTLINES["South Africa"])
        
        if "[SEVERITY:" in ai_response_text.upper():
            parts = ai_response_text.split("[SEVERITY:")
            ai_response_text = parts[0].strip()
            # Extract level even if AI includes spaces or lowercase
            severity_level = parts[1].split("]")[0].strip().upper()

            if severity_level == "HIGH":
                if request.latitude and request.longitude:
                    found_clinics = get_nearest_clinics(request.latitude, request.longitude)
                
                # Emergency Warning Translation
                warning_en = "Please visit a hospital or contact emergency services IMMEDIATELY."
                translated_warning = await run_in_threadpool(
                    ai_client.translator.translate_from_english, 
                    warning_en, 
                    selected_language
                )
                
                ai_response_text += f"\n\n{translated_warning}"
                for name, num in regional_numbers.items():
                    ai_response_text += f"\n{name}: {num}"

        # 4. Audio Generation (Emergency Override)
        audio_url = None
        visemes_array = None

        # Force audio generation if it's HIGH severity, otherwise check tts_enabled
        if request.tts_enabled or severity_level == "HIGH":
            safe_text = ai_response_text.replace("&", "and")
            audio_url, visemes_array = await generate_and_save_tts(
                safe_text, 
                selected_language
            )

        # 5. DB Save & Return
        if memory_service:
            memory_service.add_message(session_id, "user", user_text)
            memory_service.add_message(session_id, "assistant", ai_response_text)

        return ChatResponse(
            response_text=ai_response_text,
            severity_level=severity_level,
            clinics=found_clinics,
            hotlines=regional_numbers if severity_level == "HIGH" else None,
            audio_url=audio_url,
            visemes=visemes_array
        )

    except Exception as e:
        print(f"CRITICAL ROUTER ERROR: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/upload-pdf", response_model=ChatResponse)
async def upload_medical_pdf(
    file: UploadFile = File(...),
    user_prompt: str = Form("Summarize this document."),
    language: str = Form("english"),
    session_id: str = Form("default_pdf")
):
    try:
        file_bytes = await file.read()
        pdf_text = extract_text_from_pdf(file_bytes)
        ai_response = await run_in_threadpool(
            ai_client.generate_content,
            system_prompt="Analyze this medical PDF accurately.",
            user_input=f"Instruction: {user_prompt}\nText: {pdf_text}",
            source_lang=language,
            target_lang=language
        )
        return ChatResponse(response_text=ai_response, severity_level="LOW")
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/checkin", response_model=CheckInResponse)
async def log_daily_checkin(request: CheckInRequest):
    if not memory_service:
        raise HTTPException(status_code=500, detail="DB Error")
    try:
        memory_service.save_checkin(
            user_id=request.session_id,
            sleep_hours=request.sleep_hours,
            mood=request.mood,
            hydration=request.hydration,
            symptoms=request.symptoms
        )
        return CheckInResponse(status="success")
    except Exception as e:
        raise HTTPException(status_code=500, detail="Save Failed")