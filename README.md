# Jobzy Backend

Production-oriented Node.js + Express API for a two-sided services marketplace with:

- JWT auth (access + refresh token model)
- Role-based access (`client`, `worker`, `admin`)
- PostgreSQL normalized schema
- Realtime chat via Socket.IO + JWT handshake auth
- Geospatial worker discovery using Haversine SQL filtering

## Setup

1. Install dependencies:
   ```bash
   npm install
   ```
2. Copy env file:
   ```bash
   cp .env.example .env
   ```
3. Create database schema:
   ```bash
   psql "$DATABASE_URL" -f migrations/001_init.sql
   ```
4. Run API:
   ```bash
   npm run dev
   ```

## Modules

- `auth`: register/login/refresh/logout with bcrypt and DB-backed refresh token revocation.
- `users`: authenticated profile retrieval.
- `services`: public listing and admin service creation.
- `workers`: worker profile upsert, offered services, and proximity discovery.
- `jobs`: client job posting, worker acceptance, lifecycle status updates.
- `reviews`: client reviews and worker rating aggregation.
- `chat`: conversation/message APIs and realtime message events.

## WebSocket

Authenticate during connection using access token:

```js
const socket = io('http://localhost:4000', {
  auth: { token: accessToken }
});
```

Events:
- `conversation:join` -> payload: `conversationId`
- `message:send` -> payload: `{ conversationId, message, messageType }`
- `message:new` <- persisted message broadcast for room participants

## Security notes

- Use distinct access/refresh JWT secrets.
- Keep access token short-lived and rotate refresh tokens if desired.
- All SQL statements use parameterized queries.
- Apply production CORS origins and TLS termination at the edge.
