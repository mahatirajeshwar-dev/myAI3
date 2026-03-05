# MyAI3 Repository Guide

## Adding/Removing Tools

Each tool has a file in `app/api/chat/tools/`. The tool is then imported in `app/api/chat/tools/route.ts`. The UI display for the tool is handled in `components/messages/tool-call.tsx` and then must also be added to `components/messages/assistant-message.tsx`.
