# Frontend Quickstart

**Feature**: Frontend Complete Implementation
**Branch**: `001-frontend-ui-complete`

## Prerequisites

- Node.js 20+
- `npm` or `pnpm`
- Backend server running on `http://localhost:8000` (for API calls)

## Setup

1. **Navigate to the frontend directory**:
   ```bash
   cd frontend
   ```

2. **Install dependencies**:
   ```bash
   npm install
   # or
   pnpm install
   ```

3. **Configure Environment Variables**:
   Create a `.env.local` file in the `frontend` root:
   ```env
   NEXT_PUBLIC_API_URL=http://localhost:8000/api
   BETTER_AUTH_URL=http://localhost:3000
   ```

## Development

1. **Start the development server**:
   ```bash
   npm run dev
   ```

2. **Open the application**:
   Visit `http://localhost:3000` in your browser.

## Testing

1. **Run Unit/Component Tests**:
   ```bash
   npm run test
   ```

2. **Run E2E Tests (Playwright)**:
   ```bash
   npx playwright test
   ```

## Design System

- **Tailwind Config**: Check `tailwind.config.ts` for color palette and theme extensions.
- **Components**: Reusable components are located in `components/ui`.
- **Icons**: Use `lucide-react` for all icons.
