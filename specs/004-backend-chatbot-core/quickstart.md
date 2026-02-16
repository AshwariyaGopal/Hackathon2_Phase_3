# Quickstart: Todo AI Chatbot - Backend & AI Core

## Prerequisites

1.  **Python 3.12+**
2.  **Gemini API Key**: Obtain from [Google AI Studio](https://aistudio.google.com/).
3.  **Neon DB**: Access to the PostgreSQL instance.

## Environment Setup

Add the following to your `backend/.env` file:

```env
GEMINI_API_KEY=your_key_here
BETTER_AUTH_SECRET=By1kFh4jR822D93OLUbnnHNyD9H1Oej9
DATABASE_URL=postgresql://...
```

Install dependencies:

```bash
cd backend
pip install fastapi uvicorn sqlmodel python-dotenv pyjwt google-generativeai mcp
```

## Running the Backend

```bash
uvicorn main:app --reload
```

## Testing the Chat Endpoint

Use cURL or Postman to send a message. You must provide a valid JWT in the `Authorization` header.

```bash
curl -X POST http://localhost:8000/api/user123/chat \
  -H "Authorization: Bearer <YOUR_JWT>" \
  -H "Content-Type: application/json" \
  -d 
  {
    "message": "Add a task to buy groceries"
  }
```

**Expected Response**:

```json
{
  "conversation_id": 1,
  "response": "I've added 'buy groceries' to your task list!",
  "tool_calls": [
    {
      "tool": "add_task",
      "args": { "title": "buy groceries" },
      "result": { "task_id": 123, "status": "created" }
    }
  ]
}
```
