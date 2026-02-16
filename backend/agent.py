import os
import logging
import traceback
from datetime import datetime
import google.generativeai as genai
from google.generativeai import protos
from google.generativeai.types import content_types
from google.protobuf.struct_pb2 import Struct
from sqlalchemy.ext.asyncio import AsyncSession
from typing import List, Dict, Any, Optional
from dotenv import load_dotenv

from mcp_tools import GEMINI_TOOLS, TOOL_FUNCTIONS

load_dotenv()
logger = logging.getLogger(__name__)

class GeminiAgent:
    def __init__(self):
        api_key = os.getenv("GEMINI_API_KEY")
        if not api_key:
            logger.error("GEMINI_API_KEY not set in environment")
            raise ValueError("GEMINI_API_KEY not set")
        
        genai.configure(api_key=api_key)
        
        self.model = genai.GenerativeModel(
            model_name="gemini-flash-latest",
            tools=GEMINI_TOOLS,
            system_instruction="""
            You are TaskZen AI, a professional and highly capable AI Assistant.
            Your goal is to help users manage their lives efficiently while also being a knowledgeable companion.

            Core Capabilities:
            1. **Basic CRUD**: You can **Add**, **Delete**, **Update**, **View**, and **Mark as Complete** any task.
            2. **Intelligent Organization**: You handle **priorities (low, medium, high)**, **categories/labels**, and **due dates**.
            3. **Advanced Features**: You support **Recurring Tasks** (daily, weekly, monthly).
            4. **Proactive Management**: When a user mentions a need, suggest adding it with organization details (priority, category, etc.).
            5. **Search & Filter**: You can search tasks by keyword or filter them by status, priority, or category.

            Operational Instructions:
            - To update or delete a specific task by name, you MUST first use `list_tasks` with the `search` parameter to find the correct `task_id` (which is a UUID). DO NOT try to use the task name as an ID.
            - When a task is completed, use the `complete_task` or `update_task` tool.
            - ALWAYS confirm your actions in natural language, mentioning the specific task name and details.
            - Be professional, concise, and helpful.
            - Today is {date}.
            """.format(date=str(datetime.now().date()))
        )

    async def process_message(
        self, 
        session: AsyncSession, 
        user_id: str, 
        message: str, 
        history: List[Dict[str, str]]
    ) -> Dict[str, Any]:
        """
        Process a user message with history, execute tools if needed, and return the response.
        """
        logger.info(f"[Agent] Processing message for user {user_id}: {message[:50]}...")
        
        try:
            # 1. Convert history to Gemini format
            gemini_history = []
            for h in history:
                role = "user" if h["role"] == "user" else "model"
                gemini_history.append({
                    "role": role,
                    "parts": [h["content"]]
                })
                
            chat = self.model.start_chat(history=gemini_history)
            
            # 2. Send initial message
            logger.info("[Agent] Sending message to Gemini...")
            start_time = datetime.now()
            response = await chat.send_message_async(message)
            duration = (datetime.now() - start_time).total_seconds()
            logger.info(f"[Agent] Gemini initial response received in {duration:.2f}s")

            tool_calls_executed = []
            
            # 3. Handle Tool Calls Loop
            max_turns = 5
            turn = 0
            
            while turn < max_turns:
                turn += 1
                logger.info(f"[Agent] Turn {turn} processing...")
                
                # Extract function calls from the current response
                function_calls = []
                if hasattr(response, 'parts'):
                    for part in response.parts:
                        if part.function_call:
                            function_calls.append(part.function_call)
                
                if not function_calls:
                    logger.info("[Agent] No more function calls, returning final response.")
                    try:
                        text_response = response.text
                    except (AttributeError, ValueError):
                        text_response = "I have processed your request."
                        
                    return {
                        "response": text_response or "I have processed your request.",
                        "tool_calls": tool_calls_executed
                    }
                
                # Prepare responses for all function calls in this turn
                response_parts = []
                
                for fc in function_calls:
                    fn_name = fc.name
                    fn_args = dict(fc.args)
                    
                    logger.info(f"[Agent] Executing tool: {fn_name}")
                    
                    if fn_name in TOOL_FUNCTIONS:
                        try:
                            result = await TOOL_FUNCTIONS[fn_name](session, user_id, **fn_args)
                        except Exception as e:
                            logger.error(f"[Agent] Tool execution error: {e}")
                            result = {"error": str(e)}
                    else:
                        result = {"error": f"Tool {fn_name} not found"}
                    
                    tool_calls_executed.append({
                        "tool": fn_name,
                        "args": fn_args,
                        "result": result
                    })
                    
                    # Create a proper dictionary for function response
                    response_parts.append({
                        "function_response": {
                            "name": fn_name,
                            "response": {"result": result}
                        }
                    })
                
                # Send all function results back to Gemini
                logger.info(f"[Agent] Sending {len(response_parts)} tool results back...")
                response = await chat.send_message_async(response_parts)
            
            return {
                "response": "I processed your request but got stuck in a multi-turn tool loop.",
                "tool_calls": tool_calls_executed
            }
        except Exception as e:
            error_msg = str(e)
            logger.error(f"[Agent] CRITICAL ERROR: {error_msg}")
            logger.error(traceback.format_exc())
            
            if "quota" in error_msg.lower() or "429" in error_msg:
                return {"response": "I'm hitting my rate limit (quota exceeded). Please wait a minute before trying again.", "tool_calls": []}
                
            return {"response": f"I encountered a brain error: {error_msg[:100]}", "tool_calls": []}
