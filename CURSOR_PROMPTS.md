# Cursor Prompt Boilerplate — Weather Intelligence Dashboard

# Model: claude-sonnet-4-5 (Sonnet 4.6 in Cursor)

---

## HOW TO USE

Paste the relevant prompt block into Cursor's chat. Each block is scoped to one
implementation step. Run them in order. Adjust file paths if your folder names differ.

---

## PROMPT 0 — Project Bootstrap

```
You are scaffolding a full-stack Weather Intelligence Dashboard take-home assignment.

Stack:
- Frontend: React + TypeScript (strict, no `any`), Material UI, TanStack Query, Zod
- Backend: Node.js + TypeScript, Express, Zod, Lambda-style handler layer
- Database: PostgreSQL + TypeORM (optional feature, include it)
- Local DB: Docker Compose

Create the monorepo shell only — no implementation yet:
1. /frontend — Vite + React + TypeScript app with MUI, TanStack Query, Zod installed
2. /backend — Node.js + TypeScript Express app with Zod, TypeORM, pg installed
3. /docker-compose.yml — PostgreSQL service, port 5432, env vars for local dev
4. /README.md — placeholder with sections: Setup, Running Locally, AWS Deployment Shape

Rules:
- tsconfig strict: true for both frontend and backend
- No `any` anywhere
- Keep dependencies minimal and relevant only to this brief
- Do not scaffold any component or route implementations yet
```

---

## PROMPT 1 — Backend: Weather Route

```
Context: We are building the backend of a Weather Intelligence Dashboard.
- Express + TypeScript (strict, no `any`)
- Open-Meteo API (no API key needed)
- Lambda-style thin handler, business logic in service layer
- Zod validation co-located in this feature

Implement the following in /backend/src/:

1. entities/SearchHistory.ts
   - TypeORM entity: id (uuid), city (string), temperature (number), timestamp (Date)

2. repositories/searchHistoryRepository.ts
   - save(city, temperature): Promise<SearchHistory>
   - findRecent(limit: number): Promise<SearchHistory[]>

3. services/weatherService.ts
   - getWeatherByCity(city: string):
     a. Call Open-Meteo geocoding API to resolve city → lat/lon
     b. Call Open-Meteo forecast API for current_weather + humidity + windspeed
     c. Return typed WeatherResult object
     d. Save result to SearchHistory via repository

4. handlers/weatherHandler.ts
   - Lambda-style: (event: HandlerEvent) => Promise<HandlerResponse>
   - Validate query param `city` with Zod; return 400 if missing/invalid
   - Call weatherService, return 200 with weather data

5. routes/weatherRoutes.ts
   - GET /api/health - just returns app is alive
   - GET /api/weather?city={city} — wires Express route to handler
   - GET /api/history — returns last 10 search history entries

Keep handler thin. All logic stays in service. Return proper HTTP status codes.
Types must be explicit — no `any`.
```

---

## PROMPT 2 — Frontend: Theme and Atomic Atoms

```
Context: Weather Intelligence Dashboard frontend.
- React + TypeScript (strict), Material UI, no `any`
- BOM-inspired aesthetic: clean, data-focused, not decorative

Implement the following in /frontend/src/:

1. theme.ts
   - MUI createTheme with:
     - Primary colour: deep blue (#1565C0)
     - Background: light grey (#F5F7FA)
     - Typography: clean sans-serif
     - No excessive overrides — keep it minimal

2. components/atoms/SearchInput.tsx
   - Props: value, onChange, onSubmit, loading (boolean)
   - MUI TextField + IconButton (search icon)
   - Disable submit when loading
   - No inline styles except minor alignment

3. components/atoms/WeatherMetric.tsx
   - Props: label (string), value (string | number), unit?: string
   - Displays a single metric (e.g. "Temperature: 22°C")
   - Use MUI Typography
4. install MUI icons
  - use icons in an infographic way, similar to https://www.bom.gov.au/

Rules:
- Strict types; no prop type shortcuts
- Export each component as named export
- No business logic in components
```

---

## PROMPT 3 — Frontend: Weather Feature

