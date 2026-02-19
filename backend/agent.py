import os
import logging
import traceback
import asyncio
from datetime import datetime
from typing import List, Dict, Any, Optional

try:
    import google.generativeai as genai
    from google.generativeai import protos
    GENAI_AVAILABLE = True
except ImportError:
    GENAI_AVAILABLE = False

from sqlalchemy.ext.asyncio import AsyncSession
from dotenv import load_dotenv

from mcp_tools import GEMINI_TOOLS, TOOL_FUNCTIONS

load_dotenv()
logger = logging.getLogger(__name__)

class GeminiAgent:
    def __init__(self):
        if not GENAI_AVAILABLE:
            logger.error("google-generativeai package not found")
            raise ImportError("google-generativeai package not found")

        try:
            api_key = os.getenv("GEMINI_API_KEY")
            if not api_key:
                logger.error("GEMINI_API_KEY not set in environment")
                raise ValueError("GEMINI_API_KEY not set")
            
            genai.configure(api_key=api_key)
            
            # Use 2.5-flash-lite (only non-zero quota model for this key)
            model_name = "gemini-2.5-flash-lite"
            logger.info(f"[Agent] Initializing model: {model_name}")
            
            self.model = genai.GenerativeModel(
                model_name=model_name,
                tools=GEMINI_TOOLS,
                system_instruction=f"""
                You are TaskZen AI, a premium todo assistant. 
                Today's date is: {str(datetime.now().date())}.
                
                CORE RULES:
                1. You MUST use tools for all actions. 
                2. If the user mentions a task by title (e.g. "cooking daily") but you don't have its UUID ID:
                   - FIRST call `list_tasks` with the title in the `search` parameter.
                   - SECOND use the ID from the search results to call `update_task`, `complete_task`, or `delete_task`.
                3. NEVER ask the user for a "Task ID" or "UUID" if you can find it yourself using `list_tasks`.
                4. If multiple tasks match, ask for clarification.
                
                Confirm actions clearly and naturally.
                """
            )
            logger.info("[Agent] Model initialized successfully")
        except Exception as e:
            logger.error(f"[Agent] Initialization error: {str(e)}")
            raise e

    async def _send_with_retry(self, chat, content, retries=3, delay=5):
        """Helper to send messages with pacing."""
        for i in range(retries):
            try:
                # 1 second pacing to avoid hitting "concurrent" limits
                await asyncio.sleep(1)
                return await chat.send_message_async(content)
            except Exception as e:
                err_msg = str(e).lower()
                is_rate_limit = any(x in err_msg for x in ["quota", "429", "resource_exhausted", "limit"])
                
                if is_rate_limit and i < retries - 1:
                    wait_time = delay + (i * 5)
                    logger.warning(f"[Agent] Rate limit hit. Waiting {wait_time}s...")
                    await asyncio.sleep(wait_time)
                    continue
                raise e

    async def process_message(
        self, 
        session: AsyncSession, 
        user_id: str, 
        message: str, 
        history: List[Dict[str, str]]
    ) -> Dict[str, Any]:
        """
        Process user message with history and tools.
        """
        logger.info(f"[Agent] Processing for {user_id}")
        
        try:
            gemini_history = []
            for h in history[-3:]: # Minimal history to stay in quota
                role = "user" if h["role"] == "user" else "model"
                gemini_history.append({"role": role, "parts": [h["content"]]})
            
            chat = self.model.start_chat(history=gemini_history)
            response = await self._send_with_retry(chat, message)

            tool_calls_executed = []
            max_turns = 2 
            turn = 0
            
            while turn < max_turns:
                turn += 1
                function_calls = []
                if hasattr(response, 'parts'):
                    for part in response.parts:
                        if part.function_call:
                            function_calls.append(part.function_call)
                
                if not function_calls:
                    try:
                        return {"response": response.text, "tool_calls": tool_calls_executed}
                    except (AttributeError, ValueError):
                        return {"response": "I've processed that for you.", "tool_calls": tool_calls_executed}
                
                response_parts = []
                for fc in function_calls:
                    fn_name = fc.name
                    fn_args = dict(fc.args)
                    logger.info(f"[Agent] Tool: {fn_name}")
                    
                    try:
                        if fn_name in TOOL_FUNCTIONS:
                            result = await TOOL_FUNCTIONS[fn_name](session, user_id, **fn_args)
                        else:
                            result = {"error": f"Tool {fn_name} not found"}
                    except Exception as i_e:
                        result = {"error": str(i_e)}
                    
                    tool_calls_executed.append({"tool": fn_name, "args": fn_args, "result": result})
                    
                    response_parts.append({
                        "function_response": {
                            "name": fn_name,
                            "response": {"result": result} 
                        }
                    })
                
                # Small delay between internal steps
                await asyncio.sleep(2)
                response = await self._send_with_retry(chat, {"parts": response_parts})
            
            return {
                "response": "I've performed several actions but reached my speed limit.",
                "tool_calls": tool_calls_executed
            }
        except Exception as e:
            error_msg = str(e)
            logger.error(f"[Agent] Error: {error_msg}")
            if "quota" in error_msg.lower() or "429" in error_msg:
                return {"response": "I'm currently hitting a rate limit. Please wait 30 seconds.", "tool_calls": []}
            return {"response": f"I encountered an issue: {error_msg[:50]}", "tool_calls": []}
