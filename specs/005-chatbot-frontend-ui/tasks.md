# Tasks: Todo AI Chatbot - Frontend UI & Interaction

**Input**: Design documents from `/specs/005-chatbot-frontend-ui/`
**Prerequisites**: plan.md, spec.md, research.md, data-model.md, contracts/

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US3, US4)
- File paths are relative to `frontend/` directory

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Project initialization and directory structure

- [x] T001 Create chat component directory at `components/chat/`
- [x] T002 [P] Install `framer-motion` for message animations
- [x] T003 Ensure `lucide-react` is available for chat icons

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Core state management and layout that MUST be complete before user stories

- [x] T004 Implement `use-chat` hook for state management in `hooks/use-chat.ts`
- [x] T005 Define `ClientMessage` and `ClientConversation` types in `lib/types.ts`
- [x] T006 [P] Create `empty-state.tsx` component in `components/chat/empty-state.tsx`
- [x] T007 [P] Create `typing-indicator.tsx` component in `components/chat/typing-indicator.tsx`

**Checkpoint**: Foundation ready - user story implementation can now begin

---

## Phase 3: User Story 1 - Accessing the Chat Interface (Priority: P1)

**Goal**: Implement protected route and basic chat page layout

**Independent Test**: Navigate to `/chat` - verify redirect when logged out and empty chat UI when logged in

### Implementation for User Story 1

- [x] T008 Create `page.tsx` with authentication guard in `app/chat/page.tsx`
- [x] T009 Implement basic `flex-col` layout for chat container in `app/chat/page.tsx`
- [x] T010 [P] Add "Chat Assistant" link to navigation sidebar/header

**Checkpoint**: Chat route is accessible and secure

---

## Phase 4: User Story 2 - Sending and Receiving Messages (Priority: P1)

**Goal**: Implement message bubbles and input with API integration

**Independent Test**: Send a message - verify user bubble appears, typing indicator shows, and assistant response renders

### Implementation for User Story 2

- [x] T011 [P] [US2] Create `chat-message.tsx` with role-based alignment in `components/chat/chat-message.tsx`
- [x] T012 [P] [US2] Create `chat-input.tsx` with "Enter to send" in `components/chat/chat-input.tsx`
- [x] T013 [US2] Create `message-list.tsx` with auto-scroll logic in `components/chat/message-list.tsx`
- [x] T014 [US2] Integrate `use-chat` hook with backend `POST /api/{user_id}/chat` using `lib/api.ts`
- [x] T015 [US2] Implement Optimistic UI updates in `hooks/use-chat.ts`

**Checkpoint**: Interactive messaging flow is functional

---

## Phase 5: User Story 3 - Persistence and History (Priority: P2)

**Goal**: Handle conversation IDs and history fetching

**Independent Test**: Refresh page - verify chat history reloads from backend using `conversation_id`

### Implementation for User Story 3

- [x] T016 [US3] Implement `conversation_id` persistence in `localStorage` within `hooks/use-chat.ts`
- [x] T017 [US3] Implement history fetching logic in `hooks/use-chat.ts`
- [x] T018 [US3] Update `app/chat/page.tsx` to handle `id` query parameter for direct chat access

**Checkpoint**: Conversations persist across sessions and refreshes

---

## Phase 6: User Story 4 - Visual Feedback and UI Polish (Priority: P2)

**Goal**: Add animations, toasts, and mobile optimizations

**Independent Test**: Verify animations on message entrance and responsive layout on small screens

### Implementation for User Story 4

- [x] T019 [US4] Add `framer-motion` entrance animations to `chat-message.tsx`
- [x] T020 [US4] Implement success/error toasts using `use-toast` for action feedback
- [x] T021 [US4] Apply `dvh` (dynamic viewport height) units to chat container for mobile keyboard support
- [x] T022 [P] [US4] Add `MessageSkeleton` loading shimmer for initial history load

**Checkpoint**: Chat UI feels premium and polished

---

## Phase 7: Polish & Cross-Cutting Concerns

**Purpose**: Final accessibility audit and documentation

- [x] T023 Add ARIA labels to chat input and message list for screen readers
- [x] T024 Audit dark mode contrast and color consistency
- [x] T025 [P] Update `README.md` with chat screenshots and usage instructions
- [x] T026 Run `quickstart.md` validation scenario

---

## Phase 8: TaskZen UI Redesign - Layout & Branding (User Story 5)

**Goal**: Implement the core structural and branding changes for the TaskZen aesthetic.

**Independent Test**: Navigate to `/chat` on a laptop screen - verify centered layout, new heading, and updated navbar.

- [x] T027 [US5] Center the chat container and apply `max-w-4xl` in `app/chat/page.tsx`
- [x] T028 [US5] Implement the "Meet your AI Assistant" heading and AI icon in `components/chat/empty-state.tsx`
- [x] T029 [US5] Redesign the navbar with improved spacing and active link highlighting in `components/layout/header.tsx`
- [x] T030 [US5] Update navbar buttons with primary/secondary contrast in `components/layout/header.tsx`

---

