---
name: SQLModel Task Models Expert
description: Defines clean, type-safe SQLModel models for tasks and users, ensuring data integrity and consistency.
version: 0.1.0
---

# SQLModel Task Models Expert

This skill provides comprehensive guidance and implementation support for defining robust, type-safe SQLModel models for tasks and users within a FastAPI application. It emphasizes adherence to best practices for database schema design, data integrity, and seamless integration with Pydantic for data validation.

## Core Capabilities

The SQLModel Task Models Expert skill will cover the following aspects:

*   **Task Model with `id`, `user_id`, `title`, `description`, `completed`, Timestamps**: Design and implement the core `Task` SQLModel, including fields for unique identification (`id`), associating with a user (`user_id`), descriptive attributes (`title`, `description`), status (`completed`), and automatic timestamps (`created_at`, `updated_at`).
*   **Proper Relationships and Indexes**: Establish correct database relationships between `User` and `Task` models (e.g., one-to-many relationship where a user can have multiple tasks). Define appropriate indexes on frequently queried columns (e.g., `user_id`, `created_at`) to optimize database performance.
*   **Pydantic Validation**: Leverage SQLModel's inherent Pydantic integration to define schema validation rules, ensuring data consistency and correctness upon model instantiation and data insertion/update.
*   **Table Creation and Migration Patterns**: Provide patterns and best practices for creating database tables based on SQLModel definitions and for managing schema evolution through database migrations, if applicable.
*   **Reference `@specs/database/schema.md`**: Ensure all generated models and schema definitions strictly adhere to the project's database schema specifications outlined in `@specs/database/schema.md`, maintaining consistency across the project.

## Usage

To leverage this skill, describe your requirements for defining SQLModel entities for tasks and users within your FastAPI application. The skill will then provide code examples for model definitions, relationship setup, and guidance on integrating them into your database layer.
