# Nova BI — Business Intelligence Management System

A production-grade, enterprise Business Intelligence platform for decision making with **dashboards, KPIs, reports and analytics**.

Built with a **Clean Architecture** backend (FastAPI + PostgreSQL + Redis) and a premium **React 18** frontend (Vite + TypeScript + TailwindCSS + shadcn/ui). Fully containerized with Docker Compose.

---

## Quick Start

> Requires Docker with Compose v2. Nothing else.

```bash
# Windows (PowerShell)
.\scripts\setup.ps1

# macOS / Linux
bash scripts/setup.sh

# or manually
docker compose up -d --build
```

| Service   | URL                                   |
| --------- | ------------------------------------- |
| Frontend  | http://localhost:8080                 |
| API       | http://localhost:8000/api/v1          |
| Swagger UI | http://localhost:8000/api/docs       |
| ReDoc     | http://localhost:8000/api/redoc       |
| OpenAPI JSON | http://localhost:8000/api/openapi.json |

**Default credentials** (seeded automatically on first boot):

```
email:    admin@bisystem.dev
password: Admin@1234
```

---

## What is inside

### Backend — FastAPI (Python 3.12)

- **Clean Architecture**: `presentation`, `application`, `domain`, `infrastructure`, `shared`.
- JWT authentication (access + refresh tokens, rotation via Redis).
- SQLAlchemy 2.x ORM, PostgreSQL, Alembic migrations, database **views**.
- Pydantic v2 schemas, generic response envelope, centralized exception handling.
- Health checks, structured logging, CORS, request-ID middleware.
- Dependency injection container wired through FastAPI dependencies.
- Role-based access control (`admin`, `analyst`, `viewer`).

### Frontend — React 18 (TypeScript)

- Vite + TailwindCSS + shadcn/ui components + Framer Motion + Lucide icons.
- TanStack Query data layer, Zustand state (auth + theme), Axios client with auto token refresh.
- React Hook Form + Zod validation, Recharts visualizations.
- Dark/light themes, glassmorphism, fully responsive (mobile drawer sidebar).
- Protected routes, admin-only routes, 404 page, loading/empty states.

### DevOps

- `docker compose up` → PostgreSQL, Redis, API, Frontend (Nginx) with health checks.
- Persistent volumes, environment separation, startup scripts.

---

## Architecture

```
┌──────────────────────────────────────────────────────────┐
│                    Presentation (FastAPI)                │
│  Routers · Dependencies/DI · Health · Exception handlers │
├──────────────────────────────────────────────────────────┤
│                     Application (Use cases)              │
│  Services · Schemas (DTOs) · Auth/Users/Dashboards/...  │
├──────────────────────────────────────────────────────────┤
│                        Domain                            │
│  Entities · Repository interfaces                        │
├──────────────────────────────────────────────────────────┤
│                   Infrastructure                          │
│  SQLAlchemy models · SQL repositories · Seed · Bootstrap │
├──────────────────────────────────────────────────────────┤
│                         Shared                            │
│  Enums · Utils · Helpers · Response helpers              │
└──────────────────────────────────────────────────────────┘
```

---

## Project structure

```
.
├── backend/
│   ├── app/
│   │   ├── main.py                  # FastAPI app factory
│   │   ├── core/                    # config, database, redis, security, logging, middleware
│   │   ├── domain/                  # entities + repository interfaces
│   │   ├── application/             # services + schemas (DTOs)
│   │   ├── infrastructure/          # SQLAlchemy models, repositories, seed, bootstrap
│   │   ├── presentation/            # routers (api/v1), DI dependencies, health
│   │   └── shared/                  # enums, helpers, response utilities
│   ├── alembic/                     # migrations (initial schema + DB views)
│   ├── tests/
│   ├── Dockerfile
│   ├── entrypoint.sh
│   └── requirements.txt
├── frontend/
│   ├── src/
│   │   ├── app/router/              # routes + protected routes
│   │   ├── components/              # ui (shadcn), layout, common, analytics
│   │   ├── features/                # auth, dashboards, reports, kpis, users, analytics
│   │   ├── hooks/  lib/  stores/  types/  pages/
│   ├── Dockerfile                   # multi-stage build + Nginx
│   └── nginx.conf
├── scripts/                         # setup / start / stop / reset (ps1 + sh)
├── docker-compose.yml
├── .env  .env.example
└── Makefile
```

---

## API surface

| Method | Path                              | Description                 |
| ------ | --------------------------------- | --------------------------- |
| POST   | `/api/v1/auth/login`              | Sign in, issue tokens       |
| POST   | `/api/v1/auth/refresh`            | Rotate refresh token        |
| POST   | `/api/v1/auth/logout`             | Revoke refresh token (Redis)|
| GET    | `/api/v1/auth/me`                 | Current user profile        |
| POST   | `/api/v1/auth/change-password`    | Change own password         |
| GET/POST | `/api/v1/users`                 | List / create users (admin) |
| GET/PATCH/DELETE | `/api/v1/users/{id}`       | Manage user (admin)         |
| GET/PATCH | `/api/v1/users/me`            | Own profile                 |
| GET/POST | `/api/v1/dashboards`            | List / create dashboards    |
| GET/PATCH/DELETE | `/api/v1/dashboards/{id}` | Manage dashboard            |
| POST   | `/api/v1/dashboards/{id}/favorite`| Toggle favorite            |
| GET/POST | `/api/v1/reports`              | List / create reports       |
| PATCH/DELETE | `/api/v1/reports/{id}`     | Update / delete report      |
| POST   | `/api/v1/reports/{id}/publish`    | Publish report              |
| POST   | `/api/v1/reports/{id}/archive`    | Archive report              |
| GET/POST | `/api/v1/kpis`                | List / create KPIs          |
| GET/PATCH/DELETE | `/api/v1/kpis/{id}`     | Manage KPI                  |
| POST   | `/api/v1/kpis/{id}/update-value`  | Record a KPI measurement    |
| GET    | `/api/v1/analytics/overview`      | Metrics, categories, trends |
| GET    | `/api/v1/analytics/trends`        | Time-series achievement     |
| GET    | `/api/v1/analytics/performance`   | KPI performance list        |
| GET    | `/api/v1/analytics/dashboard-summary` | Dashboard summaries   |
| GET    | `/api/v1/health`                  | Service health check        |

---

## Local development (without Docker)

Backend:

```bash
cd backend
python -m venv .venv
.\.venv\Scripts\activate          # Windows
source .venv/bin/activate          # macOS/Linux
pip install -r requirements.txt
alembic upgrade head
python -c "from app.infrastructure.seed import run_seed; run_seed()"
uvicorn app.main:app --reload --port 8000
```

Frontend:

```bash
cd frontend
npm install
npm run dev
```

The Vite dev server proxies `/api` to `http://localhost:8000`.

---

## Useful commands

```bash
docker compose logs -f backend      # follow API logs
docker compose exec backend alembic upgrade head
docker compose exec backend python -c "from app.infrastructure.seed import run_seed; run_seed()"
docker compose down -v              # stop and wipe volumes (fresh database)
```

See `Makefile` and `scripts/` for shortcuts.

---

## Notes

- Seeded sample data (dashboards, reports, KPIs) demonstrates the product on first login.
- `SECRET_KEY` is a dev default — set a strong value in `.env` for production.
- Redis is used for refresh-token revocation and is monitored via the health endpoint; it is optional at runtime (the app degrades gracefully).
