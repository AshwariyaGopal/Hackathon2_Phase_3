---
id: phr-20260121-constitution-v2
title: phase-iii-constitution
stage: constitution
date: 2026-01-21
surface: cli
model: gemini-2.0-flash-exp
feature: phase-iii-chatbot
branch: main
user: user
command: /sp.constitution
labels: [constitution, phase-iii, governance]
links:
  spec: .specify/memory/constitution.md
  ticket: N/A
  adr: N/A
  pr: N/A
files:
  - .specify/memory/constitution.md
tests: []
---

## Prompt

/sp.constitution Project: Hackathon 2 - Phase III: Todo AI Chatbot (Natural Language Todo Management)

Core principles:  
- Strict spec-driven development: Every feature, endpoint, tool, model, UI component and agent behavior must be defined in detailed, approved specifications before any implementation  
- Stateless & persistent architecture: Server remains completely stateless; all conversation history, task state and messages are stored and fetched from Neon PostgreSQL on every request  
- Secure user isolation: All chat messages, tool calls and task operations are strictly scoped to the authenticated user via Better Auth JWT  
- Natural & confirmatory AI interaction: Gemini must accurately detect intent, always call the correct MCP tool when action is needed, confirm every change, and respond in friendly, helpful natural language  
- Seamless integration with existing full-stack: Build directly on Phase II (Next.js frontend, FastAPI backend, Neon DB, Better Auth JWT) without breaking any previous functionality  
- Gemini-first AI-assisted workflow: Use Gemini CLI (with your Gemini API key) for all code generation, spec refinement, debugging, and implementation guidance  

Key standards:  
- Chat endpoint: Stateless POST /api/{user_id}/chat  
  - Accepts { conversation_id?: number, message: string }  
  - Returns { conversation_id, response, tool_calls? }  
  - Requires valid JWT; user_id from token must match path  
- MCP tools: Exactly 5 stateless tools (using Official MCP SDK):  
  1. add_task(user_id, title, description?)  
  2. list_tasks(user_id, status?: "all"|"pending"|"completed")  
  3. complete_task(user_id, task_id)  
  4. delete_task(user_id, task_id)  
  5. update_task(user_id, task_id, title?, description?)  
  - All tools must validate user_id and return consistent JSON  
- Database models: Extend existing schema with  
  - Conversation (user_id, id, created_at, updated_at)  
  - Message (user_id, id, conversation_id, role, content, created_at)  
  - Use async SQLModel  
- Gemini agent logic:  
  - Use Gemini CLI + your API key to power the conversational agent  
  - Agent must detect intent and decide whether to call MCP tool or just reply  
  - Always confirm actions ("I've added 'Buy milk' for you!")  
  - Gracefully handle errors and ambiguous inputs  
- Frontend: Integrate OpenAI ChatKit UI into protected /app/chat route  
  - Beautiful, responsive, consistent with Phase II premium design  
  - Display history, show loading states, scroll to bottom, input box  
- Authentication: Reuse existing Better Auth JWT setup  

Constraints:  
- Technology stack:  
  - Frontend → OpenAI ChatKit (in Next.js)  
  - Backend → FastAPI + Official MCP SDK + SQLModel  
  - AI → Gemini CLI + Gemini API key (your own key)  
  - Database → Neon Serverless PostgreSQL  
  - Auth → Better Auth JWT  
- No OpenAI Agents SDK (replaced by Gemini via CLI/API)  
- No real-time / WebSockets — pure request-response  
- No new major dependencies beyond the stack  
- Scope limited to the 5 basic todo operations via natural language  
- Environment: Reuse existing .env (BETTER_AUTH_SECRET, DATABASE_URL)  

Success criteria:  
- Users can manage todos entirely via natural language in chat  
- Conversations persist across sessions (stored in DB)  
- Gemini correctly calls MCP tools when action is required  
- All responses are natural, confirmatory, and error-resilient  
- UI remains beautiful, responsive, and consistent with Phase II  
- End-to-end flow works: login → chat → command → action confirmed → task updated in DB & visible  
- Complete specs coverage: backend-chatbot-core.md + frontend-chatbot-integration.md  
- Demo-ready: Realistic chat examples, README with screenshots & Gemini CLI usage notes  
- Standout quality: Intelligent, helpful, secure and visually exceptional  

This constitution governs Phase III development using Gemini CLI as the primary AI implementation tool, ensuring a production-grade conversational todo experience.

## Response snapshot

Updated project constitution to v2.0.0 for Phase III.

## Outcome

- ✅ Impact: Established core governance for Phase III AI Chatbot features.
- 🧪 Tests: N/A (Documentation only)
- 📁 Files: .specify/memory/constitution.md updated
- 🔁 Next prompts: /sp.plan (to start the feature planning)
- 🧠 Reflection: The transition to Gemini-first and MCP tools is a significant architectural shift that requires strict adherence to the new principles.

## Evaluation notes (flywheel)

- Failure modes observed: None
- Graders run and results (PASS/FAIL): PASS
- Prompt variant (if applicable): N/A
- Next experiment (smallest change to try): N/A
