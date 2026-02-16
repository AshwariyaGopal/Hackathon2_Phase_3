# Implementation Plan: Todo AI Chatbot - Backend & AI Core

**Branch**: `004-backend-chatbot-core` | **Date**: 2026-02-03 | **Spec**: [specs/004-backend-chatbot-core/spec.md](spec.md)
**Input**: Feature specification from `/specs/004-backend-chatbot-core/spec.md`

## Summary

This feature implements the secure, stateless backend core for an AI-powered conversational todo chatbot. The approach involves extending the existing FastAPI/SQLModel backend with `Conversation` and `Message` models, implementing 5 MCP tools via the Official MCP SDK for task management, and integrating Gemini 2.0 (via `google-generativeai`) to handle intent detection and tool execution. All operations are strictly scoped to the authenticated user via JWT.

## Technical Context

**Language/Version**: Python 3.12+  
**Primary Dependencies**: FastAPI, SQLModel (async), Official MCP SDK, `google-generativeai` (Gemini), `python-dotenv`, `pyjwt`  
**Storage**: Neon Serverless PostgreSQL (Async)  
**Testing**: `pytest` (async) for unit and integration tests  
**Target Platform**: Cloud/Server (Vercel/Neon)  
**Project Type**: Web Application (Backend-focused in this spec)  
**Performance Goals**: API response under 5s (p95, excluding LLM overhead)  
**Constraints**: Stateless backend, async DB sessions, Gemini for all agent logic (no OpenAI), secure user isolation.  
**Scale/Scope**: 5 core task operations, multi-turn conversation persistence.

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

| Principle | Check | Result |
|-----------|-------|--------|
| Spec-driven development | Spec exists at `specs/004-backend-chatbot-core/spec.md` | PASS |
| Stateless & persistent | Server is stateless; history in Neon DB | PASS |
| Secure user isolation | All tools and endpoints use `user_id` from JWT | PASS |
| Natural & confirmatory | Prompt engineered for natural confirmations | PASS |
| Seamless integration | Extends Phase II models and routes | PASS |
| Gemini-first | Exclusively uses Gemini for agent logic | PASS |

## Project Structure

### Documentation (this feature)

```text
specs/004-backend-chatbot-core/
├── spec.md              # Feature specification
├── plan.md              # This file
├── research.md          # Phase 0 output
├── data-model.md        # Phase 1 output
├── quickstart.md        # Phase 1 output
├── checklists/
│   └── requirements.md  # Spec quality checklist
├── contracts/           # Phase 1 output
└── tasks.md             # Phase 2 output (future)
```

### Source Code (repository root)

```text
backend/
├── main.py              # App entry, CORS, and router inclusion
├── models.py            # SQLModel schema (Conversation, Message)
├── db.py                # Database session management
├── agent.py             # Gemini agent logic and tool orchestration
├── mcp_tools.py         # 5 MCP tools using Official MCP SDK
├── routes/
│   ├── chat.py          # Chat endpoint logic
│   └── tasks.py         # Existing task routes
└── middleware/
    └── jwt_auth.py      # Existing JWT verification
```

**Structure Decision**: Option 2 (Web application) is selected as the project is a full-stack monorepo. This plan focuses on the `backend/` directory for core AI and logic implementation.

## Complexity Tracking

*No violations detected.*