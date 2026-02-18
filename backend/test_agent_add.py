import asyncio
import logging
from agent import GeminiAgent
from db import get_session
from models import User
from sqlmodel import select

# Configure logging
logging.basicConfig(level=logging.INFO)

async def test_add_task():
    print("Testing Add Task via Agent...")
    agent = GeminiAgent()
    
    session_gen = get_session()
    session = await anext(session_gen)
    
    try:
        # Pick the user example@gmail.com
        user_id = "vUG6PX8CGkP9vOuDM3icPuZYeZFG7mPO"
        message = "Add a task called 'runs'"
        history = []
        
        print(f"User ID: {user_id}")
        print(f"Message: {message}")
        
        result = await agent.process_message(session, user_id, message, history)
        print(f"Agent Response: {result['response']}")
        print(f"Tool Calls: {result['tool_calls']}")
        
        # Verify in DB
        statement = select(User).where(User.id == user_id)
        # Not needed, just checking tasks
        from models import Task
        res = await session.execute(select(Task).where(Task.user_id == user_id, Task.title == "runs"))
        tasks = res.scalars().all()
        print(f"Tasks found in DB: {[t.title for t in tasks]}")
        
    except Exception as e:
        print(f"Error: {e}")
    finally:
        await session.close()

if __name__ == "__main__":
    asyncio.run(test_add_task())
