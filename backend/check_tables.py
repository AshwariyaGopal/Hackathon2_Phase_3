import asyncio
import os
import sys
from sqlalchemy import text
from sqlalchemy.ext.asyncio import create_async_engine
from dotenv import load_dotenv

if sys.platform == "win32":
    asyncio.set_event_loop_policy(asyncio.WindowsSelectorEventLoopPolicy())

load_dotenv()
DATABASE_URL = os.getenv("DATABASE_URL")
ASYNC_DATABASE_URL = DATABASE_URL.replace("postgresql://", "postgresql+psycopg://", 1)

async def check_tables():
    engine = create_async_engine(ASYNC_DATABASE_URL)
    async with engine.connect() as conn:
        result = await conn.execute(text("SELECT tablename FROM pg_catalog.pg_tables WHERE schemaname != 'pg_catalog' AND schemaname != 'information_schema';"))
        tables = [row[0] for row in result]
        print(f"Tables in database: {tables}")
        
        required = ["user", "account", "session", "verification", "task", "conversation", "message", "jwks"]
        missing = [t for t in required if t not in tables]
        
        if missing:
            print(f"MISSING TABLES: {missing}")
        else:
            print("All required tables are present!")

if __name__ == "__main__":
    asyncio.run(check_tables())
