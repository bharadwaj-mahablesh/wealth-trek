# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Wealth Trek is a personal balance sheet platform where users record assets/liabilities, generate net worth certificates, track trends, and get AI-powered financial guidance. Built with Next.js 16 (App Router), React 19, TailwindCSS 4, Clerk auth, SQLite (better-sqlite3), OpenAI, and Razorpay payments.

## Repository Layout

- `app/` — The Next.js application (all commands run from here)
- `app/src/app/` — App Router pages and API routes
- `app/src/components/` — React components (plus `ui/` for shadcn primitives)
- `app/src/hooks/` — Custom React hooks (statements, subscriptions, chat, documents, etc.)
- `app/src/lib/` — Server utilities: `db.ts` (SQLite singleton), `openai.ts`, `pricing.ts`, `razorpay.ts`, `computations.ts`
- `app/src/proxy.ts` — Clerk middleware (protects `/dashboard/*` routes)
- `app/src/types/index.ts` — Shared TypeScript types
- `docs/` — Developer documentation (architecture, API reference, data model, UI docs)
- `openspec/` — Change management artifacts (proposals, designs, specs)
- `VISION.md` — Product vision and roadmap

## Commands

All commands must be run from the `app/` directory:

```bash
npm run dev              # Start dev server (localhost:3000)
npm run build            # Production build
npm run lint             # ESLint
npm run test             # All tests with coverage
npm run test:unit        # Unit tests only (src/lib/__tests__, src/hooks/__tests__)
npm run test:functional  # API route tests (src/app/api)
npm run test:integration # Integration tests (integration/)
npm run test:e2e         # Playwright end-to-end tests
```

Run a single test file: `npx vitest run path/to/test.ts` (from `app/`)

## Architecture Notes

- **Auth**: Clerk middleware in `proxy.ts` protects dashboard routes. API routes individually call `auth()` from `@clerk/nextjs/server` to extract `userId`; all DB queries are scoped to that userId.
- **Database**: SQLite at `app/data/networth.db` locally, `/tmp/networth.db` on Vercel (ephemeral). Schema is auto-created in `lib/db.ts` on first access. Tables: `statements`, `snapshots`, `subscriptions`.
- **AI Chat**: `/api/chat` returns Server-Sent Events (SSE) stream, not JSON.
- **Document Intelligence**: PDF extraction spawns a Python `pdfplumber` process; images use GPT-4o vision. The `/api/documents/upload` and `/api/documents/[id]` routes do NOT use Clerk auth.
- **Path alias**: `@` maps to `app/src/` (configured in vitest and tsconfig).
- **Test environment**: Vitest with jsdom, setup file at `src/test-utils/setup.ts`.
- **CI**: GitHub Actions runs unit + functional tests on PRs (`pr-unit-functional-tests.yml`).

## Environment Variables

Required in `app/.env.local`: Clerk keys (`NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY`, `CLERK_SECRET_KEY`, redirect URLs), `OPENAI_API_KEY`, and optionally `RAZORPAY_KEY_ID`/`RAZORPAY_KEY_SECRET` for payments.
