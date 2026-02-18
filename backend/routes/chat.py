import logging
import traceback
from fastapi import APIRouter, Depends, HTTPException
from fastapi.responses import JSONResponse
from sqlmodel import select
from sqlalchemy.ext.asyncio import AsyncSession
from typing import Optional, List, Dict, Any
from pydantic import BaseModel

from db import get_session
from models import Conversation, Message
from middleware.jwt_auth import get_current_user
from agent import GeminiAgent

logger = logging.getLogger(__name__)

router = APIRouter(prefix="/chat")

# Global agent instance
_agent = None

def get_agent():
    global _agent
    if _agent is None:
        try:
            logger.info("[Chat Route] Initializing new GeminiAgent instance")
            new_agent = GeminiAgent()
            _agent = new_agent # Assign to global
        except Exception as e:
            logger.error(f"[Chat Route] Failed to initialize GeminiAgent: {e}")
            logger.error(traceback.format_exc())
            raise e
    return _agent

class ChatRequest(BaseModel):
    message: str
    conversation_id: Optional[int] = None

class ChatResponse(BaseModel):
    conversation_id: int
    response: str
    tool_calls: Optional[List[Dict[str, Any]]] = None

@router.post("", response_model=ChatResponse)
async def chat(
    request: ChatRequest,
    session: AsyncSession = Depends(get_session),
    current_user: dict = Depends(get_current_user)
):
    try:
        logger.info(f"[Chat Route] --- BEGIN CHAT REQUEST ---")
        
        # Safe access to current_user
        user_id = None
        try:
            if isinstance(current_user, dict):
                user_id = current_user.get("id")
            else:
                user_id = getattr(current_user, "id", None)
        except Exception as e:
            logger.error(f"[Chat Route] User ID extraction failed: {e}")
            
        if not user_id:
            logger.error("[Chat Route] No user ID found in session")
            return JSONResponse(status_code=401, content={"detail": "Unauthorized: No user ID"})

        logger.info(f"[Chat Route] User: {user_id}, Requested Conv: {request.conversation_id}")
        
        # 1. Fetch or Create Conversation
        conversation_id = request.conversation_id
        try:
            if conversation_id:
                conversation = await session.get(Conversation, conversation_id)
                if conversation:
                    if str(conversation.user_id) != str(user_id):
                        logger.warning(f"[Chat Route] Ownership mismatch for conv {conversation_id}. Resetting for user {user_id}")
                        conversation_id = None # Force create new one
                else:
                    logger.info(f"[Chat Route] Conv {conversation_id} not found, will create new")
                    conversation_id = None
            
            if conversation_id is None:
                logger.info("[Chat Route] Creating new conversation record")
                new_conv = Conversation(user_id=user_id)
                session.add(new_conv)
                await session.commit()
                await session.refresh(new_conv)
                conversation_id = int(new_conv.id)
                logger.info(f"[Chat Route] New conv ID assigned: {conversation_id}")
        except Exception as e:
            logger.error(f"[Chat Route] DB Conversation Error: {e}")
            return JSONResponse(status_code=500, content={"detail": f"Database Conversation Error: {str(e)}"})

        # 2. Fetch History
        logger.info(f"[Chat Route] Fetching history for {conversation_id}")
        history = []
        try:
            stmt = select(Message).where(Message.conversation_id == conversation_id).order_by(Message.created_at.desc()).limit(5)
            result = await session.execute(stmt)
            history_objs = list(reversed(result.scalars().all()))
            history = [{"role": m.role, "content": m.content} for m in history_objs]
            logger.info(f"[Chat Route] History loaded: {len(history)} messages")
        except Exception as e:
            logger.error(f"[Chat Route] History load error: {e}")
            # Non-fatal, proceed with empty history

        # 3. Save User Message
        logger.info(f"[Chat Route] Saving user message")
        try:
            user_msg = Message(
                conversation_id=conversation_id,
                user_id=user_id,
                role="user",
                content=request.message
            )
            session.add(user_msg)
            await session.commit()
        except Exception as e:
            logger.error(f"[Chat Route] Failed to save user message: {e}")
        
        # 4. Call Agent
        logger.info("[Chat Route] Handing over to GeminiAgent")
        agent_resp = "I'm sorry, I'm having trouble thinking right now."
        tool_calls = []
        try:
            agent = get_agent()
            agent_result = await agent.process_message(session, user_id, request.message, history)
            agent_resp = agent_result.get("response") or agent_resp
            tool_calls = agent_result.get("tool_calls", [])
        except Exception as e:
            logger.error(f"[Chat Route] Agent Error: {e}")
            logger.error(traceback.format_exc())
            agent_resp = f"The AI brain is having trouble: {str(e)[:100]}"

        # 5. Save Assistant Message
        logger.info(f"[Chat Route] Saving assistant response")
        try:
            asst_msg = Message(
                conversation_id=conversation_id,
                user_id=user_id,
                role="assistant",
                content=agent_resp
            )
            session.add(asst_msg)
            await session.commit()
            logger.info("[Chat Route] Save successful")
        except Exception as e:
            logger.error(f"[Chat Route] Failed to save assistant response: {e}")

        logger.info(f"[Chat Route] --- SUCCESSFUL RESPONSE ---")
        return ChatResponse(
            conversation_id=int(conversation_id),
            response=agent_resp,
            tool_calls=tool_calls
        )
    except Exception as e:
        logger.error(f"[Chat Route] CRITICAL UNHANDLED ERROR: {e}")
        logger.error(traceback.format_exc())
        return JSONResponse(
            status_code=500,
            content={"detail": f"System Error: {str(e)}"}
        )

@router.get("/history", response_model=List[Dict[str, Any]])
async def get_history(
    conversation_id: int,
    session: AsyncSession = Depends(get_session),
    current_user: dict = Depends(get_current_user)
):
    try:
        if isinstance(current_user, dict):
            user_id = current_user.get("id")
        else:
            user_id = getattr(current_user, "id", None)
            
        stmt = select(Message).where(Message.conversation_id == conversation_id, Message.user_id == user_id).order_by(Message.created_at.asc())
        result = await session.execute(stmt)
        messages = result.scalars().all()
        
        return [
            {
                "id": m.id,
                "role": m.role,
                "content": m.content,
                "created_at": m.created_at
            }
            for m in messages
        ]
    except Exception as e:
        logger.error(f"[Chat Route] History error: {e}")
        raise HTTPException(status_code=500, detail="Could not fetch history")