## Phase 9: TaskZen UI Redesign - Component Refinement (User Story 5)

**Goal**: Apply premium card-based styling and modern input controls.

**Independent Test**: Send/receive messages - verify card-style bubbles, modern input with focus glow, and updated chips.

- [x] T031 [US5] Redesign `chat-message.tsx` bubbles to use card-based layout with soft shadows and 16-20px rounding
- [x] T032 [US5] Update suggestion chips with soft rounding and hover effects in `components/chat/empty-state.tsx`
- [x] T033 [US5] Implement modern chat input with full rounding and focus glow in `components/chat/chat-input.tsx`
- [x] T034 [US5] Update send button with modern icon in `components/chat/chat-input.tsx`

---

## Phase 10: TaskZen UI Redesign - Polish (User Story 5)

**Goal**: Final visual audit and verification.

- [x] T035 [US5] Audit responsive design for laptop screens and verify "soft modern" color palette
- [x] T036 [US5] Verify no logic changes were introduced during UI overhaul

---

## Phase 11: Compact Chatbot UI - Usability Overhaul (User Story 6)

**Goal**: Make the chat interface more compact and ensure the input is always visible.

**Independent Test**: Navigate to `/chat` - verify the card height is limited to `~75vh` and the message area is scrollable.

- [x] T037 [US6] Apply `max-h-[75vh]` and `h-[75vh]` to the chat card in `app/chat/page.tsx`
- [x] T038 [US6] Ensure `overflow-y-auto` is correctly applied to the message area in `app/chat/page.tsx` or `message-list.tsx`
- [x] T039 [US6] Reduce vertical padding in the header and card container in `app/chat/page.tsx`
- [x] T040 [US6] Verify input box remains fixed and visible at all times on laptop screens

---

## Phase 12: Responsive Optimization (User Story 4)

**Goal**: Ensure the chatbot UI is fully responsive across mobile and desktop devices.

**Independent Test**: Resize browser to mobile width - verify chat card fills viewport and padding is optimized.

- [x] T041 [US4] Implement responsive height and padding in `app/chat/page.tsx`
- [x] T042 [US4] Adjust `EmptyChatState` icon and typography for mobile screens
- [x] T043 [US4] Optimize `ChatMessage` and `MessageList` spacing for narrow viewports
- [x] T044 [US4] Verify theme consistency and interaction quality on mobile

---

## Phase 13: TaskZen UI Refinement - Internal Alignment (User Story 5)

**Goal**: Perfectly align internal elements within the 85vh chatbot card.

**Independent Test**: Navigate to `/chat` - verify AI logo is vertically centered in the empty state and spacing is balanced.

- [x] T045 [US5] Implement vertical centering for `EmptyChatState` content within the message area
- [x] T046 [US5] Reduce top spacing and refine vertical rhythm between heading, description, and chips in `empty-state.tsx`
- [x] T047 [US5] Ensure balanced padding and consistent layout in `app/chat/page.tsx`
- [x] T048 [US5] Audit alignment to ensure no content overflow within the fixed height

---

## Phase 14: TaskZen UI - Vertical Alignment Final Polish (User Story 5)

**Goal**: Achieve perfect vertical balance and rhythmic spacing within the chatbot card.

**Independent Test**: Navigate to `/chat` - verify the empty state stack is perfectly centered and spacing between all elements is identical/balanced.

- [x] T049 [US5] Refine `EmptyChatState` to remove extra top whitespace and ensure perfect vertical centering
- [x] T050 [US5] Standardize spacing (gaps) between logo, heading, description, and chips for vertical rhythm
- [x] T051 [US5] Audit `app/chat/page.tsx` for symmetric padding and alignment of the input area
- [x] T052 [US5] Verify that the stack remains centered without clipping on laptop screens

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: Start immediately
- **Foundational (Phase 2)**: Depends on Setup
- **User Story 1 & 2 (Phase 3-4)**: Depends on Foundational. US2 depends on US1 layout.
- **User Story 3 (Phase 5)**: Depends on US2 (API integration)
- **User Story 4 (Phase 6)**: Depends on US1-3 completion
- **Polish (Final Phase)**: Depends on all user stories

### Parallel Opportunities

- T001-T003 (Setup)
- T006-T007 (Foundational components)
- T011-T012 (Chat UI components)
- T019-T022 (UI Enhancements)

---

## Implementation Strategy

### MVP First (User Story 1 & 2)

1. Complete Setup and Foundational
2. Create `/chat` route
3. Implement basic message bubbles and input
4. Connect to API
5. **Result**: A working chat that communicates with the AI but doesn't persist history yet.

### Incremental Delivery

1. Add History Persistence (US3) -> Professional feel
2. Add Animations and Mobile Polish (US4) -> Premium feel
3. Final Accessibility and Performance (Polish) -> Showcase quality

---

## Notes

- All backend communication MUST use the existing `lib/api.ts`
- Ensure `use-chat` hook handles 401/403 errors by triggering logout/redirect
- Use standard shadcn/ui component patterns for consistency
- Verify auto-scroll works even when the user is scrolling up (optional: add "scroll to bottom" button)