```
Context: Weather Intelligence Dashboard frontend.
- React + TypeScript (strict), Material UI, no `any`
- BOM-inspired aesthetic: clean, data-focused, not decorative

Tech stack:
- React
- TypeScript (strict)
- TanStack Query
- Zod
- Material UI

Use this folder structure:

/frontend/src/features/weather/
api/
weather.api.ts
components/
WeatherCard.tsx
hooks/
useWeather.ts
schemas/
weather.schema.ts
constants/
weather.constants.ts
pages/
WeatherFeature.tsx

Requirements:

1. `api/weather.api.ts`
- Implement the endpoint fetch for `GET /api/weather?city={city}`
- Use the preimplemented helper(s) from `lib/api`
- This layer must stay strictly focused on request construction / fetching
- Do not put validation or UI logic here
- Return raw parsed JSON boundary for validation in the hook

2. `schemas/weather.schema.ts`
- Define a Zod schema for the API response with:
- `city`
- `temperature`
- `condition`
- `windSpeed`
- `humidity`
- `unit`
- `timestamp`
- Export:
- `weatherSchema`
- inferred type `WeatherData`

3. `constants/weather.constants.ts`
- Store feature-level constants such as:
- TanStack Query key(s)
- any small weather feature constants if needed
- Keep this file lightweight; do not move business logic here

4. `hooks/useWeather.ts`
- Implement a custom hook using TanStack Query `useQuery`
- Accept `city: string`
- Only fetch when `city.trim()` is non-empty
- Call the fetcher from `api/weather.api.ts`
- Validate the response with `weatherSchema`
- Throw an error if validation fails
- Expose:
- `data`
- `isLoading`
- `isError`
- `error`

6. `components/WeatherCard.tsx`
- Props: `data: WeatherData`
- Presentational only
- Use Material UI Card layout
- Display:
- city name
- temperature
- condition
- wind speed
- humidity
- Use `WeatherMetric` for each metric

7. `pages/WeatherPage.tsx`
- Feature root component
- Compose search input + weather display
- Manage local city search state
- Call `useWeather(city)`
- Show `CircularProgress` during loading
- Show `Alert` on error
- Render `WeatherCard` when data exists

Rules:
- No `any`
- Keep hook/query logic out of components
- Keep Zod schema inside this feature folder
- Do not introduce unnecessary layers like services or mappers unless there is real transformation complexity
- Prefer maintainable, production-ready structure with clear boundaries
- Use explicit prop types
- Infer API response types from Zod instead of duplicating interfaces
- No inline styles
```

---

## PROMPT 4 — Frontend: Search History

```

```

Context: Weather Intelligence Dashboard — search history feature.

- React + TypeScript (strict), TanStack Query, Material UI

Implement in /frontend/src/features/history/:

1. schemas/history.schema.ts
   - Zod schema for history item: city, temperature, timestamp
   - Export inferred type HistoryItem

2. hooks/useHistory.ts
   - Validate response array with Zod
   - Refetch after each successful weather search (use queryClient.invalidateQueries)

3. components/HistoryList.tsx
   - Props: items (HistoryItem[])
   - MUI List with city, temperature, and formatted timestamp per item
   - Show "No recent searches" when empty
4. api/history.api.ts
   - Validate the response with `historySchema`
   - Implement the endpoint fetch for `GET /api/history`
   - Use the preimplemented helper(s) from `lib/api`
   - This layer must stay strictly focused on request construction / fetching
   - Do not put validation or UI logic here

add the History list to WeatherPage.tsx

Rules:

- No `any`
- Keep components presentational; data fetching in hook only

```

---
// Finished up to here

// something to fix Something went wrong. Please try again later! if this is not a proper city name

## PROMPT 5 — App Assembly and README

```

Context: Assemble the Weather Intelligence Dashboard and complete documentation.

Assemble the Weather Intelligence Dashboard

1. /frontend/src/App.tsx
   - Render ThemeProvider with theme.ts
   - Layout: MUI Container, centred
   - Render WeatherFeature above HistoryList
   - QueryClientProvider wrapping everything

2. /backend/src/index.ts
   - Express app startup
   - Mount weatherRoutes at /api
   - TypeORM DataSource initialisation on startup
   - Listen on PORT env var or 3001

