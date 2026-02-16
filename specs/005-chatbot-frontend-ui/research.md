# Research: Todo AI Chatbot - Frontend UI & Interaction

**Feature**: 005-chatbot-frontend-ui
**Date**: 2026-02-03

## Research Tasks

### 1. Chat UI Components & Layout
- **Objective**: Identify the best component structure for a premium chat experience.
- **Decision**: Use a combination of shadcn/ui components (ScrollArea, Textarea, Avatar, Button) and custom message bubbles. We will implement a flexbox layout with `flex-col-reverse` or a standard `flex-col` with `scrollIntoView` for bottom alignment.
- **Rationale**: Provides maximum control over styling while maintaining consistency with the Phase II design system.

### 2. Conversation Persistence
- **Objective**: Decide between `localStorage` and URL parameters for `conversation_id`.
- **Decision**: Use a hybrid approach. The `conversation_id` will be stored in `localStorage` to persist across refreshes, but can also be optionally reflected in the URL query string (e.g., `/chat?id=123`) to allow direct linking to specific chats.
- **Rationale**: `localStorage` is more robust for session persistence, while URL params help with navigation and debugging.

### 3. Auto-Scroll Behavior
- **Objective**: Ensure the chat always scrolls to the latest message.
- **Decision**: Use a `useEffect` hook that watches the `messages` array and triggers `scrollIntoView({ behavior: 'smooth' })` on a hidden "bottom" div.
- **Rationale**: Standard React pattern for chat interfaces that ensures user focus remains on the newest content.

### 4. API Integration & Optimistic Updates
- **Objective**: Reduce perceived latency when sending messages.
- **Decision**: Implement optimistic UI updates. When a user clicks send, immediately add their message to the local state with a "pending" status before the API call finishes.
- **Rationale**: Makes the app feel significantly faster and more responsive, which is a core goal for Phase III.

### 5. Mobile Keyboard Handling
- **Objective**: Prevent the mobile keyboard from obscuring the input field.
- **Decision**: Use `viewport` units and ensure the main container is set to `h-[dvh]` (Dynamic Viewport Height) to properly account for browser UI and the on-screen keyboard.
- **Rationale**: Essential for mobile usability, ensuring the input box "sticks" above the keyboard.

## Summary of Decisions

| Topic | Chosen Path |
|-------|-------------|
| Components | shadcn/ui + custom bubbles |
| Persistence | `localStorage` (Primary) + URL Query (Secondary) |
| Scrolling | Smooth `scrollIntoView` on message update |
| Latency | Optimistic UI updates |
| Mobile UX | `dvh` units for layout |
