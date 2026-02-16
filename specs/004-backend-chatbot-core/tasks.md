# Tasks: Todo AI Chatbot - Backend & AI Core

**Input**: Design documents from `/specs/004-backend-chatbot-core/`
**Prerequisites**: plan.md, spec.md, research.md, data-model.md, contracts/

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (US1, US2, US3)
- File paths are relative to repository root

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Project initialization and environment verification

- [x] T001 Install backend dependencies: `google-generativeai`, `mcp` in `backend/requirements.txt`
- [x] T002 Verify `.env` contains `GEMINI_API_KEY`, `BETTER_AUTH_SECRET`, and `DATABASE_URL` in `backend/.env`
- [x] T003 [P] Configure Gemini CLI with the API key for testing

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Core infrastructure that MUST be complete before ANY user story can be implemented

**⚠️ CRITICAL**: No user story work can begin until this phase is complete

- [x] T004 [P] Update `backend/models.py` with `Conversation` and `Message` SQLModels per `data-model.md`
- [x] T005 [P] Implement async database session and schema initialization in `backend/db.py`
- [x] T006 Initialize the MCP tool registry and base logic in `backend/mcp_tools.py`

**Checkpoint**: Foundation ready - User story implementation can now begin

---

## Phase 3: User Story 2 - Task Management via AI Tools (Priority: P1)

**Goal**: Implement the 5 MCP tools that the AI will use to manage tasks.

**Independent Test**: Verify each function in `mcp_tools.py` correctly modifies the database and returns the expected JSON.

### Implementation for User Story 2

- [x] T007 [US2] Implement `add_task` tool with `user_id` validation in `backend/mcp_tools.py`
- [x] T008 [US2] Implement `list_tasks` tool with status filtering in `backend/mcp_tools.py`
- [x] T009 [US2] Implement `complete_task` tool with ownership check in `backend/mcp_tools.py`
- [x] T010 [US2] Implement `delete_task` tool with ownership check in `backend/mcp_tools.py`
- [x] T011 [US2] Implement `update_task` tool with partial update support in `backend/mcp_tools.py`

**Checkpoint**: MCP tools are functional and ready for AI integration.

---

## Phase 4: User Story 1 - Secure Chat API Endpoint (Priority: P1) 🎯 MVP

**Goal**: Implement the secure chat endpoint and Gemini agent logic.

**Independent Test**: POST to `/api/{user_id}/chat` with a valid JWT and verify the AI performs a task action.

### Implementation for User Story 1

- [x] T012 [US1] Initialize Gemini 2.0 model and system prompt in `backend/agent.py`
- [x] T013 [US1] Implement intent detection and tool-calling orchestration logic in `backend/agent.py`
- [x] T014 [US1] Create the chat router and define request/response schemas in `backend/routes/chat.py`
- [x] T015 [US1] Implement `POST /api/{user_id}/chat` logic with JWT verification in `backend/routes/chat.py`
- [x] T016 [US1] Integrate chat router and configure CORS in `backend/main.py`
- [x] T017 [US1] Add natural language confirmation logic for all tool executions in `backend/agent.py`

**Checkpoint**: AI Chatbot is functional for single-turn task management.

---

## Phase 5: User Story 3 - Persistent Conversation Context (Priority: P2)

**Goal**: Enable multi-turn conversations by persisting and retrieving chat history.

**Independent Test**: Send a follow-up message (e.g., "Change it to Buy Milk") and verify the AI knows what "it" refers to.

### Implementation for User Story 3

- [x] T018 [US3] Implement logic to save User and Assistant messages to the database in `backend/routes/chat.py`
- [x] T019 [US3] Implement history retrieval logic (last 10 messages) in `backend/agent.py`
- [x] T020 [US3] Update the Gemini prompt to include retrieved history in `backend/agent.py`
- [x] T021 [US3] Implement conversation resumption using `conversation_id` in `backend/routes/chat.py`

**Checkpoint**: Chatbot supports persistent, multi-turn conversations.

---

## Phase 6: Polish & Cross-Cutting Concerns

**Purpose**: Final documentation and error resilience.

- [x] T022 [P] Update `README.md` with Chat API documentation and example commands
- [x] T023 Implement robust error handling for Gemini API and database timeouts in `backend/agent.py`
- [x] T024 [P] Verify `quickstart.md` steps and perform final end-to-end manual test

---

## Dependencies & Execution Order

### Phase Dependencies

1. **Setup (Phase 1)**: No dependencies.
2. **Foundational (Phase 2)**: Depends on Phase 1.
3. **User Story 2 (Phase 3)**: Depends on Phase 2 (Models/Tools structure).
4. **User Story 1 (Phase 4)**: Depends on Phase 3 (Needs tools for AI to call).
5. **User Story 3 (Phase 5)**: Depends on Phase 4 (Needs endpoint to persist history).
6. **Polish (Phase 6)**: Depends on all previous phases.

### Parallel Opportunities

- T004, T005, and T006 can be worked on in parallel.
- All US2 tool implementations (T007-T011) can be developed in parallel as they are independent functions in `mcp_tools.py`.
- Documentation and error handling (T022-T024) can proceed in parallel during the final phase.

---

## Implementation Strategy

### MVP First (User Story 1 & 2)

- Focus on completing the foundation and the 5 MCP tools.
- Deliver the `/chat` endpoint with basic intent detection.
- **Success**: User can add a task via natural language in a single turn.

### Incremental Delivery

1. **Foundation**: Models and DB ready.
2. **Tools**: Capabilities defined.
3. **Chat Core**: Single-turn interaction.
4. **Memory**: Multi-turn support.
5. **Polish**: Final docs and error handling.
