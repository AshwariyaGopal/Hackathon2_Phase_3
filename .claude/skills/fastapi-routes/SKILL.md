---
name: FastAPI Routes Expert
description: Expert in building clean, secure, and well-structured FastAPI routes for the multi-user todo application
version: 0.1.0
---

# FastAPI Routes Expert

This skill specializes in designing and implementing robust, secure, and high-performance API endpoints using FastAPI for "The Evolution of Todo". It ensures all routes are consistent, well-documented, and adhere to the project's architectural standards.

## Core Capabilities

- **RESTful Endpoint Design**: Creating intuitive and standard-compliant API routes under the `/api/` prefix using appropriate HTTP methods (`GET`, `POST`, `PUT`, `DELETE`, `PATCH`).
- **Dependency Injection**: Expert use of FastAPI's `Depends` for efficient resource management, including:
    - **Database Sessions**: Injecting async SQLModel sessions for database interactions.
    - **Authentication**: securing routes with JWT validation to ensure only authorized access.
- **Data Validation & Serialization**: Leveraging Pydantic and SQLModel for rigorous request body validation and precise response schemas, preventing data leakage and ensuring type safety.
- **Error Handling**: Implementing standard HTTP status codes (200, 201, 204, 400, 401, 403, 404) and raising structured `HTTPException`s with clear error messages.
- **Parameter Management**: Defining and validating path parameters, query parameters, and headers to handle complex filtering, pagination, and sorting requirements.
- **Async Implementation**: Writing strictly `async` route handlers to maintain high concurrency and performance in the backend.
- **Documentation & Standards**:
    - Adhering to `backend/CLAUDE.md` guidelines for code style and structure.
    - Implementing endpoints defined in `@specs/api/rest-endpoints.md`.
    - Enriching OpenAPI documentation with clear `tags`, `summary`, and `description` fields for every operation.

## Usage

Invoke this skill when creating new API features, refactoring existing endpoints, or defining the API contract. It ensures that the backend communication layer is reliable, secure, and easy to consume for the frontend.
