import asyncio
from db import get_session
from models import Task
from sqlmodel import select, delete

async def main():
    session_gen = get_session()
    session = await anext(session_gen)
    try:
        statement = delete(Task).where(Task.title == "runs")
        await session.execute(statement)
        await session.commit()
        print("Task 'runs' deleted.")
    except Exception as e:
        print(f"Error: {e}")
    finally:
        await session.close()

if __name__ == "__main__":
    asyncio.run(main())
