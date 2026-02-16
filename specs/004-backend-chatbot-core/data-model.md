# Data Model: Todo AI Chatbot - Backend & AI Core

## Entities

### Conversation
Represents a multi-turn chat session between a user and the AI.

| Field | Type | Constraints | Description |
|-------|------|-------------|-------------|
| `id` | Integer | Primary Key, Auto-increment | Unique session ID |
| `user_id` | String | Indexed | The ID of the user (from Better Auth) |
| `created_at` | DateTime | Default: Now | When the chat session started |
| `updated_at` | DateTime | Default: Now | When the last message was sent |

**Relationships**:
- Has many `Message` entities.

### Message
Represents an individual message turn.

| Field | Type | Constraints | Description |
|-------|------|-------------|-------------|
| `id` | Integer | Primary Key, Auto-increment | Unique message ID |
| `conversation_id` | Integer | Foreign Key (Conversation.id), Indexed | The session this message belongs to |
| `user_id` | String | Indexed | Owner of the message |
| `role` | String | Enum: "user", "assistant" | Who sent the message |
| `content` | Text | Non-null | The message text |
| `created_at` | DateTime | Default: Now | Timestamp |

**Relationships**:
- Belongs to one `Conversation`.

### Task (Existing)
Extended to support AI interactions.

| Field | Type | Constraints | Description |
|-------|------|-------------|-------------|
| `id` | Integer | Primary Key | Task ID |
| `user_id` | String | Indexed | Owner ID |
| `title` | String | Non-null | Task title |
| `description` | String | Optional | Task details |
| `status` | String | "pending", "completed" | Current state |

## Validation Rules

1. **Ownership**: Every operation on `Conversation`, `Message`, or `Task` MUST verify that the `user_id` matches the authenticated user's ID.
2. **Conversation Continuity**: Messages MUST be appended to the correct `conversation_id`. If no ID is provided, a new `Conversation` must be created.
3. **Role Integrity**: Only "user" and "assistant" roles are permitted in the `Message` table.
