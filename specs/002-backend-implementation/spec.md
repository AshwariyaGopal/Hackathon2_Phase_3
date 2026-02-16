# Feature Specification: Backend Complete Implementation & Frontend Integration

**Feature Branch**: `002-backend-implementation`  
**Created**: 2026-01-08  
**Status**: Draft  
**Input**: User description: "Todo Full-Stack Web App - Backend Complete Implementation & Frontend Integration (Phase II) Target: Fully implement a secure, robust, and high-performance FastAPI backend for the multi-user todo web application, including all API endpoints, database integration, JWT authentication, and seamless frontend integration, ensuring complete functionality and data persistence with Neon PostgreSQL Focus: Build the entire backend from database schema to protected RESTful endpoints using FastAPI, SQLModel, and Better Auth JWT verification, while guaranteeing user isolation, proper error handling, and full compatibility with the existing Next.js frontend for successful end-to-end integration Success criteria: Database setup: Fully functional Neon PostgreSQL database with users and tasks tables, proper foreign keys, indexes, and timestamps; automatic schema creation via SQLModel on startup Authentication integration: JWT verification middleware using BETTER_AUTH_SECRET from .env; decode token to extract user_id/email; reject invalid/expired tokens with 401 Unauthorized API endpoints: Complete RESTful API under /api/tasks (no user_id in paths – scoping via JWT): – GET /api/tasks: List user's tasks with optional query params for status (pending/completed/all) and sort (created/title) – POST /api/tasks: Create new task (title required, description optional) associated with authenticated user – GET /api/tasks/{id}: Get single task details (only if owned by user) – PUT /api/tasks/{id}: Update task (title/description; ownership enforced) – DELETE /api/tasks/{id}: Delete task (ownership enforced) – PATCH /api/tasks/{id}/complete: Toggle completion status (ownership enforced) User isolation: Every operation filters by decoded user_id from JWT; impossible for users to access/modify others' data Data persistence: All tasks persist in Neon DB; use async SQLModel sessions for efficiency Error handling: Proper HTTP status codes, meaningful messages via HTTPException (e.g., 404 for not found, 403 for unauthorized access) Response models: Use Pydantic/SQLModel for consistent JSON responses with proper serialization Environment integration: Use .env values – BETTER_AUTH_SECRET for JWT, Neon_db_url (corrected to DATABASE_URL in code) for connection, BETTER_AUTH_URL for any frontend callbacks Frontend integration: Backend fully compatible with frontend's /lib/api.ts client; CORS configured for localhost:3000; successful end-to-end testing (e.g., login from frontend creates session usable in API calls) Performance & security: Efficient queries with indexes; protection against common vulnerabilities (e.g., SQL injection via SQLModel, rate limiting if specced) Logging & monitoring: Basic logging for API calls and errors Constraints: Technology: FastAPI, SQLModel (for models/ORM), Neon Serverless PostgreSQL; PyJWT or equivalent for token verification; no additional major libraries unless justified Code location: All backend code in /backend folder (main.py, models.py, routes/, db.py, middleware.py) Authentication: Stateless JWT verification using shared BETTER_AUTH_SECRET; no session storage in backend Database: Use provided Neon_db_url (rename to DATABASE_URL in code); async engine/session; no manual SQL – use SQLModel only API design: RESTful, JSON only; endpoints scoped implicitly via JWT (no user_id in paths to avoid tampering) Integration: Assume frontend is complete; backend must work seamlessly with Better Auth's JWT issuance from frontend Workflow: Use Backend Engineer agent, Database Engineer agent, and relevant skills (fastapi-jwt-auth, secure-task-crud, sqlmodel-task-models, neon-async-db) Environment: Load .env file; handle startup schema creation safely Scope: Only basic 5 features + auth; no advanced (priorities, etc.) unless specced Not building: Frontend code or UI elements Custom user management (rely on Better Auth for signup/login) Advanced authentication (e.g., OAuth, 2FA) Real-time features (WebSockets) Testing frameworks (unit/e2e) or CI/CD Admin endpoints or multi-role system Data export/import or backups Guidance: Prioritize: Database models/schema → JWT middleware → Secure CRUD routes → CORS/integration setup Use async patterns throughout for performance Test integration: Run frontend + backend locally; verify JWT flow from login to task ops Security first: Always validate ownership; log suspicious activity Complete backend ready for frontend consumption: API should return data in exact format frontend expects (e.g., task objects with id, title, description, completed, created_at)"

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Secure Task Access (Priority: P1)

