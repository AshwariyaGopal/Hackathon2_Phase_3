---
id: 005-IMPLEMENT-003
title: implement-compact-chatbot-ui
stage: green
date: 2026-02-16
surface: agent
model: gemini-2.0-flash
feature: 005-chatbot-frontend-ui
branch: none
user: Dell-Latitude
command: /sp.implement
labels: [frontend, ui, compact, usability]
links:
  spec: specs/005-chatbot-frontend-ui/spec.md
  plan: specs/005-chatbot-frontend-ui/plan.md
  adr: null
  pr: null
files:
  - path: frontend/app/chat/page.tsx
    action: update
  - path: frontend/components/chat/message-list.tsx
    action: update
  - path: frontend/components/chat/chat-message.tsx
    action: update
  - path: frontend/components/chat/chat-input.tsx
    action: update
  - path: specs/005-chatbot-frontend-ui/tasks.md
    action: update
  - path: specs/005-chatbot-frontend-ui/spec.md
    action: update
  - path: specs/005-chatbot-frontend-ui/plan.md
    action: update
tests:
  - type: manual
    description: Verification of fixed 75vh height and independent message area scrolling
    status: pass
---

## Prompt

/sp.implement Make the chatbot UI more compact so the message input is always visible without scrolling.

Requirements:

* Reduce the overall chat container height.
* Limit the chat card to around 70–75vh.
* Make the messages area scrollable (overflow-y-auto).
* Reduce excessive padding and margins.
* Keep the input box fixed at the bottom of the chat card.
* Maintain the existing design and functionality — UI size adjustment only.
* Ensure the layout looks clean and balanced on laptop screens.

Style: minimal, compact, clean SaaS look.

## Response snapshot

I have successfully implemented the compact chatbot UI redesign.

Key changes:
1.  **Fixed Height**: Applied `h-[75vh]` and `max-h-[75vh]` to the main chat card in `app/chat/page.tsx`.
2.  **Scrolling**: Configured the message container to be independently scrollable while keeping the header and input fixed.
3.  **Density Optimization**:
    - Reduced header padding from `py-4` to `py-3`.
    - Reduced `MessageList` padding from `py-6` to `py-4`.
    - Reduced `ChatMessage` margins (`mb-6` to `mb-4`) and avatar size (`w-10` to `w-9`).
    - Reduced `ChatInput` vertical padding and button size.
4.  **Layout Balance**: Maintained the centered `max-w-4xl` layout for laptop readability.

All functional logic remains unchanged.

## Outcome

- ✅ Impact: Improved usability on smaller screens by ensuring the input is always reachable.
- 🧪 Tests: Manual check of scroll behavior and input visibility.
- 📁 Files: Updated 4 frontend components and 3 specification docs.
- 🔁 Next prompts: None
- 🧠 Reflection: Using `vh` units for the container while allowing the inner area to flex is the most robust way to ensure a persistent footer in this layout.

## Evaluation notes (flywheel)

- Failure modes observed: None
- Graders run and results (PASS/FAIL): PASS
- Prompt variant (if applicable): none
- Next experiment (smallest change to try): none