3. Make sure to rview this weather flow for correctness, edge cases and overengineering risk,

   Backend - focus on
   - error handling consistency
   - HTTP status correctness
   - zod validation voundary
     -upstream API failuer handling
     -wheter the architecture is adequate for this takehome

   frontend - focus on
   - if the backend errors are handled in UI correctly,
   - if the page shows alert/loading/success/empty states in the right order
   - if stale data can still render during loading?
   - if history click re-seach flow is safe
   - any UI glitches, race conditioin or missing edge cases?

   fix implementation and, but
   report
   - bugs,
   - misleading logic,
   - missing edge cases
     -things that can be left alone (not required in the assignment)
   - what you've changed and the reason
   - what you dismissed proportioanl to the assignment

4. /README.md — complete with:

## update readme so that readme reflects with the code it exists now

## Do not invent infrastructure or features which don't present in the codebase

## Make sure ReadMe is practical and concise

The following sections should be included

## Overview

- brief explanation of the app
- mention this is the full stack weather intelligence dashabord using openmeteo
- mention searched history is stored in postgressql as an optional enhancement

  ## Setup
  - Prerequisites: Node 20+, Docker
  - `docker-compose up -d` to start PostgreSQL
  - `cd backend && npm install && npm run dev`
  - `cd frontend && npm install && npm run dev`

## Project structure

- Make sure folder structure at a high level reflects to the current structure

## Architecture Decisions

Summarise conscious architectural decisions, such as:

- React + TypeScript + Material UI on the frontend
- TanStack Query for server state
- Zod validation close to feature/route boundaries
- Node.js + Express backend
- Thin handler/route structure with service/repository separation
- PostgreSQL + TypeORM for recent search history
- Production-aware but not enterprise-heavy approach

## AWS Deployment Shape

```

Browser
  ├─→ CloudFront
  │     └─→ S3 (React production build)
  └─→ API Gateway
          └─→ Lambda (Node.js backend)
                  └─→ RDS PostgreSQL (recent search history, optional)

```

- Frontend: `npm run build` → upload /dist to S3 → CloudFront distribution
- Backend: the current Node/Express backend is adaptable to lambda behind API gateway.
- Database: current local postgresSQL is replaceble to RDS PostgreSQL, connection string via Lambda env var DATABASE_URL
- Configuration: env variables/secret managed outside code
- Do not add full details of CDK or IaC implementation plans
- keep it pracrical and high level

Rules:

- No `any`
- Keep README concise — bullet points over paragraphs

5. Review the current codebase and final README for alignment.

Check:

- whether `frontend/src/App.tsx` reflects the intended app composition
- whether `backend/src/index.ts` reflects the intended startup flow
- whether the README matches the actual implementation
- whether any folder structure described in the README is outdated
- whether the architecture summary is accurate and proportionate

Do not rewrite the app unless something is clearly inconsistent.
Flag only:

1. mismatches between README and code
2. outdated wording
3. misleading architectural claims
4. small practical fixes

```

---

## PROMPT 6 — Tests

```

Context: Weather Intelligence Dashboard — minimal proportionate test suite.

Frontend (Vitest + React Testing Library):

1. WeatherCard.test.tsx — renders all weather metrics correctly given mock WeatherData
2. SearchInput.test.tsx — calls onSubmit with city value; disables button when loading=true
3. HistoryPanel.test.tsx — render five recent searches correctly given mock HistoryItem[]

Backend (Jest + Supertest):

1. weatherService.test.ts — mock Open-Meteo HTTP calls; assert correct WeatherResult shape returned
2. weather.routes.test.ts — Supertest against Express app:
   - GET /api/weather?city=Sydney → 200 with weather shape
   - GET /api/weather (no city) → 400
   - GET /api/history → 200 with array

Rules:

- No `any` in test files
- Mock external HTTP calls (Open-Meteo) — do not make real network calls in tests
- Keep each test file under ~50 lines
- No end-to-end Playwright unless time permits

```

---

## GENERAL RULES FOR ALL PROMPTS

Apply these to every Cursor session on this project:

- TypeScript strict mode ON; `any` is banned
- No inline styles except minor `display: flex` / `alignItems` alignment
- Business logic lives in service layer, not handlers or components
- Zod schemas co-located with their feature/route, not in a shared global schema file
- Keep file count proportionate — do not over-abstract for an app this size
- Open-Meteo is the only weather API (no OpenWeatherMap)
- PostgreSQL / TypeORM is implemented but treated as optional per the key brief
```
