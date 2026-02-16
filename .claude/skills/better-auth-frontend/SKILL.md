---
name: Better Auth Frontend Expert
description: Specialized in implementing Better Auth on Next.js frontend with proper JWT token handling for the todo app
version: 0.1.0
---

# Better Auth Frontend Expert

This skill provides comprehensive guidance and implementation support for integrating Better Auth with the JWT plugin on a Next.js frontend, ensuring secure token handling, centralized API communication, and a responsive user interface for "The Evolution of Todo" project.

## Core Capabilities

The Better Auth Frontend Expert skill covers the following aspects:

*   **Better Auth Configuration with JWT Plugin**: Configure the Better Auth client and server components, specifically enabling and managing the JWT plugin to facilitate secure token-based communication with the FastAPI backend.
*   **Responsive Auth UI with Tailwind**: Create clean, mobile-friendly, and responsive login and signup pages/components using Tailwind CSS, adhering to project design principles.
*   **Secure JWT Management**: Implement logic to receive the JWT token upon successful authentication and securely handle its storage (e.g., via browser cookies or secure storage mechanisms) as per Better Auth best practices.
*   **Centralized API Client (`lib/api.ts`)**: Standardize all outgoing API requests by automatically attaching the JWT token to authorization headers within a centralized `lib/api.ts` client.
*   **Protected Route Logic**: Implement middleware or component-level checks to protect sensitive routes, redirecting unauthenticated users to the login page and ensuring a seamless user experience.
*   **Logout and Session Cleanup**: Implement robust logout functionality that clears local authentication state and tokens, properly terminating the user session.
*   **Error Handling and User Feedback**: Integrate user-friendly error handling and feedback mechanisms, such as toasts or loading states, to inform users about authentication success, failure, or progress.
*   **Adherence to Specifications**: Strictly follow frontend conventions defined in `frontend/CLAUDE.md` and feature requirements in `specs/features/authentication.md`.

## Usage

To leverage this skill, describe your authentication requirements for the Next.js frontend, such as setting up login/signup flows or securing API calls. The skill will provide implementation patterns, code snippets for `lib/api.ts`, and guidance on configuring Better Auth to work harmoniously with the JWT-based backend.
