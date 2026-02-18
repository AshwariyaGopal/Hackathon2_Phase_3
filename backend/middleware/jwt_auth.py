import os
from datetime import datetime, timezone
from pathlib import Path
from fastapi import HTTPException, Security, Depends, Request
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from sqlalchemy.ext.asyncio import AsyncSession
from sqlmodel import select
from dotenv import load_dotenv
from typing import Optional

from db import get_session
from models import Session as DbSession, User

# Load .env from the backend directory (parent of middleware)
env_path = Path(__file__).parent.parent / ".env"
load_dotenv(dotenv_path=env_path)

# auto_error=False allows us to handle missing headers manually (fallback to cookie)
security = HTTPBearer(auto_error=False)

async def get_current_user(
    request: Request,
    credentials: Optional[HTTPAuthorizationCredentials] = Security(security),
    session: AsyncSession = Depends(get_session)
):
    token = None
    
    # 1. Try Authorization Header
    if credentials:
        token = credentials.credentials
    
    # 2. Fallback to Cookie
    if not token:
        token = request.cookies.get("better-auth.session_token") or request.cookies.get("__Secure-better-auth.session_token")
        
    if not token:
        print("DEBUG: No token found in Header or Cookie")
        raise HTTPException(status_code=401, detail="Not authenticated")
    
    # Better Auth cookies are often signed: {token}.{signature}
    # We need to extract the raw token to query the database
    raw_token = token
    if "." in token:
        raw_token = token.split(".")[0]

    # 1. Query the Session table
    try:
        statement = select(DbSession).where(DbSession.token == raw_token)
        result = await session.execute(statement)
        db_session_record = result.scalar_one_or_none()
    except Exception as e:
        print(f"DEBUG: Database error during session lookup: {e}")
        raise HTTPException(status_code=503, detail="Database connection error. Please try again.")
    
    if not db_session_record:
        print("DEBUG: Session not found in database")
        raise HTTPException(status_code=401, detail="Invalid session")
        
    # 2. Check expiration
    # Ensure db_session_record.expires_at is timezone-aware
    expires_at = db_session_record.expires_at
    if expires_at.tzinfo is None:
        expires_at = expires_at.replace(tzinfo=timezone.utc)
        
    if expires_at < datetime.now(timezone.utc):
        print("DEBUG: Session expired")
        raise HTTPException(status_code=401, detail="Session expired")
        
    # 3. Get the User
    try:
        user_statement = select(User).where(User.id == db_session_record.user_id)
        user_result = await session.execute(user_statement)
        user = user_result.scalar_one_or_none()
    except Exception as e:
        print(f"DEBUG: Database error during user lookup: {e}")
        raise HTTPException(status_code=503, detail="Database connection error. Please try again.")
    
    if not user:
        print("DEBUG: User not found for session")
        raise HTTPException(status_code=401, detail="User not found")
        
    return {"id": user.id, "email": user.email}
