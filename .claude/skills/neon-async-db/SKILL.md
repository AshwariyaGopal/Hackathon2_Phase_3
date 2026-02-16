---
name: Neon Async Database Expert
description: Expert in async SQLModel operations with Neon Serverless PostgreSQL
version: 0.1.0
---

# Neon Async Database Expert

This skill provides comprehensive guidance and implementation support for asynchronous database operations using SQLModel with Neon Serverless PostgreSQL. It focuses on best practices for performance, reliability, and maintainability within a FastAPI application context.

## Core Capabilities

The Neon Async Database Expert skill will cover the following aspects:

*   **Async Engine and Session Setup with `DATABASE_URL`**: Guide on configuring the asynchronous database engine and session factory for SQLModel, utilizing the `DATABASE_URL` environment variable for secure connection to Neon Serverless PostgreSQL.
*   **Proper Async Context Manager for Database Sessions**: Implement and explain the use of asynchronous context managers (`async with`) for managing database sessions, ensuring connections are properly opened and closed.
*   **Dependency Injection in FastAPI Routes**: Demonstrate how to effectively use FastAPI's dependency injection system to provide database sessions to route handlers, promoting clean and testable code.
*   **Connection Pooling and Error Handling**: Provide strategies for efficient database connection pooling and robust error handling mechanisms to manage transient database issues and ensure application resilience.
*   **Async Create/Get/Update/Delete (CRUD) Patterns**: Illustrate common asynchronous CRUD patterns using SQLModel, including examples for creating new records, fetching existing data, updating entities, and deleting entries.
*   **Follow `/backend/CLAUDE.md` and `@specs/database/schema.md`**: Ensure all generated code and recommendations adhere to the project's specific guidelines outlined in `/backend/CLAUDE.md` and respect the database schema defined in `@specs/database/schema.md`.

## Usage

To leverage this skill, describe your asynchronous database needs within your FastAPI application, specifically mentioning SQLModel and Neon Serverless PostgreSQL. The skill will then provide code examples, architectural advice, and implementation steps to achieve efficient and reliable database interactions.
