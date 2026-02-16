import asyncio
import os
import sys
from pathlib import Path
from dotenv import load_dotenv
from sqlalchemy import text
from sqlalchemy.ext.asyncio import create_async_engine

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

engine = create_async_engine(ASYNC_DATABASE_URL)

async def check_schema():
    print("Checking database schema for 'user' table...")
    async with engine.connect() as conn:
        # Query to get column names for the 'user' table
        result = await conn.execute(text(
            "SELECT column_name FROM information_schema.columns WHERE table_name = 'user';"
        ))
        columns = [row[0] for row in result.fetchall()]
        
        print(f"Found columns: {columns}")
        
        if "emailVerified" in columns:
            print("✅ SUCCESS: 'emailVerified' column exists!")
        elif "emailverified" in columns:
            print("❌ FAILURE: Found 'emailverified' (lowercase). Better Auth needs 'emailVerified'.")
        elif "email_verified" in columns:
            print("❌ FAILURE: Found 'email_verified' (snake_case). Better Auth needs 'emailVerified'.")
        else:
            print("❌ FAILURE: Could not find email verification column.")

if __name__ == "__main__":
    asyncio.run(check_schema())
