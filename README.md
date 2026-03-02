# Black Gum Studio (Next.js 14)

Production marketing site + custom admin panel powered by Next.js App Router, Prisma, and SQLite.

## Stack
- Next.js 14 (App Router) + TypeScript
- Tailwind CSS
- Prisma ORM
- SQLite for local dev (switchable to Postgres in production)
- Custom admin auth (email/password + secure cookie sessions)

## Setup
1) Install dependencies
```bash
npm install
```

2) Create `.env`
```bash
copy .env.example .env
```
Update these values:
- `DATABASE_URL` (local): `file:./dev.db`
- `SESSION_SECRET`: long random string
- `ADMIN_EMAIL`: admin email used for first login
- `ADMIN_PASSWORD`: admin password used for first login

3) Run Prisma migrations + generate client
```bash
npm run prisma:migrate
npm run prisma:generate
```

4) Seed the first admin user
```bash
npm run seed
```

5) Start the dev server
```bash
npm run dev
```

Visit `http://localhost:3000` for the public site and `http://localhost:3000/admin` for the admin panel.

## Production (Postgres)
1) Update `DATABASE_URL` to your Postgres connection string.
2) Change the datasource provider in `prisma/schema.prisma` from `sqlite` to `postgresql`.
3) Run migrations against your production database.

## Admin Auth
- Login: `/admin/login`
- Session cookie: httpOnly + signed token stored in `AdminSession`.
- Logout: `/api/admin/logout`

## Content Models
- Packs, Services, Rentals, Portfolio Projects, Blog Posts
- Packs store deliverables as a JSON array of strings.

## Scripts
- `npm run dev` - local development
- `npm run build` - production build
- `npm run start` - start production server
- `npm run prisma:generate` - generate Prisma client
- `npm run prisma:migrate` - run Prisma migrations (SQLite dev)
- `npm run seed` - create initial admin user from `.env`

## Notes
- Update the contact details and WhatsApp number in `src/app/contact/page.tsx`.
- Rental list filters by category via `?category=camera|lens|audio|lighting|grip|other`.
- Blog posts show only when `publishedAt` is set and in the past.

## Deploy en Infomaniak (Node.js)
- Guía completa: `docs/DEPLOY_INFOMANIAK_NODEJS.md`
