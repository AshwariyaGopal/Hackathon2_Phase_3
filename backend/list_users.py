import asyncio
from db import get_session
from models import User
from sqlmodel import select

async def main():
    session_gen = get_session()
    session = await anext(session_gen)
    try:
        statement = select(User)
        results = await session.execute(statement)
        users = results.scalars().all()
        for u in users:
            print(f"User: {u.email} (ID: {u.id})")
    except Exception as e:
        print(f"Error: {e}")
    finally:
        await session.close()

if __name__ == "__main__":
    asyncio.run(main())
