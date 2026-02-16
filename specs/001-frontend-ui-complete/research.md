# Research & Findings: Frontend Complete Implementation

**Feature**: Frontend Complete Implementation
**Branch**: `001-frontend-ui-complete`
**Date**: 2026-01-08

## 1. Better Auth Integration with Next.js App Router

**Decision**: Use `better-auth/client` for client-side hooks and `lib/api.ts` interceptors for JWT injection.

**Rationale**:
- Better Auth provides optimized hooks (`useSession`, `signIn`, `signUp`) that integrate seamlessly with Next.js client components.
- Centralizing JWT injection in `lib/api.ts` ensures all API calls are authenticated without repetition in individual components.
- Storing the JWT securely (e.g., in memory or HttpOnly cookies handled by the auth library) is crucial. Better Auth's default behavior aligns with best practices.

**Alternatives Considered**:
- **Manual Context**: Implementing a custom AuthContext. Rejected because Better Auth handles session state, persistence, and updates more robustly.
- **Middleware-only Auth**: Relying solely on Next.js middleware. Rejected because the backend is separate (FastAPI), requiring client-side token management for API requests.

## 2. UI Component Strategy (shadcn/ui + Tailwind)

**Decision**: Adopt `shadcn/ui` pattern (copy-paste components) tailored with a custom design system.

**Rationale**:
- **Control**: `shadcn/ui` provides full ownership of component code, allowing precise customization of styles and behaviors required for the "premium" look.
- **Accessibility**: Built on Radix UI primitives, ensuring high accessibility standards (keyboard nav, ARIA) out of the box.
- **Consistency**: Tailwind configuration ensures consistent colors, typography, and spacing across all components.

**Alternatives Considered**:
- **MUI/Chakra**: Rejected due to the constraint against "heavy external UI libraries" and the preference for Tailwind.
- **Hand-rolled components**: Rejected for complex interactive elements (modals, dropdowns) due to the high effort to get accessibility right.

## 3. State Management & Data Fetching

**Decision**: Use React Server Components (RSC) for initial data fetching and `useOptimistic` / Server Actions (or simple API calls if Server Actions complicate the separate backend architecture) for mutations.

**Rationale**:
- **Performance**: RSCs reduce client bundle size and improve First Contentful Paint (FCP).
- **UX**: Optimistic updates provide immediate feedback for actions like toggling task status, essential for the "snappy" feel.

**Refinement**: Since the backend is external (FastAPI), strict "Server Actions" might be less natural than direct API calls from client components or a thin server-side proxy layer. We will use a mixed approach:
- **Fetch**: Server components fetch data directly from FastAPI (passing auth tokens).
- **Mutate**: Client components call `lib/api.ts` which hits FastAPI. Optimistic UI handled via React hooks.

## 4. Dark Mode Implementation

**Decision**: `next-themes` with a custom `ThemeToggle` component.

**Rationale**:
- Standard solution for Next.js, handles hydration mismatch and system preference detection automatically.
- Integrates perfectly with Tailwind's `darkMode: 'class'` strategy.

## 5. Responsive Design Strategy

**Decision**: Mobile-first Tailwind classes (`w-full md:w-1/2 lg:w-1/3`).

**Rationale**:
- Ensures the app works on small screens by default.
- Grid layouts for the task dashboard allow elegant scaling from list view (mobile) to grid view (desktop).
