# Weather Intelligence Dashboard

A full-stack weather app consuming the [Open-Meteo](https://open-meteo.com/) API (no API key required).

---

## Stack

| Layer    | Technology                              |
|----------|-----------------------------------------|
| Frontend | React 19, TypeScript (strict), Material UI, TanStack Query, Zod |
| Backend  | Node.js, Express, TypeScript (strict), Zod, TypeORM |
| Database | PostgreSQL 16 (optional — search history) |
| Local DB | Docker Compose                          |

---

## Setup

**Prerequisites:** Node 20+, Docker Desktop

```bash
# 1. Clone and enter the project
cd weather-app

# 2. Copy backend env vars
cp backend/.env.example backend/.env

# 3. Start PostgreSQL
docker-compose up -d

# 4. Install dependencies
cd backend && npm install
cd ../frontend && npm install
```

---

## Running Locally

```bash
# Terminal 1 — Backend (http://localhost:3001)
cd backend
npm run dev

# Terminal 2 — Frontend (http://localhost:5173)
cd frontend
npm run dev
```

Vite proxies `/api/*` → `http://localhost:3001` automatically (configured in `vite.config.ts`).

---

## Running Tests

```bash
# Frontend (Vitest)
cd frontend && npm test

# Backend (Jest + Supertest)
cd backend && npm test
```

---

## AWS Deployment Shape

```
Browser
  └─→ CloudFront (CDN + HTTPS)
        └─→ S3 (React SPA — static build output)
              └─→ API Gateway (HTTP API)
                    └─→ Lambda (Express via @vendia/serverless-express adapter)
                          └─→ RDS PostgreSQL (search history, private subnet)
```

### Migration steps (local → AWS)

1. **Frontend** — run `npm run build` in `/frontend`, upload `/dist` to an S3 bucket, point a CloudFront distribution at it.
2. **Backend** — wrap the Express app with `@vendia/serverless-express`; the handler layer in `/backend/src/handlers/` is already structured for this. Deploy as a Lambda function behind API Gateway.
3. **Database** — provision an RDS PostgreSQL instance; set `DATABASE_URL` (or individual `DB_*` env vars) as Lambda environment variables. TypeORM `synchronize: false` in production — use migrations instead.
4. **Secrets** — store DB credentials in AWS Secrets Manager or Parameter Store; inject at Lambda runtime.

> No full infrastructure-as-code is included in this take-home. The application architecture is deployment-ready by design.

---

## Project Structure

```
weather-app/
├── frontend/
│   └── src/
│       ├── components/        # atoms/ molecules/ organisms/
│       ├── features/
│       │   ├── weather/       # search, card, hook, schema
│       │   └── history/       # list, hook, schema
│       ├── test/              # vitest setup
│       ├── theme.ts
│       ├── App.tsx
│       └── main.tsx
├── backend/
│   └── src/
│       ├── handlers/          # Lambda-style thin handlers
│       ├── routes/            # Express route wiring
│       ├── services/          # Business logic
│       ├── repositories/      # TypeORM data access
│       ├── entities/          # TypeORM entities
│       ├── dataSource.ts      # TypeORM DataSource config
│       └── index.ts           # Express entry point
├── docker-compose.yml
└── README.md
```
