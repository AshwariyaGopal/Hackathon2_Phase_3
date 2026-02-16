---
id: 004-SPEC-001
title: specify-backend-chatbot-core
stage: spec
date: 2026-02-03
surface: cli
model: gemini-2.0-flash
feature: 004-backend-chatbot-core
branch: 004-backend-chatbot-core
user: Dell-Latitude
command: /sp.specify
labels: [backend, ai, chatbot, mcp, spec]
links:
  spec: specs/004-backend-chatbot-core/spec.md
  ticket: 
  adr: 
  pr: 
files:
  - path: specs/004-backend-chatbot-core/spec.md
    action: create
  - path: specs/004-backend-chatbot-core/checklists/requirements.md
    action: create
tests:
  - type: manual
    description: Verification of specification quality and completeness
    status: pass
---

## Prompt

Todo AI Chatbot - Backend & AI Core (Spec 1: backend-chatbot-core) Target: Fully implement the secure, stateless backend core for the AI-powered conversational todo chatbot, including database models for conversations/messages, 5 MCP tools, chat endpoint, Gemini-powered agent logic (via Gemini CLI + API key), and seamless integration with existing Phase II FastAPI + Neon PostgreSQL setup. Focus: Build everything needed on the server side so that natural language messages can be processed, appropriate tools called, responses generated, and conversation history persisted — all scoped to authenticated user and ready for frontend ChatKit integration. Success criteria: Stateless POST /api/{user_id}/chat endpoint works perfectly Accepts JSON: { "conversation_id"?: number, "message": string } Returns JSON: { "conversation_id": number, "response": string, "tool_calls"?: array } Requires valid JWT; user_id from token must match path parameter Conversation & message persistence in Neon DB: Conversation model: user_id (string), id (PK), created_at, updated_at Message model: user_id, id (PK), conversation_id (FK), role ("user"/"assistant"), content (text), created_at Async SQLModel operations with proper indexing (user_id, conversation_id + created_at) Exactly 5 MCP tools implemented (using Official MCP SDK): add_task(user_id: str, title: str, description?: str) → {"task_id": int, "status": "created", "title": str} list_tasks(user_id: str, status?: "all"|"pending"|"completed") → array of task objects complete_task(user_id: str, task_id: int) → {"task_id": int, "status": "completed", "title": str} delete_task(user_id: str, task_id: int) → {"task_id": int, "status": "deleted", "title": str} update_task(user_id: str, task_id: int, title?: str, description?: str) → {"task_id": int, "status": "updated", "title": str} All tools validate user_id ownership, use existing Task model, return consistent format, and raise proper errors (404 not found, 403 unauthorized) Gemini agent logic (via Gemini CLI + your API key): Agent prompt configured to detect intent from user message Decides whether to reply directly or call one/more MCP tools Always confirms actions in natural language ("I've added 'Buy milk' for you!") Handles ambiguous input by asking clarifying questions Gracefully manages errors ("Sorry, I couldn't find task #99") Conversation history (last N messages) fetched from DB and included in prompt Security & integration: Reuse existing JWT middleware (BETTER_AUTH_SECRET from .env) CORS configured for frontend origin Async database sessions throughout Proper HTTP exceptions and logging Constraints: Technology: FastAPI, SQLModel (async), Official MCP SDK, Gemini API (via your Gemini CLI/API key) No OpenAI Agents SDK — use Gemini exclusively for reasoning/tool calling Reuse existing .env values (BETTER_AUTH_SECRET, DATABASE_URL) All tools and endpoint must be stateless No frontend code or ChatKit integration in this spec No advanced features (due dates, priorities, recurring, multi-turn planning) Not building in this spec: Frontend ChatKit UI / chat page Real-time / WebSocket Voice or multi-modal input Rate limiting or abuse detection Conversation search or branching Guidance & priorities: Database models & migration (extend Phase II schema) MCP tools implementation (5 functions) Chat endpoint logic (fetch history → Gemini prompt → tool execution → save response → return) Gemini prompt engineering (clear intent detection + confirmation style) End-to-end backend testing (Postman/cURL with valid JWT) Documentation update in README (endpoint usage, Gemini CLI notes)

## Response snapshot

I have created the feature branch `004-backend-chatbot-core` and generated the initial feature specification.

Key actions taken:
1. Identified the next feature number (004) and created the feature directory.
2. Fixed a PowerShell compatibility issue in the `create-new-feature.ps1` script regarding `Join-Path`.
3. Wrote a comprehensive, technology-agnostic feature specification at `specs/004-backend-chatbot-core/spec.md`.
4. Created and completed a quality checklist at `specs/004-backend-chatbot-core/checklists/requirements.md`.

The specification defines user stories for the secure chat API, task management via AI tools, and conversation persistence, with clear measurable success criteria and functional requirements.

## Outcome

- ✅ Impact: High. Established the foundational specification for the AI Chatbot backend core.
- 🧪 Tests: Checklist validated; specification is complete and technology-agnostic.
- 📁 Files: Created `spec.md` and `requirements.md`.
- 🔁 Next prompts: /sp.plan to create the implementation plan.
- 🧠 Reflection: The initial script failed due to PowerShell version differences on the host; fixing it proactively ensured the workflow remained smooth.

## Evaluation notes (flywheel)

- Failure modes observed: Shell script compatibility (Join-Path multiple arguments).
- Graders run and results (PASS/FAIL): PASS.
- Prompt variant (if applicable): N/A.
- Next experiment (smallest change to try): N/A.
