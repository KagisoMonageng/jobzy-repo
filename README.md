# Jobzy Backend

Node.js + Express backend for a two-sided service marketplace with separated APIs for clients, workers, and admins.

## Core capabilities
- JWT auth (short-lived access tokens + DB-backed refresh tokens)
- Role-based authorization (`client`, `worker`, `admin`)
- Worker compliance: South African ID/passport capture + admin verification/background-check approval
- Worker billing: monthly subscription plans and payment transactions
- Real-time chat with Socket.IO
- PostgreSQL normalized schema + migrations
- Swagger docs for endpoint discovery and responses

## API surface
- `/api/auth/*` - shared auth endpoints
- `/api/client/*` - client-focused actions (job posting, worker discovery, reviews)
- `/api/worker/*` - worker actions (profile, paid access, job intake)
- `/api/admin/*` - admin moderation, worker approvals/background checks, plan/payment control
- `/api/docs` - Swagger UI
- `/api/docs.json` - OpenAPI JSON

## Worker approval & subscription flow
1. Worker registers with either `southAfricanIdNumber` or `passportNumber`.
2. Worker profile enters pending verification/background-check state.
3. Admin reviews worker via `/api/admin/workers/:workerId/review`.
4. Worker purchases subscription via `/api/worker/payments/subscribe`.
5. Admin/provider confirms payment via `/api/admin/subscriptions/transactions/confirm`.
6. Approved + subscribed workers can access open client jobs.

## Setup
```bash
npm install
cp .env.example .env
psql "$DATABASE_URL" -f migrations/001_init.sql
psql "$DATABASE_URL" -f migrations/002_worker_compliance_and_billing.sql
npm run dev
```
