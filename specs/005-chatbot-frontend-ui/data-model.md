# Data Model: Todo AI Chatbot - Frontend UI

## Entities

### ClientMessage (UI State)
Represents a message turn in the local component state.

| Field | Type | Description |
|-------|------|-------------|
| `id` | string | Client-side unique ID (UUID or timestamp) |
| `role` | "user" | "assistant" | Who sent the message |
| `content` | string | The message text |
| `timestamp` | Date | When it was sent/received |
| `status` | "sending" | "sent" | "error" | For optimistic UI feedback |

### ClientConversation (UI State)
Represents the current active chat session.

| Field | Type | Description |
|-------|------|-------------|
| `conversation_id` | number | Null if new conversation |
| `messages` | ClientMessage[] | Ordered list of messages |
| `isLoading` | boolean | True while waiting for API response |

## Persistence

- **localStorage**: Key `todo-ai-conversation-id` stores the most recent `conversation_id`.
- **Memory**: The message history is kept in React state and re-fetched from the backend if a `conversation_id` is present but history is empty.
