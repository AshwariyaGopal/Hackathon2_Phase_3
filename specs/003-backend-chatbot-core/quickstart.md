# Quickstart: Backend Chatbot Core

**Feature**: `003-backend-chatbot-core`

## Prerequisites

1.  **Environment Variables**: Ensure your `.env` in `backend/` has:
    ```env
    GEMINI_API_KEY=your_key_here
    DATABASE_URL=postgresql://...
    BETTER_AUTH_SECRET=...
    ```
2.  **Dependencies**:
    ```bash
    cd backend
    pip install google-generativeai official-mcp-sdk
    ```

## Running the Chatbot Backend

1.  **Start the Server**:
    ```bash
    cd backend
    uvicorn main:app --reload
    ```
    The server will auto-create the `conversation` and `message` tables on startup.

2.  **Test via cURL**:
    You need a valid JWT token (get one by logging into the frontend and checking localStorage or network tab).
    ```bash
    curl -X POST "http://localhost:8000/api/{USER_ID}/chat" \
         -H "Authorization: Bearer {YOUR_JWT}" \
         -H "Content-Type: application/json" \
         -d '{ "message": "Add a task to buy coffee" }'
    ```

## Development Workflow

1.  **Modify Tools**: Edit `backend/mcp_tools.py` to change tool logic.
2.  **Modify Agent**: Edit `backend/agent.py` to tweak the system prompt or model parameters.
3.  **Inspect DB**: Use a SQL client to view `conversation` and `message` tables to debug history persistence.

