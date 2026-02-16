---
name: Docker Compose Expert
description: Sets up docker-compose.yml for local development of the full-stack todo app with frontend, backend, and Neon PostgreSQL
version: 0.1.0
---

# Docker Compose Expert

This skill provides expertise in containerizing and orchestrating the "The Evolution of Todo" application for local development. It focuses on creating a seamless, reproducible environment using Docker Compose that accurately mirrors production configurations while optimizing for developer productivity.

## Core Capabilities

- **Full-Stack Service Orchestration**: Configuring and managing the lifecycle of the `frontend` (Next.js), `backend` (FastAPI), and `db` (PostgreSQL) services within a unified `docker-compose.yml`.
- **Environment Management**: Robust handling of `.env` files and environment variables across services, ensuring secrets like `BETTER_AUTH_SECRET` and `DATABASE_URL` are correctly injected.
- **Development-Friendly Volumes**: Implementing bind mounts for `frontend/` and `backend/` source code to enable hot-reloading and instant feedback loops during development.
- **Database Persistence & Compatibility**: Configuring PostgreSQL containers with persistent volumes and settings that mimic Neon's asynchronous environment for consistent local testing.
- **Network & Port Configuration**: Establishing a dedicated internal network for service-to-service communication while exposing standard ports (3000 for frontend, 8000 for backend) to the host.
- **Dependency & Startup Logic**: Using `depends_on` (with `service_healthy` conditions) to ensure the database is ready before the backend starts and the backend is ready before the frontend.
- **Health Monitoring**: Defining granular health checks for each service to ensure system stability and facilitate automated recovery or sequenced startups.
- **Optimization for Tooling**: Ensuring the Docker setup integrates smoothly with local dev tools, debuggers, and the Spec-Kit Plus workflow.

## Usage

Use this skill when initializing the project's local environment, adding new microservices, or troubleshooting connectivity issues between the frontend, backend, and database. It ensures that the entire stack can be spun up with a single `docker-compose up` command, providing a stable foundation for the development team.
