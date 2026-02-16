# Data Model: Todo AI Chatbot

**Feature**: `003-backend-chatbot-core`

## Entities

### Conversation

Represents a chat session for a user.

| Field | Type | Required | Description | Constraints |
|-------|------|----------|-------------|-------------|
| `id` | `int` | Yes | Primary Key | Auto-increment |
| `user_id` | `str` | Yes | User ID | Indexed |
| `created_at` | `datetime` | Yes | Creation timestamp | Default: now() |
| `updated_at` | `datetime` | Yes | Last update timestamp | Default: now(), OnUpdate: now() |

**Relationships**:
- Has many `Message`s

### Message

Represents a single turn in a conversation.

| Field | Type | Required | Description | Constraints |
|-------|------|----------|-------------|-------------|
| `id` | `int` | Yes | Primary Key | Auto-increment |
| `conversation_id` | `int` | Yes | Foreign Key to Conversation | Indexed (with created_at) |
| `user_id` | `str` | Yes | User ID (Denormalized for scoping) | Indexed |
| `role` | `str` | Yes | Sender role | "user" or "assistant" |
| `content` | `str` | Yes | Message text content | Text |
| `created_at` | `datetime` | Yes | Creation timestamp | Default: now() |

**Relationships**:
- Belongs to `Conversation`

## SQLModel Definition (Draft)

```python
class Conversation(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    user_id: str = Field(index=True)
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)
    
    messages: List["Message"] = Relationship(back_populates="conversation")

class Message(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    conversation_id: int = Field(foreign_key="conversation.id", index=True)
    user_id: str = Field(index=True)
    role: str # "user", "assistant"
    content: str
    created_at: datetime = Field(default_factory=datetime.utcnow)
    
    conversation: Optional[Conversation] = Relationship(back_populates="messages")
```

## Validation Rules

- `user_id` in `Message` MUST match `user_id` in `Conversation`.
- `role` MUST be strictly "user" or "assistant".
- `content` CANNOT be empty.
