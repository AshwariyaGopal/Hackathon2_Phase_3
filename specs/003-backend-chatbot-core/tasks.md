---
description: "Task list template for feature implementation"
---

# Tasks: Backend & AI Core

**Input**: Design documents from `specs/003-backend-chatbot-core/`
**Prerequisites**: plan.md (required), spec.md (required for user stories), research.md, data-model.md, contracts/

**Tests**: The examples below include test tasks. Tests are OPTIONAL - only include them if explicitly requested in the feature specification.

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US3)
- Include exact file paths in descriptions

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Project initialization and basic structure

- [x] T001 Install dependencies (google-generativeai, official-mcp-sdk) in backend/requirements.txt
- [x] T002 Verify Gemini API Key configuration in backend/.env

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Core infrastructure that MUST be complete before ANY user story can be implemented

**⚠️ CRITICAL**: No user story work can begin until this phase is complete

- [x] T003 Create Conversation and Message models in backend/models.py
- [x] T004 Implement database migration/startup creation for new models in backend/main.py

**Checkpoint**: Foundation ready - user story implementation can now begin in parallel

---

## Phase 3: User Story 1 - Secure Chat API Endpoint (Priority: P1)

**Goal**: Authenticated endpoint that accepts messages and returns responses.

**Independent Test**: POST /api/{user_id}/chat with valid JWT returns 200 OK.

### Implementation for User Story 1

- [x] T005 [P] [US1] Create chat router shell in backend/routes/chat.py
- [x] T006 [US1] Implement JWT validation and user_id matching in backend/routes/chat.py
- [x] T007 [US1] Implement request/response validation using Pydantic models in backend/routes/chat.py
- [x] T008 [US1] Wire up chat router to backend/main.py

**Checkpoint**: At this point, User Story 1 should be fully functional (mock response) and testable independently

---

## Phase 4: User Story 2 - MCP Tools Implementation (Priority: P1)

**Goal**: Standardized tools to manipulate todo list safely.

**Independent Test**: Unit tests for each tool function verifying DB changes.

### Implementation for User Story 2

- [x] T009 [P] [US2] Create mcp_tools.py with Official MCP SDK structure in backend/mcp_tools.py
- [x] T010 [US2] Implement add_task tool with user scoping in backend/mcp_tools.py
- [x] T011 [US2] Implement list_tasks tool with filtering in backend/mcp_tools.py
- [x] T012 [US2] Implement complete_task, delete_task, update_task tools in backend/mcp_tools.py
- [x] T013 [US2] Add tool schema generation for Gemini in backend/mcp_tools.py

**Checkpoint**: At this point, User Stories 1 AND 2 should both work independently

---

## Phase 5: User Story 3 - Gemini Agent Logic & Persistence (Priority: P2)

**Goal**: Intelligent agent that understands intent, calls tools, and remembers context.

**Independent Test**: Full conversation flow with history persistence.

### Implementation for User Story 3

- [x] T014 [P] [US3] Create Agent class with Gemini configuration in backend/agent.py
- [x] T015 [US3] Implement conversation fetching and history injection in backend/agent.py
- [x] T016 [US3] Implement tool calling loop (Gemini response -> tool exec -> Gemini confirm) in backend/agent.py
- [x] T017 [US3] Implement persistence of User and Assistant messages to DB in backend/routes/chat.py
- [x] T018 [US3] Integrate Agent logic into chat endpoint in backend/routes/chat.py

**Checkpoint**: All user stories should now be independently functional

---

## Phase 6: Polish & Cross-Cutting Concerns

**Purpose**: Improvements that affect multiple user stories

- [x] T019 Update README.md with chatbot usage instructions and Gemini CLI notes
- [x] T020 Verify CORS configuration for frontend origin in backend/main.py
- [x] T021 Final manual test of end-to-end flow with Postman/cURL

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies - can start immediately
- **Foundational (Phase 2)**: Depends on Setup completion - BLOCKS all user stories
- **User Stories (Phase 3+)**: All depend on Foundational phase completion
  - User stories can then proceed in parallel (if staffed)
  - Or sequentially in priority order (P1 → P2 → P3)
- **Polish (Final Phase)**: Depends on all desired user stories being complete

### User Story Dependencies

- **User Story 1 (P1)**: Can start after Foundational (Phase 2) - No dependencies on other stories
- **User Story 2 (P1)**: Can start after Foundational (Phase 2) - Independent of US1
- **User Story 3 (P2)**: Depends on US1 (Endpoint) and US2 (Tools) to fully integrate

### Implementation Strategy

### Incremental Delivery

1. Complete Setup + Foundational → Foundation ready
2. Add User Story 1 (Endpoint Shell) → Test Auth
3. Add User Story 2 (Tools) → Test Tools independently
4. Add User Story 3 (Agent) → Connect Endpoint to Tools via Agent → Full MVP
