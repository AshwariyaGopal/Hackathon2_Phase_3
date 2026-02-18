import uvicorn
import os
import sys

if __name__ == "__main__":
    # Ensure the directory is in sys.path
    sys.path.append(os.path.dirname(os.path.abspath(__file__)))
    
    print("Starting backend in stable mode (no reload)...")
    uvicorn.run("main:app", host="127.0.0.1", port=8000, reload=False)
