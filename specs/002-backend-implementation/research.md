# Research & Findings: Backend Complete Implementation

**Feature**: Backend Complete Implementation & Frontend Integration
**Branch**: `002-backend-implementation`
**Date**: 2026-01-08

## 1. Better Auth JWT Verification in FastAPI

**Decision**: Use `PyJWT` to verify tokens signed with HS256 using the shared `BETTER_AUTH_SECRET`.

**Rationale**:
- Better Auth issues JWTs that can be verified by a backend using the same secret if symmetric signing is used.
- `PyJWT` is the standard library for JWT operations in Python and is lightweight.
- The middleware will extract the `user_id` and `email` from the payload to enforce user isolation.

**Alternatives Considered**:
- `authlib`: Powerful but more complex than needed for simple JWT verification.
- `python-jose`: Another popular option, but `PyJWT` is currently more actively maintained for standard JWT use cases.

## 2. Asynchronous SQLModel with Neon PostgreSQL

**Decision**: Use `sqlalchemy.ext.asyncio` with `psycopg` (v3) or `asyncpg` as the driver.

**Rationale**:
- SQLModel is built on top of SQLAlchemy and supports its async extensions.
- Asynchronous DB access is a requirement for high-performance FastAPI applications.
- Neon works perfectly with standard PostgreSQL drivers.

**Alternatives Considered**:
- Synchronous SQLModel: Rejected due to performance and concurrency constraints.

## 3. Database Schema Initialization

**Decision**: Use `SQLModel.metadata.create_all` with the async engine on startup.

**Rationale**:
- Simplest way to ensure tables exist in a hackathon/development context.
- Given the scope is Phase II basic CRUD, complex migrations (Alembic) are not strictly required yet, but the architecture will support them later.

## 4. CORS Configuration

**Decision**: Use FastAPI's `CORSMiddleware` with `allow_origins=["http://localhost:3000"]`.

**Rationale**:
- Necessary to allow the Next.js frontend to communicate with the FastAPI backend when running on different ports locally.
- Secure by restricting origins to the known development URL.

## 5. Environment Management

**Decision**: Use `python-dotenv` to load `.env` files into environment variables.

**Rationale**:
- Standard practice in the Python ecosystem.
- Allows keeping secrets like `BETTER_AUTH_SECRET` and `DATABASE_URL` out of the codebase.
