import logging
from fastapi import APIRouter, Depends, HTTPException
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
        user_id = current_user["id"]
        logger.info(f"Chat request from user: {user_id}, conversation_id: {request.conversation_id}")
        
        # 1. Fetch or Create Conversation
        conversation_id = request.conversation_id
        conversation = None
        
        if conversation_id:
            try:
                conversation = await session.get(Conversation, conversation_id)
                if conversation and conversation.user_id != user_id:
                    logger.warning(f"User {user_id} tried to access conversation {conversation_id} owned by {conversation.user_id}")
                    raise HTTPException(status_code=403, detail="Forbidden: Conversation access denied")
            except Exception as e:
                logger.error(f"Error fetching conversation: {e}")
                conversation = None
        
        if not conversation:
            logger.info(f"Creating new conversation for user {user_id}")
            conversation = Conversation(user_id=user_id)
            session.add(conversation)
            await session.commit()
            await session.refresh(conversation)
            conversation_id = conversation.id
            logger.info(f"New conversation created with ID: {conversation_id}")

        # 2. Fetch History
        stmt = (
            select(Message)
            .where(Message.conversation_id == conversation_id)
            .order_by(Message.created_at.desc())
            .limit(10)
        )
        result = await session.execute(stmt)
        history_objs = result.scalars().all()
        history_objs = list(reversed(history_objs))
        history = [{"role": m.role, "content": m.content} for m in history_objs]

        # 3. Save User Message
        user_msg = Message(
            conversation_id=conversation_id,
            user_id=user_id,
            role="user",
            content=request.message
        )
        session.add(user_msg)
        await session.commit()
        
        # 4. Call Agent
        try:
            agent = GeminiAgent()
            result = await agent.process_message(session, user_id, request.message, history)
        except Exception as e:
            logger.error(f"Gemini Agent error: {e}", exc_info=True)
            result = {"response": f"I encountered an error processing your request: {str(e)}", "tool_calls": []}

        response_text = result.get("response") or "I processed your request but have no text response."
        tool_calls = result.get("tool_calls", [])
        
        # 5. Save Assistant Message
        asst_msg = Message(
            conversation_id=conversation_id,
            user_id=user_id,
            role="assistant",
            content=response_text
        )
        session.add(asst_msg)
        await session.commit()

        return ChatResponse(
            conversation_id=conversation_id,
            response=response_text,
            tool_calls=tool_calls
        )
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"CRITICAL: Unhandled error in chat route: {e}", exc_info=True)
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/history", response_model=List[Dict[str, Any]])
async def get_history(
    conversation_id: int,
    session: AsyncSession = Depends(get_session),
    current_user: dict = Depends(get_current_user)
):
    user_id = current_user["id"]
    
    stmt = (
        select(Message)
        .where(Message.conversation_id == conversation_id, Message.user_id == user_id)
        .order_by(Message.created_at.asc())
    )
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