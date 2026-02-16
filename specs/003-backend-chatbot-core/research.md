# Research: Todo AI Chatbot - Backend & AI Core

**Feature**: `003-backend-chatbot-core`
**Created**: 2026-01-21

## Key Decisions

### Gemini Agent Implementation

- **Decision**: Use `google-generativeai` Python library directly within a custom `Agent` class in `backend/agent.py`.
- **Rationale**: The Constitution mandates "Gemini-first" and explicitly forbids OpenAI Agents SDK. Direct API usage gives fine-grained control over the prompt, history injection, and tool calling mechanism (which we need to bridge to MCP tools).
- **Alternatives considered**:
    - *LangChain/LangGraph*: Too heavy and introduces unnecessary abstractions for a focused 5-tool agent.
    - *OpenAI Agents SDK*: Forbidden by Constitution.

### MCP Tool Integration

- **Decision**: Implement tools as standard Python async functions decorated/registered for use by the Agent, strictly following the "Official MCP SDK" patterns where applicable, but primarily exposing them as function calls to Gemini.
- **Rationale**: Gemini supports function calling. We will define the tools (add_task, etc.) and pass their schemas to Gemini's `tools` parameter. When Gemini returns a tool call, we execute the corresponding Python function.
- **Alternatives considered**:
    - *Standalone MCP Server*: Overkill for an internal chatbot. We need direct in-process execution for the API response loop.

### Conversation Persistence

- **Decision**: Store `Conversation` and `Message` entities in Neon DB with `user_id` as a partition key equivalent.
- **Rationale**: Stateless architecture requires fetching history on every request. SQLModel (SQLAlchemy async) is already the project standard.
- **Alternatives considered**:
    - *Redis/In-memory*: Violated "persistent architecture" and "stateless server" principles (if local memory). Redis would be an extra dependency.

### Frontend Integration Strategy

- **Decision**: Use OpenAI's ChatKit (or a compatible UI library like `ai/rsc` or similar generic chat UI) for the visual components, but drive it via the custom `POST /api/{user_id}/chat` endpoint.
- **Rationale**: The user requested "OpenAI ChatKit UI" for the frontend look and feel. We will adapt it to consume our custom backend API.

## Unknowns & Clarifications

### Resolved
- **Q**: How to handle "Official MCP SDK" requirement vs Internal Function Calling?
  - **A**: The spec asks for "Exactly 5 MCP tools implemented (using Official MCP SDK)". We will implement them compatible with MCP standards (schemas, typing) but invoke them directly via Gemini's function calling capability within the chat loop to ensure a seamless request-response cycle.

- **Q**: "Gemini CLI" vs "API Key"?
  - **A**: The instruction "Use Gemini CLI + your API key" implies using the API key *provided by the developer* (me) for the backend agent logic. The CLI is likely for development/testing or prompting guidance. I will use the `GEMINI_API_KEY` env var for the backend.

## Best Practices Checklist

- [x] **Async Everything**: All DB ops and Tool calls must be `async def`.
- [x] **User Scoping**: Every query must have `.where(Task.user_id == user_id)`.
- [x] **Error Handling**: Tools should return graceful error strings ("Task not found") rather than crashing, so the LLM can explain it to the user.
- [x] **Security**: JWT is verified *before* any agent logic runs.