As an authenticated user, I want my tasks to be stored securely and only accessible by me, so that my personal data remains private.

**Why this priority**: Core security and privacy requirement for a multi-user application.

**Independent Test**: Login as User A, create a task. Login as User B, verify User A's task is not visible and cannot be accessed via direct ID reference.

**Acceptance Scenarios**:

1. **Given** a valid JWT token for User A, **When** I request my task list, **Then** I only see tasks belonging to User A.
2. **Given** a valid JWT token for User A, **When** I attempt to access a task ID belonging to User B, **Then** the system returns a 403 Forbidden or 404 Not Found error.

---

### User Story 2 - Basic Task Management (Priority: P2)

As an authenticated user, I want to create, read, update, and delete my tasks, so that I can effectively manage my daily goals.

**Why this priority**: Functional core of the application.

**Independent Test**: Perform all CRUD operations (Create, Read, Update, Delete) via API endpoints and verify data persistence in the database.

**Acceptance Scenarios**:

1. **Given** a valid JWT token, **When** I create a new task with a title and description, **Then** it is successfully saved and associated with my user ID.
2. **Given** an existing task I own, **When** I update its title or completion status, **Then** the changes are reflected in subsequent requests.

---

### User Story 3 - Task Filtering and Sorting (Priority: P3)

As an authenticated user, I want to filter my tasks by status and sort them by date or title, so that I can quickly find the information I need.

**Why this priority**: Enhances usability as the task list grows.

**Independent Test**: Use query parameters on the list endpoint to verify correct filtering and sorting results.

**Acceptance Scenarios**:

1. **Given** multiple tasks with different statuses, **When** I request only "completed" tasks, **Then** only tasks where is_completed is true are returned.
2. **Given** multiple tasks, **When** I request tasks sorted by "title", **Then** the returned list is in alphabetical order by title.

---

### Edge Cases

- **Invalid JWT**: What happens when a request is made with an expired or tampered JWT token? System MUST return 401 Unauthorized.
- **Database Connection Failure**: How does the system handle temporary database outages? System SHOULD return a meaningful 500 Internal Server Error and log the failure.
- **Malformed Input**: What happens if a task is created without a title? System MUST return 422 Unprocessable Entity with validation details.
- **Resource Not Found**: How does the system handle requests for task IDs that don't exist? System MUST return 404 Not Found.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: System MUST verify JWT tokens issued by Better Auth using the `BETTER_AUTH_SECRET` environment variable.
- **FR-002**: System MUST automatically create and manage database schema (users and tasks tables) on startup using SQLModel.
- **FR-003**: System MUST enforce strict user isolation: all database queries for tasks MUST include a filter for the authenticated `user_id`.
- **FR-004**: System MUST provide RESTful endpoints for tasks under `/api/tasks` that do not require an explicit `user_id` in the URL path.
- **FR-005**: System MUST support query parameters for filtering (status: pending, completed, all) and sorting (created_at, title) on the task list endpoint.
- **FR-006**: System MUST ensure data persistence using Neon PostgreSQL with asynchronous connection handling.
- **FR-007**: System MUST configure CORS to allow requests from the frontend running on `http://localhost:3000`.

### Key Entities *(include if feature involves data)*

- **User**: Represents an authenticated person. Attributes: `id` (UUID), `email` (string), `name` (string), `created_at` (timestamp).
- **Task**: Represents a unit of work. Attributes: `id` (UUID), `title` (string, required), `description` (string, optional), `is_completed` (boolean), `created_at` (timestamp), `updated_at` (timestamp), `user_id` (UUID, foreign key to User).

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: API responds to authorized requests within 100ms (excluding network latency) for standard CRUD operations.
- **SC-002**: 100% of unauthorized requests (invalid/missing JWT) are rejected with a 401 Unauthorized status.
- **SC-003**: User isolation is 100% effective: no user can access or modify another user's tasks through any API endpoint.
- **SC-004**: Database schema is successfully initialized automatically on application startup without manual intervention.
- **SC-005**: All CRUD operations result in persistent data changes that survive application restarts.