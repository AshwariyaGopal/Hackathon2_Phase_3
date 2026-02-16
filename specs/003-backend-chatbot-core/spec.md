# Feature Specification: Todo AI Chatbot - Backend & AI Core

**Feature Branch**: `003-backend-chatbot-core`
**Created**: 2026-01-21
**Status**: Draft
**Input**: Fully implement the secure, stateless backend core for the AI-powered conversational todo chatbot.

## User Scenarios & Testing

### User Story 1 - Secure Chat API Endpoint (Priority: P1)

As an authenticated user, I want to send natural language messages to the backend API so that I can interact with my todo list via AI.

**Why this priority**: This is the entry point for all chatbot functionality.

**Independent Test**: Use Postman/cURL to send a POST request to `/api/{user_id}/chat` with a valid JWT. Verify it accepts the message and returns a structured JSON response (even if just a mock reply initially).

**Acceptance Scenarios**:
1. **Given** a valid JWT and matching `user_id`, **When** I POST to `/api/{user_id}/chat`, **Then** I receive a 200 OK response with `conversation_id` and `response`.
2. **Given** an invalid JWT or mismatched `user_id`, **When** I POST to `/api/{user_id}/chat`, **Then** I receive a 401/403 Error.
3. **Given** a malformed JSON body, **When** I POST to `/api/{user_id}/chat`, **Then** I receive a 422 Validation Error.

### User Story 2 - MCP Tools Implementation (Priority: P1)

As the AI agent, I need a set of standardized tools to manipulate the user's todo list safely.

**Why this priority**: The AI cannot perform any actions without these tools.

**Independent Test**: Write unit tests for each of the 5 functions (`add_task`, `list_tasks`, etc.) verifying they modify the database correctly and return the expected JSON format.

**Acceptance Scenarios**:
1. **Given** a user_id and title, **When** `add_task` is called, **Then** a new task is created in DB and confirmation JSON is returned.
2. **Given** a user_id, **When** `list_tasks` is called, **Then** a list of tasks for that user is returned (excluding other users' tasks).
3. **Given** a task_id belonging to another user, **When** `delete_task` is called, **Then** a 403/404 error is raised.

### User Story 3 - Gemini Agent Logic & Persistence (Priority: P2)

As a user, I want the AI to understand my intent, execute the right tools, and remember our conversation context.

**Why this priority**: This connects the API (US1) with the Tools (US2) to create the actual intelligence.

**Independent Test**: Send a sequence of messages (e.g., "Add milk", "Change it to Buy milk", "List my tasks") and verify the AI performs the correct actions and the conversation history is saved in the DB.

**Acceptance Scenarios**:
1. **Given** a user message "Add Buy Milk", **When** processed, **Then** the AI calls `add_task` and replies "I've added 'Buy Milk' to your list."
2. **Given** a conversation history, **When** I say "Delete the last one", **Then** the AI understands which task to delete based on context.
3. **Given** any interaction, **When** completed, **Then** the new User and Assistant messages are saved to the `Message` table.

## Requirements

### Functional Requirements

- **FR-001**: System MUST expose a stateless `POST /api/{user_id}/chat` endpoint accepting `{ "conversation_id"?: number, "message": string }`.
- **FR-002**: System MUST return `{ "conversation_id": number, "response": string, "tool_calls"?: array }` on success.
- **FR-003**: System MUST enforce JWT authentication and ensure `user_id` in token matches the route parameter.
- **FR-004**: System MUST implement exactly 5 MCP tools: `add_task`, `list_tasks`, `complete_task`, `delete_task`, `update_task`.
- **FR-005**: All MCP tools MUST validate that the operation is strictly scoped to the provided `user_id`.
- **FR-006**: System MUST persist conversations and messages in `Conversation` and `Message` tables in Neon PostgreSQL.
- **FR-007**: System MUST use Gemini CLI/API for all natural language processing and tool selection.
- **FR-008**: The Agent MUST always confirm actions in natural language (e.g., "I've updated the task...").
- **FR-009**: System MUST handle ambiguous inputs by asking clarifying questions instead of guessing.

### Key Entities

- **Conversation**: `user_id` (str), `id` (int, PK), `created_at` (datetime), `updated_at` (datetime).
- **Message**: `user_id` (str), `id` (int, PK), `conversation_id` (int, FK), `role` (str: "user"|"assistant"), `content` (text), `created_at` (datetime).

## Success Criteria

### Measurable Outcomes

- **SC-001**: API Endpoint consistently responds within 5 seconds (excluding LLM latency) for all basic operations.
- **SC-002**: 100% of successful state-changing operations (add, update, delete, complete) result in a persisted DB change and a confirming chat response.
- **SC-003**: Unauthorized access attempts (wrong JWT, wrong user_id) are rejected with 401/403 status codes 100% of the time.
- **SC-004**: Conversation history is reliably retrieved; users can reference a message from 5 turns ago.

## Assumptions

- **Authentication**: We are reusing the existing Better Auth setup and `BETTER_AUTH_SECRET`.
- **Database**: The `Task` model already exists; we are just adding `Conversation` and `Message`.
- **LLM**: We are using Gemini 2.0 (or latest available via CLI) and the user provides their own API key.
- **Tools**: No new external APIs (like Calendar or Email) are required, only the internal Todo database.
