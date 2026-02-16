# Implementation Plan: Todo AI Chatbot - Backend & AI Core

**Branch**: `003-backend-chatbot-core` | **Date**: 2026-01-21 | **Spec**: [specs/003-backend-chatbot-core/spec.md](../spec.md)
**Input**: Feature specification from `specs/003-backend-chatbot-core/spec.md`

**Note**: This template is filled in by the `/sp.plan` command. See `.specify/templates/commands/plan.md` for the execution workflow.

## Summary

This plan outlines the implementation of the backend core for the AI-powered todo chatbot. It involves extending the database schema with Conversation and Message models, implementing 5 MCP tools (add, list, complete, delete, update), creating a stateless chat endpoint, and integrating Gemini agent logic using the Gemini CLI and API key. The focus is on a secure, stateless, and persistent architecture that supports natural language todo management.

## Technical Context

**Language/Version**: Python 3.12+ (Backend), TypeScript 5.0+ (Frontend)
**Primary Dependencies**: FastAPI, SQLModel, Uvicorn, Python-Dotenv, PyJWT, Official MCP SDK, Google Generative AI (Gemini)
**Storage**: Neon Serverless PostgreSQL (Async SQLModel)
**Testing**: Pytest (Backend), Manual Integration Testing
**Target Platform**: Web (Next.js Frontend + FastAPI Backend)
**Project Type**: Full-stack Web Application
**Performance Goals**: API response < 5s (excluding LLM latency)
**Constraints**: Stateless backend, JWT authentication, Gemini CLI/API for AI, No OpenAI Agents SDK, Reuse existing .env
**Scale/Scope**: Single user session per request, 5 basic todo operations

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

- [x] **Strict spec-driven development**: Feature is defined in `specs/003-backend-chatbot-core/spec.md`.
- [x] **Stateless & persistent architecture**: Plan enforces stateless endpoint and DB persistence for conversations.
- [x] **Secure user isolation**: JWT validation and user_id scoping are mandatory in all tools and endpoints.
- [x] **Natural & confirmatory AI interaction**: Gemini agent prompt will be designed for natural confirmation.
- [x] **Seamless integration**: Reusing existing FastAPI, Neon, and Better Auth setup.
- [x] **Gemini-first AI-assisted workflow**: Gemini CLI/API specified for agent logic.

## Project Structure

### Documentation (this feature)

```text
specs/003-backend-chatbot-core/
├── plan.md              # This file
├── research.md          # Phase 0 output
├── data-model.md        # Phase 1 output
├── quickstart.md        # Phase 1 output
├── contracts/           # Phase 1 output
└── tasks.md             # Phase 2 output
```

### Source Code (repository root)

```text
backend/
├── main.py                  # App entry point (CORS updates)
├── models.py                # Schema extensions (Conversation, Message)
├── mcp_tools.py             # New MCP tools implementation
├── agent.py                 # New Gemini agent logic
└── routes/
    └── chat.py              # New chat endpoint

frontend/
└── app/
    └── chat/
        └── page.tsx         # New chat interface (Phase III integration)
```

**Structure Decision**: Extending existing `backend/` structure and adding a new route in `frontend/`.

## Complexity Tracking

> **Fill ONLY if Constitution Check has violations that must be justified**

| Violation | Why Needed | Simpler Alternative Rejected Because |
|-----------|------------|-------------------------------------|
| None      | N/A        | N/A                                 |