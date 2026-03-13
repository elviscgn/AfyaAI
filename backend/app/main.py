from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.routers import chat, auth
from fastapi.staticfiles import StaticFiles
import os

app = FastAPI(title="Afya AI Backend")

# Ensure the directory exists (extra safety check)
os.makedirs("static/audio", exist_ok=True)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Mount static files
app.mount("/audio", StaticFiles(directory="static/audio"), name="audio")

# Include routers
app.include_router(chat.router)
app.include_router(auth.router)

@app.get("/")
def read_root():
    return {"status": "online", "message": "Afya AI is running"}