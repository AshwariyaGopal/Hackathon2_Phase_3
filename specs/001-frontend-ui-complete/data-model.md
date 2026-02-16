# Data Model: Frontend Entities

**Feature**: Frontend Complete Implementation
**Branch**: `001-frontend-ui-complete`
**Date**: 2026-01-08

## Entities

### User
*Represents the currently authenticated user.*

| Field | Type | Description |
|-------|------|-------------|
| `id` | `string` | Unique identifier (UUID) |
| `email` | `string` | User's email address |
| `name` | `string` | Display name |
| `avatarUrl` | `string` | URL to user's profile picture (optional) |
| `createdAt` | `string` | ISO 8601 timestamp |

### Task
*Represents a unit of work to be done.*

| Field | Type | Description |
|-------|------|-------------|
| `id` | `string` | Unique identifier (UUID) |
| `title` | `string` | Task title (max 100 chars) |
| `description` | `string` | Detailed description (optional) |
| `is_completed` | `boolean` | Completion status |
| `created_at` | `string` | ISO 8601 timestamp |
| `updated_at` | `string` | ISO 8601 timestamp |
| `user_id` | `string` | Owner of the task |

### AuthResponse
*Response from authentication endpoints.*

| Field | Type | Description |
|-------|------|-------------|
| `token` | `string` | JWT access token |
| `user` | `User` | User profile information |

## Validation Rules

- **Task Title**: Required, min 1 char, max 100 chars.
- **Task Description**: Optional, max 500 chars.
- **Email**: Must be a valid email format.
- **Password**: Min 8 characters (enforced on signup).

## State Management

- **Tasks List**: Managed via Server Component fetch + Client-side optimistic updates.
- **Auth Session**: Managed by Better Auth (`useSession` hook).
