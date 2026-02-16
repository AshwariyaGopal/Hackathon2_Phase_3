# TaskZen - Frontend (Phase II)

A stunning, professional, and visually polished Next.js frontend for the multi-user todo application.

## Key Features

- **Premium UI/UX**: Clean, modern design inspired by top-tier productivity apps.
- **Secure Authentication**: Robust signup and login flows integrated with Better Auth and JWT.
- **Dynamic Dashboard**: Efficient task management with real-time updates and satisfying micro-interactions.
- **Universal Responsiveness**: Flawless experience across mobile, tablet, and desktop devices.
- **Dark Mode Support**: Seamless transition between light and dark themes.
- **Performance Optimized**: Fast loading with skeleton screens and smooth transitions.

## Tech Stack

- **Framework**: [Next.js 16+ (App Router)](https://nextjs.org/)
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **Styling**: [Tailwind CSS v4](https://tailwindcss.com/)
- **Components**: [shadcn/ui](https://ui.shadcn.com/) patterns with Radix UI primitives.
- **Authentication**: [Better Auth](https://www.better-auth.com/)
- **Icons**: [Lucide React](https://lucide.dev/)

## Getting Started

1.  **Navigate to the frontend directory**:
    ```bash
    cd frontend
    ```
2.  **Install dependencies**:
    ```bash
    npm install
    ```
3.  **Configure environment variables**:
    Create a `.env.local` file:
    ```env
    NEXT_PUBLIC_API_URL=http://localhost:8000/api
    BETTER_AUTH_URL=http://localhost:3000
    ```
4.  **Run the development server**:
    ```bash
    npm run dev
    ```

## Project Structure

- `app/`: Next.js App Router pages and layouts.
- `components/ui/`: Reusable, atomic UI components.
- `components/tasks/`: Task-specific feature components.
- `components/auth/`: Authentication forms and logic.
- `lib/api.ts`: Centralized API client for all backend communication.
- `hooks/`: Custom React hooks for state management.