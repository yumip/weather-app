# Weather Intelligence Dashboard

## Overview

A full-stack weather dashboard that lets users search for a city and view current conditions. The frontend calls a Node.js backend, which proxies requests to the [Open-Meteo API](https://open-meteo.com/) (no API key required). Recent searches are optionally stored in PostgreSQL.

| Layer    | Technology                                                      |
| -------- | --------------------------------------------------------------- |
| Frontend | React 19, TypeScript (strict), Material UI, TanStack Query, Zod |
| Backend  | Node.js, Express, TypeScript (strict), Zod, TypeORM             |
| Database | PostgreSQL 16 — optional, powers recent search history          |
| Local DB | Docker Compose                                                  |

---

## Setup

**Prerequisites:** Node 20+, Docker

```bash
# 1. Copy backend env vars
cp backend/.env.example backend/.env

# 2. Start PostgreSQL
docker-compose up -d

# 3. Backend (http://localhost:3001)
cd backend && npm install && npm run dev

# 4. Frontend (http://localhost:5173) — new terminal
cd frontend && npm install && npm run dev
```

Vite proxies `/api/*` → `http://localhost:3001` automatically.

> The app works without the database — history is silently disabled if PostgreSQL is unavailable.

### Running tests

```bash
cd frontend && npm test   # Vitest + React Testing Library
cd backend  && npm test   # Jest + Supertest
```

---

## Project Structure

```
weather-app/
├── frontend/
│   └── src/
│       ├── features/
│       │   ├── weather/           # WeatherPage, WeatherCard, useWeather, schema, api
│       │   └── history/           # HistoryPanel, useHistory, schema, api
│       ├── shared/
│       │   └── components/        # SearchInput, ErrorState, LoadingState
│       ├── lib/api/               # fetchAndParse, requestFactory
│       ├── theme.ts
│       ├── App.tsx
│       └── main.tsx
├── backend/
│   └── src/
│       ├── weather/
│       │   ├── handlers/          # Lambda-style thin handlers + contract
│       │   ├── routes/            # Express route wiring
│       │   ├── services/          # Business logic (Open-Meteo calls)
│       │   ├── repositories/      # TypeORM data access
│       │   ├── entities/          # TypeORM entity definitions
│       │   ├── schemas/           # Zod schemas (query params, API payloads)
│       │   ├── types/             # Shared TypeScript types
│       │   └── utils/             # WeatherError, parseOrThrow, weather-code map
│       ├── data-source.ts         # TypeORM DataSource config
│       └── index.ts               # Express entry point
├── docker-compose.yml
└── README.md
```

---

## Architecture Decisions

- **React + TypeScript + Material UI** — strict TypeScript throughout; MUI with a centralised `theme.ts` for all customisation; no inline styling except layout.
- **TanStack Query** for server state — handles loading/error/stale states, cache invalidation, and query keying per city.
- **Zod validation co-located with feature/route** — frontend schemas live next to the API call; backend schemas live next to the route handler. No shared schema abstraction.
- **Node.js + Express** — local runtime; thin Lambda-style handler layer (`ok`/`err` contract) means the backend can be placed behind API Gateway without rewriting business logic.
- **Service / repository separation** — handlers are kept thin; business logic sits in the service; data access is isolated in the repository. Easy to test each layer independently.
- **PostgreSQL + TypeORM** — minimal entity and repository; `synchronize: true` in development only. The feature degrades gracefully if the DB is offline.
- **Production-aware, not enterprise-heavy** — no excessive abstraction; structure scales up without major refactoring.

---

## AWS Deployment Shape

```
Browser
  ├─→ CloudFront
  │     └─→ S3 (React production build)
  └─→ API Gateway
          └─→ Lambda (Node.js backend)
                  └─→ RDS PostgreSQL (recent search history, optional)
```

- **Frontend** — `npm run build` → upload `/dist` to S3 → point a CloudFront distribution at the bucket.
- **Backend** — the Express app is adaptable to Lambda behind API Gateway; the existing handler layer requires no rewrite.
- **Database** — replace local PostgreSQL with RDS; set `DB_HOST`, `DB_PORT`, `DB_USER`, `DB_PASSWORD`, and `DB_NAME` as Lambda environment variables. Set `NODE_ENV=production` to disable `synchronize`.
- **Configuration** — env vars and secrets managed outside the codebase (e.g. AWS Secrets Manager or Parameter Store).

## AI usage:

- Used cursor with sonnet 4.6 for code generation,
- `IMPLEMENTIAON_BRIEF.md` was created at the start of the task but the final structure and codebases were evolved during implementation and refactoring.
- `CURSOR_PROMPTS.md` was initially generated with sonnet 4.6 as a working scaffold. It should be treated as a guideline rather than an exact record of the final prompts used, as the prompts were updated iteratively throughout development.
- All the chat scripts are stores in `cursor_weather_intelligence_dashboard_i.md`
