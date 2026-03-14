# AI Rollout Lab

A pnpm monorepo for experimenting with feature-flag rollouts, AI summaries, and analytics. Users browse items and may see an AI summary depending on rollout percentage; admin can adjust flags and view metrics.

## Structure

- **apps/web** — React + TypeScript + Vite. Browse items, view AI summary (when in rollout), submit feedback. Native CSS theme (OKLCH, layers, container queries, view transitions).
- **apps/api** — Node + TypeScript + Express. REST API: items, AI summary (rollout-aware), feedback, events, metrics, admin flag updates. Clean architecture with repository interfaces.
- **workers/analytics** — Python worker. Consumes events from Redis, persists to Postgres.
- **packages/** — Shared TypeScript: `@ai-rollout-lab/ui`, `@ai-rollout-lab/flags`, `@ai-rollout-lab/analytics`.
- **Docker Compose** — Postgres and Redis for local development and the analytics worker.

## Prerequisites

- Node 18+
- pnpm 9+
- Python 3.10+ (for analytics worker)
- Docker & Docker Compose (for Postgres/Redis)

## Quick start

```bash
# Install dependencies
pnpm install

# Start Postgres and Redis (optional; API uses in-memory storage by default)
docker compose up -d

# Run the API (port 4000)
pnpm dev:api

# Run the web app (port 5173)
pnpm dev:web
```

Open http://localhost:5173 — browse items, open one to see an AI summary when your session is in the rollout. Use **Admin** to change the `ai_summary` rollout percentage and view metrics.

## Scripts

| Command | Description |
|--------|-------------|
| `pnpm dev:web` | Start Vite dev server (web) |
| `pnpm dev:api` | Start API with tsx watch |
| `pnpm build` | Build all workspace packages |
| `pnpm test` | Run tests (from root runs all; in apps/web runs Jest) |

### Web app (from `apps/web`)

| Command | Description |
|--------|-------------|
| `pnpm test` | Jest + React Testing Library |
| `pnpm cy:run:component` | Cypress component tests |
| `pnpm cy:run:e2e` | Cypress E2E (start API + web first) |

## Analytics worker

Uses Redis as a queue and Postgres for storage. Start services and run the worker:

```bash
docker compose up -d
cd workers/analytics
python -m venv .venv
source .venv/bin/activate   # Windows: .venv\Scripts\activate
pip install -r requirements.txt
# Optional: export POSTGRES_DSN if Postgres is not on localhost:5433
python main.py
```

Postgres is exposed on **5433** by default (host) to avoid clashing with a local Postgres on 5432. Set `POSTGRES_DSN` to `postgresql://postgres:postgres@localhost:5433/analytics` if needed.

## API endpoints

| Method | Path | Description |
|--------|------|-------------|
| GET | `/health` | Health check |
| GET | `/items` | List items (`?limit=&offset=`) |
| GET | `/items/:id` | Item by id |
| GET | `/items/:id/summary` | AI summary (rollout by `sessionId` / `userId`) |
| POST | `/feedback` | Submit feedback |
| POST | `/events` | Log event |
| GET | `/metrics` | Event counts by kind |
| GET | `/admin/flags` | List rollout flags |
| PATCH | `/admin/flags` | Update flag `key` and `rolloutPercent` |

## License

MIT
