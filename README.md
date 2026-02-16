# Evolution of Todo - Full-Stack Application

A stunning, professional, and visually polished multi-user todo application built with Next.js and FastAPI.

## Project Structure

- `frontend/`: Next.js 16+ application (App Router, Tailwind CSS v4, Better Auth)
- `backend/`: FastAPI application (SQLModel, Neon PostgreSQL, JWT Auth)
- `specs/`: Feature specifications and implementation plans

## Backend Setup (FastAPI)

1.  **Navigate to the backend directory**:
    ```bash
    cd backend
    ```
2.  **Create and activate virtual environment**:
    ```bash
    python -m venv venv
    # Windows
    venv\Scripts\activate
    # Linux/macOS
    source venv/bin/activate
    ```
3.  **Install dependencies**:
    ```bash
    pip install -r requirements.txt
    ```
4.  **Configure environment variables**:
    Create a `.env` file in the `backend/` directory:
    ```env
    BETTER_AUTH_SECRET=By1kFh4jR822D93OLUbnnHNyD9H1Oej9
    BETTER_AUTH_URL=http://localhost:3000
    DATABASE_URL=postgresql://your_neon_db_url
    GEMINI_API_KEY=your_gemini_api_key_here
    ```
5.  **Run the development server**:
    ```bash
    uvicorn main:app --reload --port 8000
    ```

## Frontend Setup (Next.js)

1.  **Navigate to the frontend directory**:
    ```bash
    cd frontend
    ```
2.  **Install dependencies**:
    ```bash
    npm install
    ```
3.  **Configure environment variables**:
    Create a `.env.local` file in the `frontend/` directory:
    ```env
    NEXT_PUBLIC_API_URL=http://localhost:8000/api
    BETTER_AUTH_URL=http://localhost:3000
    ```
4.  **Run the development server**:
    ```bash
    npm run dev
    ```

## Integration

The frontend and backend integrate seamlessly via JWT tokens.
- Frontend handles user authentication via Better Auth.
- Backend verifies JWT tokens using the shared `BETTER_AUTH_SECRET`.
- All task operations are scoped to the authenticated user.

### Chat Interface

A premium conversational UI is available at `/chat`.
- **Protected Route**: Only authenticated users can access the AI assistant.
- **Persistent Context**: Conversation state is maintained across sessions.
- **Optimistic UI**: Real-time feedback when sending messages.
- **Responsive Design**: Optimized for both mobile and desktop with a focus on visual harmony.

## Development

- **Frontend**: Next.js 16 (App Router), Tailwind CSS v4, shadcn/ui components.
- **Backend**: FastAPI, SQLModel, Gemini 2.0 Agent logic.
- **Design**: Premium "Phase III" aesthetic with smooth animations and dark mode support.


### Supported Operations

- **Add Task**: "Add buy groceries to my list"
- **List Tasks**: "What are my pending tasks?" or "Show all my todos"
- **Complete Task**: "Mark task #5 as done"
- **Update Task**: "Rename task #2 to 'Buy Almond Milk'"
- **Delete Task**: "Remove the task about groceries"

### Chat API

**Endpoint**: `POST /api/{user_id}/chat`
**Auth**: Requires `Authorization: Bearer <session_token>` header.

**Request Body**:
```json
{
  "message": "Add a task to buy milk",
  "conversation_id": null
}
```

**Response Body**:
```json
{
  "conversation_id": 1,
  "response": "I've added 'buy milk' to your list!",
  "tool_calls": [
    {
      "tool": "add_task",
      "args": { "title": "buy milk" },
      "result": { "task_id": "...", "status": "created" }
    }
  ]
}
```

### Multi-turn Conversations

The chatbot persists conversation history in the database. Provide the `conversation_id` in subsequent requests to maintain context (e.g., "Change that task to 'Buy Soy Milk'").

### Prerequisites

- **Gemini API Key**: Set `GEMINI_API_KEY` in `backend/.env`.
- **Dependencies**: `pip install google-generativeai mcp` (already in `requirements.txt`).
- **Database**: Conversations and Messages are stored in the same Neon PostgreSQL instance as tasks.