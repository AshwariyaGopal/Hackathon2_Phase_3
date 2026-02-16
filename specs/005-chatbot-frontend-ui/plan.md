# Implementation Plan: Todo AI Chatbot - Frontend UI & Interaction

**Branch**: `005-chatbot-frontend-ui` | **Date**: 2026-02-03 | **Spec**: [specs/005-chatbot-frontend-ui/spec.md](spec.md)
**Input**: Feature specification from `/specs/005-chatbot-frontend-ui/spec.md`

## Summary

This feature implements the conversational interface for the Todo AI Assistant using Next.js and a modern design system. The approach involves creating a protected `/chat` route, building a set of reusable chat components (messages, input, loading states), and integrating with the existing backend `/api/{user_id}/chat` endpoint. The UI will focus on visual harmony, responsiveness, and a premium "TaskZen" aesthetic, featuring a centered card-based layout, modern typography, and refined interaction elements.

## Technical Context

**Language/Version**: TypeScript 5.0+, Node.js 20+, React 19 (Next.js 15)
**Primary Dependencies**: Next.js, Tailwind CSS v4, shadcn/ui, OpenAI ChatKit components, lucide-react, framer-motion
**Storage**: `localStorage` (for `conversation_id` persistence), Backend API (for history)
**Testing**: Manual responsive design audit (laptop focus), visual regression check
**Aesthetic**: Modern SaaS, minimal, soft shadows, primary accent colors.
**Layout Strategy**: 
- Card height fixed to `85vh` for balanced desktop viewing.
- Message list set to `overflow-y-auto` for independent scrolling.
- Reduced vertical padding in header and container for compact feel.
- **Internal Alignment Refinement**: Focus on vertical centering of the `EmptyChatState` content and refining vertical rhythm within the `85vh` constraint.
**Constraints**: NO functional changes, maintain existing `useChat` hook and API client.

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

| Principle | Check | Result |
|-----------|-------|--------|
| Spec-driven development | Spec exists at `specs/005-chatbot-frontend-ui/spec.md` | PASS |
| Stateless & persistent | UI fetches history from DB; `conversation_id` in localStorage | PASS |
| Secure user isolation | Uses shared `lib/api.ts` with JWT authentication | PASS |
| Natural & confirmatory | UI optimized to display natural language confirmations | PASS |
| Seamless integration | Builds on Phase II shadcn/ui and Tailwind patterns | PASS |
| Gemini-first | UI designed to showcase Gemini's intent detection and tool results | PASS |

## Project Structure

### Documentation (this feature)

```text
specs/005-chatbot-frontend-ui/
├── spec.md              # Feature specification
├── plan.md              # This file
├── research.md          # Phase 0 output
├── data-model.md        # Phase 1 output
├── quickstart.md        # Phase 1 output
├── contracts/           # Phase 1 output (frontend consumer)
└── tasks.md             # Phase 2 output
```

### Source Code (repository root)

```text
frontend/
├── app/
│   └── chat/
│       └── page.tsx         # Chat route with auth guard
├── components/
│   └── chat/
│       ├── chat-message.tsx     # Bubble variants (user/assistant)
│       ├── chat-input.tsx       # Textarea with send logic
│       ├── typing-indicator.tsx # Animated dots
│       ├── message-list.tsx     # Scroll container with auto-scroll
│       └── empty-state.tsx      # Welcome view
├── hooks/
│   └── use-chat.ts          # State management and API integration
└── lib/
    └── api.ts               # Existing API client (consumer)
```

**Structure Decision**: Option 2 (Web application) is selected. The chat feature will be isolated within the `app/chat` directory and `components/chat` for modularity.

## Complexity Tracking

*No violations detected.*