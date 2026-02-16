# Data Model: Backend Implementation

**Feature**: Backend Complete Implementation & Frontend Integration
**Branch**: `002-backend-implementation`
**Date**: 2026-01-08

## Entities

### User
*Managed primarily by Better Auth on the frontend, but represented in the backend for foreign key relationships.*

| Field | Type | Description |
|-------|------|-------------|
| `id` | `UUID` / `String` | Primary key (from Better Auth) |
| `email` | `String` | Unique user email |
| `name` | `String` | Display name (optional) |
| `created_at` | `DateTime` | Timestamp of registration |

### Task
*Core entity for todo management.*

| Field | Type | Description |
|-------|------|-------------|
| `id` | `UUID` | Primary key |
| `user_id` | `UUID` / `String` | Foreign key to User |
| `title` | `String` | Task title (required, max 100 chars) |
| `description` | `String` | Detailed notes (optional) |
| `is_completed` | `Boolean` | Completion status (default: false) |
| `created_at` | `DateTime` | Server default timestamp |
| `updated_at` | `DateTime` | Server default timestamp, updated on change |

## Validation Rules

- **Task Title**: MUST be provided, MUST NOT be empty, MUST NOT exceed 100 characters.
- **Task Description**: Optional, MUST NOT exceed 1000 characters if provided.
- **User Ownership**: All CRUD operations MUST verify that the `user_id` from the JWT matches the `user_id` of the task being accessed.

## Relationships

- A **User** has many **Tasks**.
- A **Task** belongs to exactly one **User**.
- Cascade Delete: If a User is deleted (not currently in scope for Phase II), their Tasks should also be deleted.
