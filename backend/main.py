import logging
import asyncio
import sys
import selectors

# Fix for Windows ProactorEventLoop issue with psycopg
# This must happen before any async code runs
if sys.platform == "win32":
    try:
        from asyncio import WindowsSelectorEventLoopPolicy
    except ImportError:
        pass
    else:
        if not isinstance(asyncio.get_event_loop_policy(), WindowsSelectorEventLoopPolicy):
            asyncio.set_event_loop_policy(WindowsSelectorEventLoopPolicy())

from contextlib import asynccontextmanager
from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from db import init_db
from routes import tasks, chat

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup logic
    logger.info("Initializing database...")
    await init_db()
    logger.info("Database initialized.")
    yield
    # Shutdown logic (if any)
    logger.info("Shutting down...")

app = FastAPI(title="Evolution of Todo API", lifespan=lifespan)

# CORS Configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",
    ],
    allow_origin_regex="https://.*\\.vercel\\.app",
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.middleware("http")
async def log_requests(request: Request, call_next):
    client_host = request.client.host if request.client else "unknown"
    logger.info(f"Incoming Request: {request.method} {request.url} from {client_host}")
    # Log Auth header (masked)
    auth_header = request.headers.get("Authorization")
    if auth_header:
        logger.info(f"Auth Header Found: {auth_header[:15]}...")
    else:
        logger.info("Auth Header: MISSING")
        
    response = await call_next(request)
    logger.info(f"Response Status: {response.status_code}")
    return response

@app.exception_handler(Exception)
async def global_exception_handler(request: Request, exc: Exception):
    logger.error(f"Global error: {str(exc)}", exc_info=True)
    return JSONResponse(
        status_code=500,
        content={
            "message": "An unexpected error occurred.",
            "detail": str(exc)
        },
    )

@app.get("/")
async def root():
    return {"message": "Welcome to Evolution of Todo API"}

app.include_router(tasks.router, prefix="/api", tags=["tasks"])
app.include_router(chat.router, prefix="/api", tags=["chat"])
