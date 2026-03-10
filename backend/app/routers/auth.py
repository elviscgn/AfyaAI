from datetime import datetime, timedelta
from typing import Dict

from fastapi import APIRouter, HTTPException, Depends
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from pydantic import BaseModel
from jose import jwt, JWTError
from google.oauth2 import id_token
from google.auth.transport import requests

from app.core.config import settings

router = APIRouter()

if not settings.GOOGLE_CLIENT_ID:
    print("WARNING: GOOGLE_CLIENT_ID is not set in your environment variables!")

# Simple in-memory "database" (replace with real DB later)
fake_db: Dict[str, Dict] = {}

# Pydantic model for incoming token
class GoogleTokenIn(BaseModel):
    id_token: str

# Security helper (HTTP Bearer)
bearer_scheme = HTTPBearer()

# ----- JWT utilities -----
def create_jwt(user_id: str, email: str) -> str:
    expiry = datetime.utcnow() + timedelta(minutes=settings.JWT_EXPIRE_MINUTES)
    payload = {
        "sub": user_id,
        "email": email,
        "exp": expiry
    }
    token = jwt.encode(payload, settings.JWT_SECRET, algorithm=settings.JWT_ALGORITHM)
    return token

def verify_jwt(token: str) -> dict:
    try:
        payload = jwt.decode(token, settings.JWT_SECRET, algorithms=[settings.JWT_ALGORITHM])
        return payload
    except JWTError as e:
        raise HTTPException(status_code=401, detail="Invalid or expired JWT") from e

# Dependency for protected routes
def get_current_user(credentials: HTTPAuthorizationCredentials = Depends(bearer_scheme)):
    token = credentials.credentials
    payload = verify_jwt(token)
    user_id = payload.get("sub")
    if not user_id or user_id not in fake_db:
        raise HTTPException(status_code=401, detail="Invalid user")
    return fake_db[user_id]

# ----- Routes -----
@router.post("/auth/google")
async def google_login(data: GoogleTokenIn):
    """
    Exchange the ID token from the frontend for a JWT used by your app.
    """
    if not settings.GOOGLE_CLIENT_ID:
        raise HTTPException(status_code=500, detail="Server misconfiguration: GOOGLE_CLIENT_ID missing")

    try:
        # Verify token with Google (this checks expiry/audience/signature)
        idinfo = id_token.verify_oauth2_token(
            data.id_token,
            requests.Request(),
            settings.GOOGLE_CLIENT_ID
        )
    except ValueError:
        # Token invalid
        raise HTTPException(status_code=400, detail="Invalid Google ID token")

    # Extract user info
    google_id = idinfo.get("sub")
    email = idinfo.get("email")
    name = idinfo.get("name", "")
    picture = idinfo.get("picture", "")

    if not google_id or not email:
        raise HTTPException(status_code=400, detail="Google ID token missing required fields")

    # Save to DB (or look up existing user)
    user = fake_db.get(google_id)
    if not user:
        user = {
            "id": google_id,
            "email": email,
            "name": name,
            "picture": picture,
            "created_at": datetime.utcnow().isoformat()
        }
        fake_db[google_id] = user

    # Create your own JWT
    jwt_token = create_jwt(google_id, email)

    return {"success": True, "token": jwt_token, "user": user}

@router.get("/protected")
async def protected_route(current_user: dict = Depends(get_current_user)):
    """
    Example protected route. Requires Authorization: Bearer <your-jwt>
    """
    return {"message": f"Hello {current_user['name'] or current_user['email']}", "user": current_user}

@router.get("/health")
async def health():
    return {"status": "ok"}