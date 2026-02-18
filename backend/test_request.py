import asyncio
import os
import sys
import json
from sqlalchemy.ext.asyncio import create_async_engine, AsyncSession
from sqlalchemy.orm import sessionmaker
from dotenv import load_dotenv

# Apply Windows fix
if sys.platform == "win32":
    asyncio.set_event_loop_policy(asyncio.WindowsSelectorEventLoopPolicy())

load_dotenv()
from models import User
from routes.chat import chat, ChatRequest

async def test_full_request():
    print("Starting full request simulation...")
    
    DATABASE_URL = os.getenv("DATABASE_URL")
    ASYNC_DATABASE_URL = DATABASE_URL.replace("postgresql://", "postgresql+psycopg://", 1)
    engine = create_async_engine(ASYNC_DATABASE_URL)
    async_session = sessionmaker(engine, class_=AsyncSession, expire_on_commit=False)
    
    async with async_session() as session:
        from sqlmodel import select
        result = await session.execute(select(User).limit(1))
        user = result.scalar_one_or_none()
        
        if not user:
            print("No user found in DB.")
            return
            
        current_user = {"id": user.id, "email": user.email}
        print(f"Using user: {user.email}")
        
        request_data = ChatRequest(message="hello", conversation_id=None)
        
        print("Calling chat() route function...")
        try:
            # chat(request, session, current_user)
            response = await chat(request_data, session, current_user)
            print("\nSUCCESS!")
            if hasattr(response, "response"):
                print(f"Response: {response.response}")
            else:
                # If it's a JSONResponse
                print(f"Status Code: {response.status_code}")
                print(f"Body: {response.body.decode()}")
                
        except Exception as e:
            print(f"\nFAILED: {e}")
            import traceback
            traceback.print_exc()

if __name__ == "__main__":
    asyncio.run(test_full_request())
