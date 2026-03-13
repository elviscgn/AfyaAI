# AfyaAI Backend - Core Engine

## Quick Start: Run the Server

1. **Install Dependencies:**
   ```bash
   pip install -r requirements.txt

```

2. **Launch the API:**
```bash
cd backend
uvicorn app.main:app --reload

```


3. **Interactive Documentation:**
Open http://localhost:8000/docs in your browser to test the endpoints.

---

## Key Architectural Breakthroughs

### 1. The "Severity Slicer" (Data Contract)

We use a unique Invisible Tag system to pass data from the AI to the Python backend without the user seeing the raw logic.

* **The AI's Task:** Every response must end with a hidden tag: `[SEVERITY: LOW|MEDIUM|HIGH]`.
* **The Backend's Task:** Our router slices this tag off and uses it to decide whether to trigger the OpenStreetMap API for nearby clinics.

### 2. Emergency Routing (Map Trigger)

The backend dynamically injects life-saving data based on the AI's assessment:

* **LOW:** Pure conversational support and empathy.
* **MEDIUM:** Silently fetches a JSON list of nearby clinics for the frontend to display as cards.
* **HIGH:** Emergency Override. Injects sirens, national hotlines, and immediate hospital locations into the text. The AI is forbidden from asking follow-up questions to avoid delaying care.

### 3. Multi-Lingual "Sandwich"

Afya supports English, Zulu, Sotho, and Afrikaans.

* The system uses a translation layer to ensure the AI always understands the user's intent, while Afya responds in the user's preferred language with culturally relevant warmth.

### 4. Context Injection Engine (7-Day Memory)

Afya is a proactive companion, not just a reactive chatbot.

* Before the AI generates a response, the backend queries the SQLite database for the user's last 7 days of health check-ins.
* It aggregates metrics (e.g., average sleep, recurring symptoms) and dynamically injects them into the Llama 3 system prompt as strict, established facts.
* Result: Afya opens conversations by checking in on known issues rather than asking repetitive intake questions.

---

## Database Schema (Memory Vault)

The application uses SQLite to persist user memory and health trends across sessions.

### Table: chat_history

Stores the immediate conversational context.

* `id` (Primary Key)
* `session_id` (String - Maps to the user)
* `role` (String - 'user' or 'assistant')
* `content` (Text - The message body)
* `timestamp` (DateTime)

### Table: daily_checkins

Stores the longitudinal health data used for the Context Injection Engine.

* `id` (Primary Key)
* `user_id` (String - Maps to `session_id`)
* `date` (DateTime)
* `sleep_hours` (Float)
* `mood` (Integer 1-10)
* `hydration` (Integer - Stored in milliliters)
* `symptoms` (JSON String - Array of specific ailments)

---

## API Endpoints

### POST /chat

The main conversational hub.

* **Input:** `ChatRequest` (Text, GPS, Language, SessionID)
* **Output:** `ChatResponse` (Text, Severity, Clinics List, Hotlines)

### POST /checkin

The daily health metric ingestion route.

* **Input:** `CheckInRequest` (session_id, sleep_hours, mood, hydration, symptoms)
* **Output:** `CheckInResponse` (Status confirmation)

### POST /upload-pdf

Medical document analysis.

* **Function:** Extracts text from medical PDFs, summarizes it with Afya’s empathy, and performs the same severity triage as the chat.

---

## Tech Stack

* **Framework:** FastAPI (Python 3.10+)
* **AI Model:** Llama 3 (via Featherless/Groq)
* **Database:** SQLite (Session Memory & User Context)
* **Maps:** Overpass API (OpenStreetMap)
* **Validation:** Pydantic v2

---

## Safety & Compliance

1. **Non-Diagnostic:** Afya is strictly forbidden from naming specific diseases or syndromes.
2. **Emergency Override:** If HIGH severity is detected, the AI conversation loop is broken to prioritize physical care.
3. **GPS Fallback:** If coordinates are missing, the system automatically switches to "Suburb Request" mode to help the user manually find care.

