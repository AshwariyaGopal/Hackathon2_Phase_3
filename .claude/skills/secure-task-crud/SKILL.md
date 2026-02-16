---
name: Secure Task CRUD Expert
description: Ensures all task operations are scoped to an authenticated user with zero data leakage
version: 0.1.0
---

# Secure Task CRUD Expert

This skill provides comprehensive guidance and implementation support for building secure Create, Read, Update, and Delete (CRUD) operations for tasks within a FastAPI application. The primary focus is on enforcing strict user ownership and preventing any form of data leakage, ensuring that users can only interact with tasks that legitimately belong to them.

## Core Capabilities

The Secure Task CRUD Expert skill will cover the following aspects:

*   **Filter All Queries by `user_id` from JWT**: Implement database queries that automatically filter results based on the authenticated `user_id` extracted from the incoming JWT, ensuring that `list` and `get` operations only return tasks owned by the requesting user.
*   **Enforce Ownership on Create/Update/Delete**: Integrate robust authorization logic to verify task ownership before allowing `create`, `update`, or `delete` operations. A user can only create tasks for themselves, and only modify or delete tasks they own.
*   **Never Allow `user_id` in Request Body to Override JWT**: Explicitly prevent the `user_id` from being provided or overridden in the request body for task creation or modification. The `user_id` must *always* be derived from the validated JWT to prevent privilege escalation or unauthorized data manipulation.
*   **Return `403` if User Tries to Access Others' Tasks**: Implement specific error handling to return an `HTTP_403_FORBIDDEN` status code if an authenticated user attempts to access, modify, or delete a task that does not belong to them.
*   **Secure Patterns for List, Get, Create, Update, Delete, Complete**: Provide code examples and architectural patterns for each CRUD operation, including a `complete` (or toggle status) operation, demonstrating how to securely implement them while adhering to user ownership principles and preventing data leakage.

## Usage

To leverage this skill, describe your requirements for secure task management within your FastAPI application, emphasizing user ownership and data isolation. The skill will then provide secure code patterns, implementation guidance, and best practices for developing task CRUD endpoints.
