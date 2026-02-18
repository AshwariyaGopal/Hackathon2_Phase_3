import asyncio
from db import get_session
from models import Task
import uuid
from datetime import datetime

async def main():
    session_gen = get_session()
    session = await anext(session_gen)
    try:
        # User ID for example@gmail.com
        user_id = "vUG6PX8CGkP9vOuDM3icPuZYeZFG7mPO"
        new_task = Task(
            id=str(uuid.uuid4()),
            user_id=user_id,
            title="runs",
            status="pending",
            created_at=datetime.utcnow()
        )
        session.add(new_task)
        await session.commit()
        print(f"Task 'runs' added for user {user_id}")
    except Exception as e:
        print(f"Error: {e}")
    finally:
        await session.close()

if __name__ == "__main__":
    asyncio.run(main())
