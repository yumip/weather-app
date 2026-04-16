# Weather Intelligence Dashboard

<img width="1150" height="760" alt="Screenshot 2026-04-16 at 7 30 11 pm" src="https://github.com/user-attachments/assets/c4a00059-c5cb-417e-ab27-5513b9022ebe" />


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
│   ├── src/
│   │   ├── app.ts             # Express app setup
│   │   ├── server.ts          # Server/bootstrap entry point
│   │   ├── data-source.ts     # TypeORM datasource config
│   │   ├── middlewares/       # Validation and error middleware
│   │   └── weather/
│   │       ├── routes/        # Express routes
│   │       ├── handlers/      # Express handlers and transport-agnostic handler logic
│   │       ├── services/      # Business logic and weather API integration
│   │       ├── repositories/  # Search history data access
│   │       ├── schemas/       # Zod schemas
│   │       ├── entities/      # TypeORM entities
│   │       ├── types/         # Shared types
│   │       └── utils/         # Feature utilities
│   ├── jest.config.js
│   ├── package.json
│   └── tsconfig.json
├── docker-compose.yml
└── README.md
```

---

## Assumptions

- The first geocoding match is treated as the intended city result.
- As the search history is an optional enhancement, even when the database is unavailable, the search flow itself should work as expected.
- The project is scoped for a take-home assignment, so authentication, advanced personalisation, and full infrastructure provisioning are out of scope.
- The AWS deployment section describes a future-ready target architecture rather than a fully implemented cloud deployment.

---

## Architecture Decisions

- **React + TypeScript + Material UI** — strict TypeScript throughout, with MUI and a centralised `theme.ts` for consistent styling and theming.
- **TanStack Query for server state** — handles loading, error, caching, and query invalidation cleanly while keeping async state management simple.
- **Zod validation at the boundary** — frontend schemas are co-located with feature API usage, while backend request validation is handled through reusable Express middleware. External API payloads are also validated with Zod before use.
- **Node.js + Express with a thin adapter layer** — Express routes remain lightweight, while thin Express handlers adapt `req`/`res` into a transport-agnostic handler contract. This keeps the core request-handling flow reusable and easier to adapt to API Gateway/Lambda later.
- **Clear separation of concerns** — routes define endpoints, handlers manage HTTP adaptation, services contain business logic and weather API integration, and repositories isolate persistence concerns for search history.
- **PostgreSQL + TypeORM** — minimal persistence layer for recent search history, with graceful degradation when the database is unavailable. `synchronize: true` is used only for local development convenience.
- **Production-aware without overengineering** — the structure stays intentionally small and interview-appropriate, while still keeping validation, error handling, integration logic, and persistence clearly separated.

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

- **Frontend** — static React build hosted on S3 behind CloudFront.
- **Backend** — Node.js backend adapted to run behind API Gateway and Lambda.
- **Database** — optional PostgreSQL search history can be hosted in RDS.
- **Configuration** — secrets and environment variables managed outside the codebase.

## AI usage:

- Used cursor with sonnet 4.6 for code generation,
- `IMPLEMENTIAON_BRIEF.md` was created at the start of the task but the final structure and codebases were evolved by me during implementation and refactoring.
- `CURSOR_PROMPTS.md` was initially generated with sonnet 4.6 as a working scaffold. It should be treated as a guideline rather than an exact record of the final prompts used, as the prompts were updated iteratively throughout development.
- All the chat scripts are stored in `cursor_weather_intelligence_dashboard_i.md`
