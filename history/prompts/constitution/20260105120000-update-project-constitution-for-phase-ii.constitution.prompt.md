---
id: 20260105120000
title: Update Project Constitution for Phase II
stage: constitution
date: 2026-01-05
surface: agent
model: claude-sonnet-4-5-20250929
feature: none
branch: master
user: unknown
command: sp.constitution
labels: ["constitution", "project setup"]
links:
  spec: null
  ticket: null
  adr: null
  pr: null
files:
  - .specify/memory/constitution.md
tests:
  - none
---

## Prompt

Project: Hackathon 2 - Phase II: Todo Full-Stack Web Application with AI Subagents & Skills
Core principles:

Spec-driven development: Every single change — whether code, database schema, API endpoint, UI component, or AI subagent — must originate from a detailed specification in the /specs/ directory before implementation
Multi-user isolation & security: All data operations must be strictly scoped to the authenticated user via JWT verification; no cross-user data access under any circumstances
Full-stack coherence: Frontend (Next.js) and backend (FastAPI) must evolve together based on the same specs; Claude Code is the primary tool for coordinated implementation
AI-enhanced intelligence: Integrate subagents and skills to make the todo app smarter (auto-suggestions for priority, tags, due dates, task breakdown) while keeping core Phase II features (5 basic CRUD + auth) as the foundation
Progressive evolution: Build directly on Phase I console app logic, migrating to persistent storage and web interfaces without unnecessary rewrites

Key standards:

Features: Core 5 basic operations (Add, Delete, Update, View, Mark Complete) with full user ownership and persistence
Authentication: Better Auth (frontend) with JWT plugin; FastAPI backend verifies JWT using shared BETTER_AUTH_SECRET; all API routes require valid token and enforce user_id matching
API: RESTful endpoints exactly as defined (/api/tasks with user scoping via JWT, not URL user_id); support filtering/sorting via query params
Database: Neon Serverless PostgreSQL via SQLModel; schema includes tasks table with user_id foreign key; migrations handled through code
AI Integration:
– Subagents defined in /.claude/agents/ for specialized tasks (e.g., Task Analyzer, Security Reviewer, Fullstack Implementer)
– Skills defined in /skills/ for reusable expertise (e.g., Priority Suggestion, Smart Tag Generation)
– Subagents and skills must be referenced and used during Claude Code implementation workflows
Monorepo structure: Strictly follow documented layout – /specs/ with subdirs (features/, api/, database/, ui/), .spec-kit/config.yaml with phase2-web defined, CLAUDE.md at root/frontend/backend
Code quality: TypeScript with strict types, Tailwind CSS (no inline styles), Python PEP 8, meaningful error handling with HTTPException

Constraints:

Technology stack: Next.js 16+ (App Router), FastAPI, SQLModel, Neon PostgreSQL, Better Auth (JWT), Claude Code + Spec-Kit Plus; no additional major libraries unless explicitly specced
Storage: Fully persistent via Neon; no in-memory fallback
Scope: Phase II focuses on basic CRUD + authentication; intermediate/advanced features (priorities, tags, due dates, recurring) may be added only if specced as extensions using subagents/skills
Development workflow: Specs first → commit to /specs/ → Claude Code implement via @specs/... references → manual testing → iterate on specs if needed
Environment: Docker Compose for local development; shared secrets via .env (DATABASE_URL, BETTER_AUTH_SECRET)

Success criteria:

Multi-user web app: Multiple users can sign up, log in, and manage completely isolated task lists with data persisting in Neon DB
Secure API: All endpoints protected by JWT; unauthorized requests return 401; user_id from token enforced on every operation
Responsive frontend: Clean, mobile-friendly interface with task list, forms, and real-time feedback using Next.js + Tailwind
AI intelligence: Subagents and skills actively used during development and optionally exposed in app (e.g., auto-suggested priority/tags on task creation)
Complete spec coverage: /specs/ contains organized files covering overview, features (task-crud.md, authentication.md), api (rest-endpoints.md), database (schema.md), ui (components/pages), plus optional subagent/skill specs
Monorepo readiness: GitHub repository with .spec-kit/config.yaml, layered CLAUDE.md files, docker-compose.yml, and clear README with setup/run/demo instructions
Demo-ready: Full application runnable locally via docker-compose, showcasing secure multi-user todo management with AI-assisted enhancements

## Response snapshot

The project constitution has been updated to version 1.0.0. This is a MAJOR version bump as it represents the initial comprehensive constitution for Phase II of the project. The `RATIFICATION_DATE` in `.specify/memory/constitution.md` needs to be specified by the user. Suggested commit message: `docs: amend constitution to v1.0.0 (initial Phase II constitution)`

## Outcome

- ✅ Impact: Project constitution updated to version 1.0.0 with core principles, key standards, constraints, and success criteria for Phase II of the Hackathon 2 Todo Full-Stack Web Application.
- 🧪 Tests: none
- 📁 Files: .specify/memory/constitution.md
- 🔁 Next prompts: User to provide `RATIFICATION_DATE` for the constitution. User to commit the updated constitution.
- 🧠 Reflection: The PHR creation script failed, requiring manual template filling. Ensure the script is available or use agent-native fallback reliably.

## Evaluation notes (flywheel)

- Failure modes observed: The `create-phr.sh` script was not found, requiring manual PHR creation.
- Graders run and results (PASS/FAIL): none
- Prompt variant (if applicable): none
- Next experiment (smallest change to try): Verify the availability and path of `create-phr.sh` script for future PHR creations, or improve agent-native PHR creation to be more robust.
