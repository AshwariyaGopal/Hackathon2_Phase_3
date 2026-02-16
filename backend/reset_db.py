import asyncio
import os
import sys
from pathlib import Path
from dotenv import load_dotenv
from sqlalchemy.ext.asyncio import create_async_engine
from sqlmodel import SQLModel

# Fix for Windows ProactorEventLoop issue with psycopg
if sys.platform == "win32":
    asyncio.set_event_loop_policy(asyncio.WindowsSelectorEventLoopPolicy())

# Load .env
env_path = Path(__file__).parent / ".env"
load_dotenv(dotenv_path=env_path)

DATABASE_URL = os.getenv("DATABASE_URL")
if DATABASE_URL and DATABASE_URL.startswith("postgresql://"):
    ASYNC_DATABASE_URL = DATABASE_URL.replace("postgresql://", "postgresql+psycopg://", 1)
else:
    ASYNC_DATABASE_URL = DATABASE_URL

engine = create_async_engine(ASYNC_DATABASE_URL, echo=True)

async def reset_db():
    print("Connecting to database...")
    async with engine.begin() as conn:
        print("Dropping all tables...")
        # We need to import the models so SQLModel knows about them
        from models import User, Account, Session, Verification, Task
        await conn.run_sync(SQLModel.metadata.drop_all)
        print("Creating all tables with correct schema...")
        await conn.run_sync(SQLModel.metadata.create_all)
    print("Database reset successfully!")

if __name__ == "__main__":
    asyncio.run(reset_db())
