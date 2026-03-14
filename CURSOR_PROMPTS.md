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

Rules:
- Strict types; no prop type shortcuts
- Export each component as named export
- No business logic in components
```

---

## PROMPT 3 — Frontend: Weather Feature

```
Context: Weather Intelligence Dashboard — weather feature slice.
- React + TypeScript (strict), TanStack Query, Zod, Material UI

Implement in /frontend/src/features/weather/:

1. weatherSchema.ts
   - Zod schema for the API response: city, temperature, condition, windSpeed, humidity, unit, timestamp
   - Export inferred TypeScript type WeatherData

2. useWeather.ts (custom hook)
   - TanStack Query useQuery hook
   - Fetches GET /api/weather?city={city}
   - Only fetches when city is non-empty
   - Validates response with Zod schema; throw if invalid
   - Returns { data, isLoading, isError, error }

3. components/WeatherCard.tsx (organism)
   - Props: data (WeatherData)
   - Display: city name, temperature, condition, wind speed, humidity
   - Use WeatherMetric atom for each metric
   - MUI Card layout
   - No inline styles

4. WeatherFeature.tsx (feature root)
   - Composes SearchInput + WeatherCard
   - Manages local city search state
   - Calls useWeather hook
   - Shows MUI CircularProgress on loading
   - Shows MUI Alert on error

Rules:
- No `any`; all types explicit
- Keep hook logic out of components
- Zod schema stays in this feature folder
```

---

## PROMPT 4 — Frontend: Search History

```
Context: Weather Intelligence Dashboard — search history feature.
- React + TypeScript (strict), TanStack Query, Material UI

Implement in /frontend/src/features/history/:

1. historySchema.ts
   - Zod schema for history item: city, temperature, timestamp
   - Export inferred type HistoryItem

2. useHistory.ts
   - TanStack Query useQuery for GET /api/history
   - Validate response array with Zod
   - Refetch after each successful weather search (use queryClient.invalidateQueries)

3. components/HistoryList.tsx
   - Props: items (HistoryItem[])
   - MUI List with city, temperature, and formatted timestamp per item
   - Show "No recent searches" when empty

Rules:
- No `any`
- Keep components presentational; data fetching in hook only
```

---

## PROMPT 5 — App Assembly and README

```
Context: Assemble the Weather Intelligence Dashboard and complete documentation.

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

3. /README.md — complete with:
   ## Setup
   - Prerequisites: Node 20+, Docker
   - `docker-compose up -d` to start PostgreSQL
   - `cd backend && npm install && npm run dev`
   - `cd frontend && npm install && npm run dev`

   ## AWS Deployment Shape
   ```
   Browser
     └─→ CloudFront → S3 (React SPA build)
           └─→ API Gateway → Lambda (Express handler adapter)
                   └─→ RDS PostgreSQL (search history)
   ```
   - Frontend: `npm run build` → upload /dist to S3 → CloudFront distribution
   - Backend: wrap Express handlers in a Lambda adapter (e.g. @vendia/serverless-express)
   - Database: RDS PostgreSQL, connection string via Lambda env var DATABASE_URL

Rules:
- No `any`
- Keep README concise — bullet points over paragraphs
```

---

## PROMPT 6 — Tests

```
Context: Weather Intelligence Dashboard — minimal proportionate test suite.

Frontend (Vitest + React Testing Library):
1. WeatherCard.test.tsx — renders all weather metrics correctly given mock WeatherData
2. SearchInput.test.tsx — calls onSubmit with city value; disables button when loading=true
3. useWeather.test.ts — mock fetch; assert Zod validation runs; assert error state on bad response

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
