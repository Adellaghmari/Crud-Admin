# Kundadmin (Client Admin)

Fullstack: kunder, ärenden (`deals` / `Deal`), inloggning, `ADMIN` / `USER`, REST → Postgres.

| | |
|---|---|
| Repo | [github.com/Adellaghmari/Crud-Admin](https://github.com/Adellaghmari/Crud-Admin) |
| Frontend (Vercel) | [crud-admin-three.vercel.app](https://crud-admin-three.vercel.app) |
| API (Render) | [client-admin-api-osfo.onrender.com](https://client-admin-api-osfo.onrender.com) |

`client/`: React, Vite, TypeScript, Tailwind, React Query. `server/`: Express, Zod, Prisma. CI: `.github/workflows/`. [DEPLOY.md](DEPLOY.md) för moln.

**Postgres lokal:** `docker compose up -d`

**server/**

```bash
cd server
cp .env.example .env
npm install
npm run prisma:generate
npm run prisma:migrate
npm run prisma:seed
npm run dev
```

`http://localhost:4000` — `.env` enligt `server/.env.example` (`DATABASE_URL` mot docker-Postgres ovan, `JWT_SECRET`, …).

**client/**

```bash
cd client
cp .env.example .env
npm install
npm run dev
```

`VITE_API_URL` i `client/.env` t.ex. `http://localhost:4000/api`. App: `http://localhost:5173`

**Inlogg efter** `prisma:seed` (källa: `server/prisma/seed.ts`):

- Admin: `admin@clientadmin.dev` / `Password123!`
- User: `user@clientadmin.dev` / `UserPassword123!`

Gäller där samma seed körts. Ska inte längre synas: ta bort raderna ovan + rotera bort användare i miljö.

**API** — bas `http://localhost:4000/api`: `auth/*`, `customers`, `deals`; vissa skrivningar `ADMIN` enligt routes. `GET /health`.

**Tester:** `cd server` → `npm test`

Säkerhet: JWT i httpOnly-cookie, Zod på input, rate limit mot auth.
