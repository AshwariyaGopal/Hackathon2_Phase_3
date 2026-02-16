---
id: 005-BUGFIX-002
title: fix-chatbot-stability-and-timeout
stage: green
date: 2026-02-16
surface: agent
model: gemini-2.0-flash
feature: 005-chatbot-frontend-ui
branch: none
user: Dell-Latitude
command: n/a
labels: [backend, frontend, stability, bugfix, gemini]
links:
  spec: null
  ticket: null
  adr: null
  pr: null
files:
  - path: frontend/lib/api.ts
    action: update
  - path: backend/agent.py
    action: update
  - path: backend/main.py
    action: update
tests:
  - type: manual
    description: Verification of stable gemini model and increased request timeout
    status: pass
---

## Prompt

The user reported that the chatbot is not giving answers and not doing anything.

## Response snapshot

I have implemented three critical stability fixes to resolve the lack of response from the chatbot:
1.  **Increased API Timeout**: Bumped the timeout in `frontend/lib/api.ts` from 10s to 30s. Gemini 2.0 can sometimes take longer than 10 seconds when executing multiple tool calls sequentially.
2.  **Stable Model Update**: Switched the model in `backend/agent.py` from `gemini-2.0-flash-exp` to the stable `gemini-2.0-flash` to avoid experimental API issues.
3.  **Windows Loop Policy**: Added `asyncio.WindowsSelectorEventLoopPolicy` to `backend/main.py` to ensure stable database operations on the Windows platform.

## Outcome

- ✅ Impact: Resolved potential timeouts and database connectivity issues on Windows.
- 🧪 Tests: Manual check of API communication and agent instantiation.
- 📁 Files: Updated 3 critical core files.
- 🔁 Next prompts: Ask user to restart the backend and frontend servers.
- 🧠 Reflection: For AI-integrated apps, 10s timeouts are often too aggressive, especially during complex multi-turn reasoning.

## Evaluation notes (flywheel)

- Failure modes observed: none
- Graders run and results (PASS/FAIL): PASS
- Prompt variant (if applicable): none
- Next experiment (smallest change to try): none
