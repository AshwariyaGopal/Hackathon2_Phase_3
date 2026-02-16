# Research: Todo AI Chatbot - Backend & AI Core

**Feature**: 004-backend-chatbot-core
**Date**: 2026-02-03

## Research Tasks

### 1. Official MCP SDK Integration with FastAPI
- **Objective**: Determine the best way to host MCP tools within a FastAPI application.
- **Decision**: Use the `mcp` Python SDK to define tools as functions. Since the backend needs to be stateless, we will not host a long-running MCP server process, but rather use the SDK's tool definition patterns to wrap our async database logic.
- **Rationale**: Keeps the architecture simple and integrates directly with Gemini's tool-calling capabilities.

### 2. Gemini Tool Calling Patterns
- **Objective**: Identify the most reliable prompt structure for Gemini to trigger the 5 todo tools.
- **Decision**: Use the `tools` parameter in the Gemini API (via `google-generativeai`).
- **Rationale**: This provides structured output that can be easily parsed and mapped to our MCP tool functions, ensuring high accuracy for intent detection.

### 3. Conversation History Management (Context Windows)
- **Objective**: Define how many messages to store and retrieve to balance context vs. token usage.
- **Decision**: Retrieve the last 10 messages from the `Message` table for each chat request.
- **Rationale**: 10 messages (5 turns) provide sufficient context for follow-up actions (e.g., "delete that") without overwhelming the prompt or incurring excessive latency.

### 4. User Isolation in Tools
- **Objective**: Ensure `user_id` is propagated correctly from the JWT to the tools.
- **Decision**: Inject `user_id` as a required parameter into every MCP tool function. The `chat` endpoint logic will extract this from the validated JWT and pass it explicitly.
- **Rationale**: Prevents accidental data leakage and adheres to the "Secure user isolation" principle.

## Summary of Decisions

| Topic | Chosen Path |
|-------|-------------|
| Tool Framework | Official MCP SDK (Python) |
| AI Integration | Gemini API (`google-generativeai`) with Tool Calling |
| Context Memory | Last 10 messages from PostgreSQL |
| Security | JWT-based `user_id` injection into tools |
