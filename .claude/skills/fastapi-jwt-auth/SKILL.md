---
name: FastAPI JWT Authentication Expert
description: Specialized in secure JWT integration between Better Auth (frontend) and FastAPI backend using shared BETTER_AUTH_SECRET
version: 0.1.0
---

# FastAPI JWT Authentication Expert

This skill provides comprehensive guidance and implementation support for integrating JSON Web Token (JWT) based authentication and authorization within a FastAPI backend, specifically designed to work seamlessly with a Better Auth frontend using a shared `BETTER_AUTH_SECRET`.

## Core Capabilities

The FastAPI JWT Authentication Expert skill will cover the following aspects:

*   **JWT Dependency for FastAPI Routes**: Implement FastAPI `Depends` functions to automatically extract and validate JWTs from incoming requests for protected routes.
*   **Verify Token Signature with Shared Secret**: Ensure the integrity and authenticity of JWTs by verifying their signatures using the `BETTER_AUTH_SECRET` shared between the frontend (Better Auth) and the FastAPI backend.
*   **Extract and Validate `user_id` from Payload**: Safely decode the JWT payload to extract the `user_id` and validate its presence and format. This `user_id` will be crucial for enforcing ownership.
*   **Enforce User Ownership on All Task Operations**: Integrate the extracted and validated `user_id` into all task-related operations (e.g., creating, reading, updating, deleting tasks) to ensure that users can only access or modify their own resources.
*   **Handle Expired/Invalid Tokens with 401**: Implement robust error handling for expired, malformed, or invalid JWTs, returning appropriate `HTTP_401_UNAUTHORIZED` responses to the client.
*   **Coordinate with Better Auth JWT Plugin on Frontend**: Provide guidance on how the FastAPI backend's JWT implementation aligns with the JWT handling mechanisms provided by the Better Auth frontend plugin, ensuring a smooth end-to-end authentication flow.
*   **Follow Security Best Practices from Specs**: Adhere to established security best practices and any project-specific security specifications related to JWT handling, secret management, and secure API design.

## Usage

To leverage this skill, describe your FastAPI authentication needs, specifically mentioning JWT integration with Better Auth. The skill will then provide code examples, architectural advice, and implementation steps to achieve secure and functional JWT-based authentication.
