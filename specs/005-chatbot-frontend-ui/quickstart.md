# Quickstart: Todo AI Chatbot - Frontend UI

## Installation

Ensure frontend dependencies are installed:
```bash
cd frontend
npm install
```

## Running the App

1. Start the backend (see `specs/004-backend-chatbot-core/quickstart.md`).
2. Start the frontend:
```bash
npm run dev
```

## Accessing Chat

1. Log in to the application.
2. Navigate to `http://localhost:3000/chat`.
3. You should see the welcome message and input field.

## Manual Test Scenario

1. **Verify Auth**: Attempt to visit `/chat` without logging in. You should be redirected.
2. **First Message**: Type "Hello, who are you?" and press Enter.
   - User bubble should appear immediately.
   - Loading indicator should appear.
   - Assistant bubble should appear with a response.
3. **Persistence**: Refresh the page. The message history should remain.
4. **Action Test**: Type "Add task: Wash the car".
   - Verify Gemini confirms the action.
   - Check the main dashboard to see if the task was added.
5. **Mobile View**: Open Chrome DevTools, toggle device toolbar (Mobile), and verify the chat layout and input are still usable.
