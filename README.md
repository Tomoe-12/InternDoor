## Next.js + Supabase Starter

This repo now runs **frontend-only** with Next.js 15, Supabase (Postgres + Auth), Drizzle ORM, and Resend for email. The old Laravel backend is retired.

### Features
- Supabase Postgres schema managed via Drizzle
- API routes in `app/api/*` (students, companies, verification, password reset, connected accounts, transactional email)
- Supabase Auth ready (enable providers in console)
- Resend for transactional emails

### Quick Start
```bash
npm install
npm run dev
# visit http://localhost:3000
```

### Environment
Create `.env.local` (already templated) with:
- `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY`, `SUPABASE_DB_URL` (use connection pooler)
- `RESEND_API_KEY`, `RESEND_FROM_EMAIL`

### Database
- Schemas: `db/schema/*`
- Config: `drizzle.config.ts`
- Scripts: `npm run db:generate`, `npm run db:push`, `npm run db:studio`

### API Routes (Node runtime)
- `GET/POST /api/students`
- `GET/POST /api/companies`
- `POST /api/verification-codes`
- `POST/PUT /api/verification-email`
- `POST/PUT /api/password-reset`
- `GET/POST/DELETE /api/connected-accounts`
- `POST /api/send-email`

### Auth & Email
- Enable providers in Supabase Console → Auth → Providers
- Transactional email via `/api/send-email` (Resend)

### Notes
- The `backend/` directory is legacy; no build/CI targets it.
- Dependabot now tracks npm and GitHub Actions only.
