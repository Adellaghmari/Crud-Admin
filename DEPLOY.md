# Deploy: Render → Vercel

Render först, spara API-URL. Därefter Vercel med `VITE_API_URL=https://<render-host>/api`.

**Render:** New → Blueprint, `render.yaml`, `JWT_SECRET`, `CLIENT_ORIGIN` = rätt `https://` till Vercel, ingen `/` sist. Fler: kommatecken.  
**Vercel:** root `client`, samma `VITE_API_URL`-mönster. Ny build efter `VITE_*`-ändring.

Postgres + migrering: enligt inställning / `render.yaml`, `DATABASE_URL` i env.

`npx tsx prisma/seed.ts` i Render Shell under `server/` om seed ska in i produktion.

Utan Blueprint: web service, root `server`, `npm ci && npm run prisma:generate && npm run build` → `npm run prisma:migrate:deploy && npm start`.

`GET …/api/health` ska svara `ok`. `CLIENT_ORIGIN` = origin i webbläsaren. Gratis-Render: kallstart.

Fyll Frontend/API i README-tabellen när du har länkarna.
