import os
import google.generativeai as genai
from dotenv import load_dotenv
from mcp_tools import GEMINI_TOOLS

load_dotenv()
api_key = os.getenv("GEMINI_API_KEY")
genai.configure(api_key=api_key)

print("Attempting to initialize model with tools...")
try:
    model = genai.GenerativeModel(
        model_name="models/gemini-2.0-flash",
        tools=GEMINI_TOOLS
    )
    print("SUCCESS: Model initialized with tools.")
    
    # Try a tiny chat to see if it rejects the tools
    chat = model.start_chat()
    print("SUCCESS: Chat started.")
    
except Exception as e:
    print(f"FAILED: {e}")
    import traceback
    traceback.print_exc()
