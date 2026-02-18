import asyncio
import os
import logging
from dotenv import load_dotenv

# Import agent after loading env
load_dotenv()
from agent import GeminiAgent

# Setup logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

async def test_agent():
    print("Initializing Agent...")
    try:
        agent = GeminiAgent()
        print("Agent initialized successfully.")
    except Exception as e:
        print(f"FAILED to initialize Agent: {e}")
        return

    print("\nSending 'hello' to agent...")
    try:
        # Pass None for session for now
        result = await agent.process_message(None, "test_user_id", "hello", [])
        print(f"Agent Response: {result['response']}")
    except Exception as e:
        print(f"FAILED to process message: {e}")
        import traceback
        traceback.print_exc()

if __name__ == "__main__":
    asyncio.run(test_agent())
