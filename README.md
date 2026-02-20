# Jobzy Backend (Client + Worker + Admin APIs)

Production-oriented Node.js + Express backend for a two-sided marketplace:
- Clients post jobs, discover workers, chat, and review.
- Workers apply, get admin-approved, pay monthly subscription, then accept jobs.
- Admins moderate worker onboarding/compliance and manage billing plans/transaction confirmations.

## Architecture

- `src/modules/*`: modular features (`auth`, `users`, `workers`, `jobs`, `reviews`, `chat`, `payments`, `admin`)
- `src/apis/client.routes.js`: client-facing API surface (`/api/client/*`)
- `src/apis/worker.routes.js`: worker-facing API surface (`/api/worker/*`)
- `src/apis/admin.routes.js`: admin-facing API surface (`/api/admin/*`)
- PostgreSQL persistence via repository layer (`pg` with parameterized SQL)
- Socket.IO for real-time messaging
- JWT auth (short-lived access + DB-stored long-lived refresh tokens)

## Compliance + approval workflow

1. Register worker via `/api/auth/register` with role `worker`.
2. Provide either:
   - `southAfricanIdNumber` (13 digits), or
   - `passportNumber`.
3. Worker application created as `pending`.
4. Admin reviews using `/api/admin/workers/:workerId/review` for:
   - identity verification status
   - background check status
5. Worker becomes usable only when both statuses are `approved`.

## Subscription + payment workflow

1. Admin creates monthly plans via `/api/admin/subscriptions/plans`.
2. Worker starts subscription checkout via `/api/worker/payments/subscribe`.
3. System creates `worker_subscriptions` (`past_due`) + pending `payment_transactions`.
4. Admin/provider callback confirms via `/api/admin/subscriptions/transactions/confirm`.
5. On paid transaction, worker subscription becomes `active`.
6. Worker can access `/api/worker/jobs/*` only when approved + actively subscribed.

## Swagger docs

- OpenAPI JSON: `GET /api/docs.json`
- Swagger UI page: `GET /api/docs`

## Setup

```bash
npm install
cp .env.example .env
psql "$DATABASE_URL" -f migrations/001_init.sql
psql "$DATABASE_URL" -f migrations/002_worker_compliance_and_billing.sql
npm run dev
```

## Security

- bcrypt password hashing
- rate-limited login
- role-based middleware
- worker access middleware for approval/subscription gating
- Helmet + CORS
- parameterized SQL queries
