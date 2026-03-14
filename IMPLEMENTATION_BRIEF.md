# Weather Intelligence Dashboard — Implementation Brief

## Purpose

Build a simple full-stack Weather Intelligence Dashboard that lets a user search for a city and view current weather conditions. The app consumes the Open-Meteo public API (no API key required), proxied through a Node.js backend.

---

## Stack Decision

| Layer      | Choice             | Notes                                    |
|------------|--------------------|------------------------------------------|
| Frontend   | React + TypeScript | Hooks / functional components only       |
| UI library | Material UI        | `theme.ts` for customisation             |
| State      | TanStack Query     | Server state; Zustand only if genuinely needed |
| Validation | Zod                | Co-located with the feature / route      |
| Backend    | Node.js + Express  | Lambda-style handler layer for portability |
| Database   | PostgreSQL + TypeORM | Optional per key brief; included here for completeness |
| Local DB   | Docker             | `docker-compose.yml` for PostgreSQL      |
| Testing    | Vitest + RTL (FE), Jest + Supertest (BE) | Minimal and practical |

---

## Core Features (Mandatory)

1. **City search input** — user types a city name
2. **Current weather display** — temperature, weather condition, wind speed, humidity
3. **Backend proxy** — frontend never calls Open-Meteo directly; all API calls go through the Node.js service
4. **Strict TypeScript** — `any` is banned project-wide

## Optional Features (Included)

5. **Search history** — store city, temperature, timestamp in PostgreSQL; display last N searches

---

## Project Structure

```
weather-app/
├── frontend/                  # React + MUI app
│   ├── src/
│   │   ├── components/        # Atomic: atoms/, molecules/, organisms/
│   │   ├── features/
│   │   │   └── weather/       # WeatherSearch, WeatherCard, hooks, schema
│   │   ├── theme.ts
│   │   ├── App.tsx
│   │   └── main.tsx
│   ├── package.json
│   └── tsconfig.json
│
├── backend/                   # Node.js + Express
│   ├── src/
│   │   ├── handlers/          # Lambda-style thin handlers
│   │   ├── routes/            # Express route wiring
│   │   ├── services/          # Business logic
│   │   ├── repositories/      # TypeORM data access
│   │   ├── entities/          # TypeORM entities
│   │   └── index.ts           # Express entry point
│   ├── package.json
│   └── tsconfig.json
│
├── docker-compose.yml         # Local PostgreSQL
└── README.md                  # Setup + AWS deployment notes
```

---

## API Contract (Backend → Frontend)

```
GET /api/weather?city={city}
→ { city, temperature, condition, windSpeed, humidity, unit, timestamp }

GET /api/history
→ [{ city, temperature, timestamp }]
```

---

## Open-Meteo Integration (Backend)

1. Geocoding: `https://geocoding-api.open-meteo.com/v1/search?name={city}`
2. Forecast: `https://api.open-meteo.com/v1/forecast?latitude=...&longitude=...&current_weather=true&hourly=relativehumidity_2m,windspeed_10m`

---

## AWS Deployment Shape (README section)

```
CloudFront → S3 (React SPA)
SPA → API Gateway (HTTP API) → Lambda → RDS PostgreSQL
```

- Frontend: S3 static hosting + CloudFront CDN
- Backend: API Gateway + Lambda (handler layer already structured for this)
- Database: RDS PostgreSQL (same TypeORM config, connection string via env)

---

## Testing Approach

| Scope       | Tool                        | What to cover                          |
|-------------|-----------------------------|----------------------------------------|
| FE unit     | Vitest + React Testing Library | WeatherCard render, search validation |
| FE hooks    | `@testing-library/react-hooks` | TanStack Query hook behaviour         |
| BE unit     | Jest                        | Service logic, Zod schema validation   |
| BE integration | Supertest + Jest         | `/api/weather` and `/api/history` endpoints |
| E2E         | Playwright (low priority)   | Happy path search flow only if time allows |

---

## Contradictions: Key Brief vs General Directions

| # | Topic | Key Brief | General Directions | Decision |
|---|-------|-----------|--------------------|----------|
| 1 | **Database** | PostgreSQL is **optional** | Full DB section with TypeORM, Docker, entities — implicitly required | **Follow key brief: treat DB as optional but implement it** since the directions provide a complete spec for it. Marked clearly as optional in this brief. |
| 2 | **UI library** | "Use a modern library you are comfortable with" (Tailwind, Shadcn, MUI, Styled Components) | Mandates **Material UI** specifically | **Follow General Directions: use Material UI** — this is a narrowing of the key brief, not a contradiction. Acceptable. |
| 3 | **Weather API** | "Open-Meteo **or** OpenWeatherMap" | Specifies **Open-Meteo only** | **Follow General Directions: use Open-Meteo** — more specific, no key requirement violated. |
