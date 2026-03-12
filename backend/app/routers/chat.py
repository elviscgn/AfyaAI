from fastapi import APIRouter, HTTPException,File,UploadFile,Form, WebSocket, WebSocketDisconnect
from app.services.pdf_service import extract_text_from_pdf
from app.schemas.request_models import ChatRequest, ChatResponse, CheckInRequest,CheckInResponse
from app.services.llama_service import LlamaClient
from app.services.memory_service import MemoryService
from app.services.ai_context import build_system_prompt
from app.services.maps_service import CRITICAL_SA_HOTLINES, get_nearest_clinics
from app.services.tts_service import stream_tts_and_visemes
import json



router = APIRouter()

try:
    ai_client = LlamaClient()



except Exception as e:
    print(f"Error initializing AI Client: {e}")
    ai_client = None

try:
    memory_service =  MemoryService()
except Exception as e:
    print(f"Error initializing Memory service database: {e}")


@router.post("/chat", response_model=ChatResponse)
async def chat_with_afya(request: ChatRequest):
    """
    Receives user input, sends it to the AI Service, and returns the structured response.
    """
    if not ai_client:
        raise HTTPException(status_code=500, detail="AI Service is not initialized. Check server logs.")

    try:

        user_text = request.user_input
        selected_language = request.language
        session_id = request.session_id

        chat_history =[]

        if memory_service:
            chat_history=memory_service.get_recent_messages(session_id)

        history_context = ''
        for message in chat_history:
            if message['role']=='user':
                history_context+=f"USER: {message['content']}\n"
            else:
                history_context+=f"ASSISSTANT: {message['content']}\n"

        full_user_input = f"PREVIOUS CONVERSATION:\n{history_context}\n\nUSER'S NEW MESSAGE:\n{user_text}\n\n[CRITICAL SYSTEM DIRECTIVE: You MUST append the severity tag (e.g., [SEVERITY: HIGH]) to the very end of THIS specific response. Do NOT wait for more context to assign a severity level. Assess the immediate risk based strictly on the current message.]"
        ai_response_text = ai_client.generate_content(
            system_prompt=build_system_prompt(user_id=session_id, db=memory_service),
            user_input=full_user_input,
            source_lang=selected_language,
            target_lang=selected_language
        )

        severity = "LOW"
        found_clinics = None
        ai_severity_response = "LOW"
        if "[SEVERITY:" in ai_response_text:
            response_split = ai_response_text.split("[SEVERITY:")

            ai_response_text = response_split[0]
            ai_severity_response= response_split[1].strip().replace("]","")

            if ai_severity_response=="MEDIUM":
                if request.latitude and request.longitude:
                    found_clinics = get_nearest_clinics(request.latitude,request.longitude)

            elif ai_severity_response=="HIGH":
                if request.latitude and request.longitude:
                    found_clinics = get_nearest_clinics(request.latitude,request.longitude)
                    ai_response_text+="\n\n Please visit a hospital or contact emergency services IMMEDIATELY. Here are the closest facilities and national hotlines."
                    for helpline, helpline_number in CRITICAL_SA_HOTLINES.items():
                        ai_response_text+=f"\n\n {helpline}: {helpline_number}"
                else:
                    ai_response_text+="\n\n Please call 112 or 10177 immediately. If you need me to find the nearest hospital, please share your current suburb."
            

            

        if memory_service:
            memory_service.add_message(session_id, "user", user_text)
            memory_service.add_message(session_id, "assistant", ai_response_text)



        return ChatResponse(
            response_text=ai_response_text, severity_level=ai_severity_response, clinics = found_clinics, hotlines=CRITICAL_SA_HOTLINES
        ) if found_clinics else ChatResponse( response_text=ai_response_text, severity_level=ai_severity_response, hotlines=CRITICAL_SA_HOTLINES if ai_severity_response == "HIGH" else None)

    except Exception as e:
        print(f"Error processing chat request: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/upload-pdf", response_model=ChatResponse)
async def upload_medical_pdf(
    file: UploadFile = File(..., description="The medical PDF file to be analyzed."),
    user_prompt: str = Form("Please summarize and simplify this document."),
    language: str = Form("english"),
    session_id: str = Form("default_pdf_session")
):
    """
    Receives PDF, reads it, loads history, calls AI, and saves the interaction.
    """
    if not ai_client:
        raise HTTPException(status_code=500, detail="AI Service is not initialized.")

    try:

        file_bytes = await file.read()
        pdf_text = extract_text_from_pdf(file_bytes)


        chat_history = []
        if memory_service:
            chat_history = memory_service.get_recent_messages(session_id)


        history_context = ""
        for msg in chat_history:
            role_label = "USER" if msg['role'] == "user" else "ASSISTANT"
            history_context += f"{role_label}: {msg['content']}\n"


        user_input_for_ai = (
            f"PREVIOUS CONVERSATION:\n{history_context}\n\n"
            f"USER INSTRUCTION: {user_prompt}\n"
            f"--- DOCUMENT TEXT ---\n{pdf_text}"
        )


        ai_response_text = ai_client.generate_content(
            system_prompt=build_system_prompt(user_id=session_id, db=memory_service),
            user_input=user_input_for_ai,
            source_lang=language,
            target_lang=language
        )
                    
        if memory_service:

            memory_service.add_message(session_id, "user", f"[Uploaded PDF] {user_prompt}")
            memory_service.add_message(session_id, "assistant", ai_response_text)

        return ChatResponse(
            response_text=ai_response_text, severity_level="LOW"
        )

    except Exception as e:
        print(f"Error processing PDF upload: {e}")
        raise HTTPException(
            status_code=500,
            detail=f"Failed to process document: Ensure the file is a readable PDF. Details: {e}"
        )

@router.post("/checkin", response_model=CheckInResponse)
async def log_daily_checkin(request: CheckInRequest):
    """
    Receives daily health metrics from the frontend and saves them to the database.
    """
    if not memory_service:
        raise HTTPException(status_code=500, detail="Database service is not initialized.")

    try:
        memory_service.save_checkin(
            user_id=request.session_id,
            sleep_hours=request.sleep_hours,
            mood=request.mood,
            hydration=request.hydration,
            symptoms=request.symptoms,
            notes=None  
        )

        return CheckInResponse(status="success")

    except Exception as e:
        print(f"Error saving daily check-in: {e}")
        raise HTTPException(status_code=500, detail="Failed to save check-in data.")
    

@router.websocket("/ws/chat")
async def chat_stream(websocket: WebSocket):
    """
    Persistent connection for real-time text, audio, and viseme delivery.
    """
    await websocket.accept()
    
    try:
        while True:
            # 1. Wait for the frontend to send a message
            raw_data = await websocket.receive_text()
            data = json.loads(raw_data)
            user_text = data.get("user_input", "")
            
            # TODO: Pass user_text to your Llama 3 model here just like in your POST route.
            # For right now, we will simulate the AI's response:
            ai_response_text = "I know you've been battling headaches lately. I am so sorry to hear that. How are you feeling right now?"
            
            # 2. Instantly send the text response so the UI chat bubble updates
            await websocket.send_text(json.dumps({
                "type": "text_response",
                "text": ai_response_text
            }))
            
            # 3. Stream the Audio & Visemes chunk by chunk to the 3D Avatar
            async for chunk_payload in stream_tts_and_visemes(ai_response_text):
                await websocket.send_text(chunk_payload)
                
    except WebSocketDisconnect:
        print("Frontend disconnected from the chat stream.")