# Tasks: Backend Implementation & Integration

**Feature**: Backend Complete Implementation & Frontend Integration
**Branch**: `002-backend-implementation`
**Spec**: [specs/002-backend-implementation/spec.md](spec.md)
**Plan**: [specs/002-backend-implementation/plan.md](plan.md)

## Phase 1: Setup

*Goal: Initialize the backend project and environment.*

- [x] T001 Initialize backend directory and virtual environment in `backend/`
- [x] T002 Install core dependencies (FastAPI, SQLModel, PyJWT, psycopg, python-dotenv) in `backend/requirements.txt`
- [x] T003 [P] Configure `.env` with `DATABASE_URL`, `BETTER_AUTH_SECRET`, and `BETTER_AUTH_URL` in `backend/.env`
- [x] T004 Create asynchronous database connection and session management in `backend/db.py`

## Phase 2: Foundational

*Goal: Implement core models and shared security middleware.*

- [x] T005 [P] Define SQLModel schemas for User and Task in `backend/models.py`
- [x] T006 Implement JWT verification middleware and `current_user` dependency in `backend/middleware/jwt_auth.py`
- [x] T007 Configure FastAPI app with CORS and routers in `backend/main.py`
- [x] T008 Add startup event to initialize database schema using SQLModel in `backend/main.py`

## Phase 3: User Story 1 - Secure Task Access

*Goal: Ensure user isolation and secure authentication.*

**Independent Test**: Use a valid JWT to access the API; verify 401 on missing/invalid token and 403/404 on accessing other users' data.

- [x] T009 [US1] Implement basic protected route to test JWT verification in `backend/routes/tasks.py`
- [x] T010 [US1] Implement user-based scoping logic in database queries in `backend/routes/tasks.py`

## Phase 4: User Story 2 - Basic Task Management

*Goal: Implement complete CRUD operations for tasks.*

**Independent Test**: Perform POST, GET, PUT, and DELETE on `/api/tasks` and verify database persistence.

- [x] T011 [US2] Implement POST `/api/tasks` to create a new task in `backend/routes/tasks.py`
- [x] T012 [P] [US2] Implement GET `/api/tasks` to list authenticated user's tasks in `backend/routes/tasks.py`
- [x] T013 [P] [US2] Implement GET `/api/tasks/{id}` to retrieve a specific task in `backend/routes/tasks.py`
- [x] T014 [US2] Implement PUT `/api/tasks/{id}` to update task details in `backend/routes/tasks.py`
- [x] T015 [US2] Implement DELETE `/api/tasks/{id}` to remove a task in `backend/routes/tasks.py`

## Phase 5: User Story 3 - Task Filtering and Sorting

*Goal: Add query parameters for task list organization.*

**Independent Test**: Use `status` and `sort` query params on `/api/tasks` and verify results.

- [x] T016 [US3] Add `status` filtering (pending, completed, all) to list endpoint in `backend/routes/tasks.py`
- [x] T017 [US3] Add `sort` functionality (created_at, title) to list endpoint in `backend/routes/tasks.py`
- [x] T018 [US3] Implement PATCH `/api/tasks/{id}/complete` for quick status toggle in `backend/routes/tasks.py`

## Phase 6: Polish & Cross-Cutting Concerns

*Goal: Final refinements and integration verification.*

- [x] T019 Implement global error handling and meaningful HTTP exceptions in `backend/main.py`
- [x] T020 Add basic logging for API requests and database operations in `backend/main.py`
- [x] T021 Verify end-to-end integration with the Next.js frontend
- [x] T022 Update project README with backend setup and API documentation in `README.md`

## Dependencies

1. **Setup** (Phase 1) is a prerequisite for all other phases.
2. **Foundational** (Phase 2) must be completed before implementing any User Story.
3. **User Story 1** (Auth) is required to test user-scoping in **User Story 2 & 3**.
4. **User Story 3** (Filtering) depends on the list endpoint from **User Story 2**.

## Parallel Execution

- **T003** (Env) and **T005** (Models) can be done in parallel once dependencies are installed.
- **T012** and **T013** (Read operations) can be developed together.
- **T018** (PATCH) can be implemented alongside **T014** (PUT).

## Implementation Strategy

1. **MVP**: Complete Phases 1, 2, and the basic Create/List operations from US2.
2. **Security First**: Ensure JWT middleware is rock-solid before exposing all CRUD routes.
3. **Incremental**: Add Update/Delete and finally Filtering/Sorting once core flows are verified.