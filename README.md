# Derq Traffic Dashboard

this is a full-stack app that shows trafic data as interactive charts — by
country and by vehicle type — backed by a Postgres database, with the
ability to edit record vehicle count using a modal that open from each row in the table

## Tech Stack Used in the app

- **Backend:** NestJS + TypeORM + Postgres — structured, has unit testing and integration testing using testcontainers package, and has Swagger docs too enabled.
- **Frontend:** Next.js + React Query (for fetching the data and caching and data cache invalidation) + Recharts package for showing the charts UI (charts) + Radix Themes (Design System component package) + Zustand which i used as global state like tabs and filtering.
- **Infra Files:** Docker for both apps, Kubernetes yaml manifest under `k8s/` for deployment, One Ci / CD file config for Github actions.

## Setup & Running

### Prerequisites

- Node 22
- Yarn
- Postgres (or just run it via Docker) or local as i have it running locally

### Backend

```
cd backend
yarn install
cp .env.example .env      # enter the env variables
yarn seed                 # this is seed script to have some initial data in db
yarn start:dev
```

API runs on `http://localhost:4001`, Swagger docs at `/docs`.

### Frontend

```
cd client
yarn install
yarn dev
```

Runs on `http://localhost:3000` and talks to the API running at port 4001 or what ever you configured in env variable set in
`client/config/api.ts`.

### With Docker

Both `backend/Dockerfile` and `client/Dockerfile` are basically multi stage build
ready for production to build and run each image, or point them at the
`k8s/` manifests if deploying to a cluster (they include some deployments files like
services, ingress routes, secrets (which i just pushed to git to show it in task only but in real production this comes from Valuts or Local files), and cert config for both apps).

## Architecture

Request flow: **frontend (react query fetches) -> service which calles backend -> NestJS
controller → service → repository → Postgres**.

- The repository is basically behind an `ITrafficRepository` interface (`traffic-repository.interface.ts`), with `TrafficTypeOrmRepository` as i always do this because this is good for testing as i can have in memory database that implmeent the interface or maybe new data source come in the future to support same functions.
- chart endpoints is at this endpoint path (`/traffic/by-country`, `/traffic/by-vehicle-type`) i do their grouping in the database with `GROUP BY` + `SUM`, not in app code becuase this can cheaper on database and can scale instead of me doing requests and merging on API.
- Validation is done with a the standard package `class-validator` DTOs and a global `ValidationPipe` (whitelist + do not allow unknow fields in the payload), and errors go through a global `HttpExceptionFilter` which i do always to have response normlization and also another reason for good UX to show errors messages under fields in forms identified by their field name.

- in the frontend, each API call has its own thin service function (`services/`) and a matching React hook (`hooks/`) — components never call `axios` directly.

## Testing

- **Backend unit tests:** `traffic.service.spec.ts` tests the service against an in-memory fake repository, not real actual DB needed.
- **Backend integration tests with testcontainers:** `traffic.repository.integration-spec.ts` so this will spin up a real Postgres via Testcontainers to test the TypeORM repository against actual sql.
- **Frontend tests:** component tests with Vitest + Testing Library (`EditTrafficDialog.test.tsx`, `TrafficByCountryChart.test.tsx`).

Run them with:

```
cd backend
yarn test              # unit
yarn test:integration  # this will be Docker installed for Testcontainers
yarn test:e2e

cd client
yarn test
```

## Scalability (5 → 50 → 500 RPS)

- **~5 RPS:** what's here today is enough — single API instance, single Postgres instance, indexes on `country`, `vehicleType`, and `(timestamp, id)` and i did the composite index for one reason for sorting this data
- **~50 RPS:** is this case i will first put a cache Redis instance in front of the two aggregation endpoints since they do not need to be real-time to the second also i can use redis for another reason in case the reading dashboard need real time events or data to be sent to the dashboard from muultiple pods running the backend in this case i will use websocket but with redis adapter, and i will also do a proper connection pooling, and run a couple of replicas or statles APIS of the backend instances behind the load balancer.
- **~500 RPS:** in this case i will make autoscaling and almost all could providers support this so i can autoscale on demande the API horizontally, add i will also add Postgres read replicas and forward all the read chart endpoints to them so that if we get high write traffic i will have write instance sperate from read replicas and also i will do use a queue like for example SQS or RabbitMQ or also Redis streams so that i will forward all writes to it and then a worker will spin up and take the writes at slower and write them back at slower rates so db stay stable and i do currently same for trading at my company acually and i used before also ECS Fargate, so writes spike do not block dashboards.

## Notes / Tradeoffs

- i added `DB_SYNC` (TypeORM `synchronize`) and this is fine for local dev and also because but should always be `false` in production, real deployments should use migrations for controlled, reversible schema updates. i did not add authentication because it is not mentioned in th taks but i can do Auth or OAuth SSOs, but it's the first thing I'd add before this touches real traffic data. i also did add some fake delay in server to have good UX to show real latency of frontend calling a backend and show proper UX for the app.

## CI/CD

GitHub Actions runs lint + tests + build for both apps on every push + PR.Docker images build only after both apps pass.
