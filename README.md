# A.I.R.A. (ABIS Internal Resource Assistant)

A production-ready internal Employee Chatbot built with Next.js + Vercel AI SDK.

## What's configured

- Branding for ABIS Food Pvt Ltd and assistant name **A.I.R.A.**
- JWT-protected employee chat access
- Pinecone retrieval-first chatbot flow for HR/IT/Admin policy Q&A
- OpenAI or OpenRouter model routing via environment variables
- English-first behavior with Indian language responses when requested
- In-app knowledge base uploader for batch HR/SOP document ingestion

## Core environment variables

Copy `env.template` and configure:

- `OPENAI_API_KEY`
- `AI_PROVIDER` (`openai` or `openrouter`)
- `OPENROUTER_API_KEY` (if using OpenRouter)
- `PINECONE_API_KEY`
- `PINECONE_INDEX_NAME`
- `JWT_SECRET`
- `ALLOWED_EMPLOYEE_IDS` (optional comma-separated allow-list)

## Uploading 50+ HR docs and dummy data

After employee login, use the **Knowledge Base Upload** panel in the chat page:

1. Select multiple files (supports batch upload).
2. Keep namespace as `default` (or use custom namespace).
3. Click **Upload to Pinecone**.
4. Uploaded chunks become searchable via `vectorDatabaseSearch`.

### File format support

Direct support in this environment:
- `.txt`, `.md`, `.csv`, `.tsv`, `.json`, `.xml`, `.log`

For office formats, convert before upload:
- `.xlsx` / `.xls` → export to `.csv`
- `.docx` / `.doc` / `.pdf` / `.pptx` → export to `.txt` or `.md`

## JWT auth flow

1. Employee enters ID in header login form.
2. `POST /api/auth/token` issues signed JWT.
3. Chat and ingestion APIs require `Authorization: Bearer <token>`.
4. Middleware validates token on protected routes.

## Deployment

Deploy on Vercel and set all environment variables in Project Settings.
