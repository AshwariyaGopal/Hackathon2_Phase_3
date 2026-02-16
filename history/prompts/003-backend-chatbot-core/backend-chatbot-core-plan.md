---
id: phr-20260121-backend-chatbot-core-plan
title: backend-chatbot-core-plan
stage: plan
date: 2026-01-21
surface: cli
model: gemini-2.0-flash-exp
feature: backend-chatbot-core
branch: 003-backend-chatbot-core
user: user
command: /sp.plan
labels: [plan, backend, chatbot, mcp, gemini, fast-api]
links:
  spec: specs/003-backend-chatbot-core/spec.md
  plan: specs/003-backend-chatbot-core/plan.md
  research: specs/003-backend-chatbot-core/research.md
  data-model: specs/003-backend-chatbot-core/data-model.md
  contracts: specs/003-backend-chatbot-core/contracts/
files:
  - specs/003-backend-chatbot-core/plan.md
  - specs/003-backend-chatbot-core/research.md
  - specs/003-backend-chatbot-core/data-model.md
  - specs/003-backend-chatbot-core/contracts/api-schema.yaml
  - specs/003-backend-chatbot-core/contracts/mcp-tools.md
  - specs/003-backend-chatbot-core/quickstart.md
tests: []
---

## Prompt

Todo AI Chatbot - Phase III Complete Implementation (Backend Core + Frontend Integration)

Target: Fully build and integrate the intelligent conversational AI chatbot for natural language todo management, delivering a seamless, persistent, and delightful experience using Gemini CLI (with your API key) for agent logic, Official MCP SDK for tools, FastAPI backend, Neon DB for state, and ChatKit UI in the frontend.

Focus: Execute the approved /sp.specify (backend-chatbot-core) first, then integrate with frontend ChatKit UI, resulting in a complete end-to-end AI-powered todo assistant that understands commands, calls tools, confirms actions, and persists conversations — all secure, stateless, and beautifully presented.

Step-by-step execution plan:

1. Environment & Dependency Check
   - Verify .env has:
     BETTER_AUTH_SECRET=By1kFh4jR822D93OLUbnnHNyD9H1Oej9
     DATABASE_URL=postgresql://neondb_owner:npg_lcWv5TPS7Ggb@ep-weathered-silence-a76g0a2t-pooler.ap-southeast-2.aws.neon.tech/neondb?sslmode=require&channel_binding=require
     GEMINI_API_KEY=your_actual_key_here
   - Install required packages: fastapi, uvicorn, sqlmodel, python-dotenv, pyjwt, official-mcp-sdk (or equivalent), google-generativeai (for Gemini)
   - Test Gemini CLI connection with your API key
   - Commit: "Phase III environment verified with Gemini API key and .env"

2. Database Models & Schema Extension
   - Extend existing SQLModel schema in /backend/models.py:
     - Conversation: user_id (str), id (PK), created_at, updated_at
     - Message: user_id (str), id (PK), conversation_id (FK), role ("user"/"assistant"), content (text), created_at
   - Add proper indexes (user_id, conversation_id + created_at)
   - Implement async table creation on startup
   - Use Database Engineer agent + sqlmodel-db / neon-async-db skills
   - Commit: "Added Conversation and Message models with async schema"

3. MCP Tools Implementation
   - Create /backend/mcp_tools.py with Official MCP SDK
   - Implement exactly 5 tools (all async, scoped to user_id):
     - add_task
     - list_tasks
     - complete_task
     - delete_task
     - update_task
   - Each tool must:
     - Validate user_id ownership
     - Use existing Task model
     - Return consistent JSON format
     - Raise proper exceptions (404, 403)
   - Use Backend Engineer agent + secure-task-crud skill
   - Commit: "Implemented 5 MCP tools with user isolation"

4. Gemini Agent Logic & Prompt Engineering
   - Create /backend/agent.py
   - Configure Gemini model (via google-generativeai) with your API key
   - Build agent prompt that:
     - Detects intent from message
     - Decides to call MCP tool(s) or reply directly
     - Always confirms actions naturally
     - Handles errors gracefully
     - Includes recent conversation history
   - Use Gemini CLI for testing and refining the prompt
   - Commit: "Gemini agent logic and prompt configured"

5. Stateless Chat Endpoint
   - Implement POST /api/{user_id}/chat in /backend/routes/chat.py
   - Full flow:
     1. Validate JWT & user_id match
     2. Fetch/create conversation
     3. Store user message
     4. Build history + new message
     5. Run Gemini agent with MCP tools
     6. Execute any tool calls
     7. Store assistant response
     8. Return response + tool_calls
   - Use fastapi-jwt-auth + fastapi-routes skills
   - Commit: "Completed stateless chat endpoint with Gemini + MCP integration"

6. CORS & Main App Configuration
   - Update /backend/main.py:
     - Add CORS for frontend origin[](http://localhost:3000)
     - Include chat router with /api prefix
     - Add startup event for schema
   - Commit: "Finalized backend config with CORS and routing"

7. Backend Testing (Manual + Integration)
   - Test endpoint with Postman/cURL using valid JWT from frontend login
   - Verify: add/list/complete/delete/update via natural commands
   - Check conversation persistence & resumption
   - Use Integration Tester agent
   - Commit: "Backend fully tested and stable"

8. Frontend ChatKit Integration
   - Create protected /app/chat/page.tsx
   - Integrate OpenAI ChatKit UI:
     - Message bubbles, input box, send button
     - Load history via conversation_id
     - Show loading while calling /api/{user_id}/chat
     - Display responses and confirmations
   - Use Frontend Engineer agent + nextjs skill
   - Commit: "Implemented beautiful ChatKit chat interface"

9. End-to-End Flow & Polish
   - Test full flow: login → open chat → natural commands → actions confirmed → tasks updated in DB & UI
   - Add beautiful loading/empty states
   - Update README with chat examples & Gemini CLI notes
   - Final commit: "Phase III complete – AI chatbot fully integrated"

Success criteria:
- Natural language commands fully control todos (add/list/complete/delete/update)
- Conversations persist across sessions (DB-backed)
- Gemini agent accurately calls MCP tools and confirms actions
- UI is responsive, beautiful, and consistent with Phase II
- Secure: No cross-user access, JWT enforced
- End-to-end working: Login → chat → action → visible result

Constraints:
- Use Gemini CLI + your Gemini API key for all AI logic
- No OpenAI Agents SDK
- Backend stateless; all state in Neon DB
- Frontend only adds chat page (no backend changes)
- Scope limited to 5 basic operations

Not doing:
- Real-time chat
- Advanced agent memory
- Voice/multi-modal
- New UI libraries

This plan delivers a complete, intelligent, persistent AI chatbot that elevates your hackathon project to its final form.

## Response snapshot

Generated implementation plan for backend-chatbot-core. Includes research on Gemini/MCP integration, data model for Conversation/Message, API schema for stateless chat, and quickstart guide.

## Outcome

- ✅ Impact: Solid foundation for Phase III implementation.
- 🧪 Tests: N/A
- 📁 Files: specs/003-backend-chatbot-core/{plan.md, research.md, data-model.md, contracts/, quickstart.md}
- 🔁 Next prompts: /sp.tasks (to breakdown implementation)
- 🧠 Reflection: Clear path forward using Gemini directly for agent logic to bridge MCP tools.

## Evaluation notes (flywheel)

- Failure modes observed: None
- Graders run and results (PASS/FAIL): PASS
- Prompt variant (if applicable): N/A
- Next experiment (smallest change to try): N/A
