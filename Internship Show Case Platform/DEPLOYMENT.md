# Deployment Guide — Intern Showcase Platform (Full-stack)

One Node process serves the **API** and the **React SPA** (`client/dist`).

## Architecture

| Layer | Role | Host |
|-------|------|------|
| Full-stack app | Express + static React build | Render, Railway, Fly.io, VPS |
| Database | MongoDB | [MongoDB Atlas](https://www.mongodb.com/atlas) |
| Auth | Clerk | [Clerk Dashboard](https://dashboard.clerk.com) |

Optional: host the Vite build on a CDN and point `VITE_API_URL` at the API. Default path is **same-origin** (`VITE_API_URL=/api`).

## 1. MongoDB Atlas

1. Create a cluster and database user.
2. Allow your host IPs (Network Access).
3. Set `MONGODB_URI` to the Atlas connection string.

## 2. Clerk

1. Use production Clerk keys.
2. Allow your public app domain under Paths / Domains.
3. Set `CLERK_PUBLISHABLE_KEY`, `CLERK_SECRET_KEY`, and `VITE_CLERK_PUBLISHABLE_KEY`.

## 3. Environment (single `.env`)

Copy `.env.example` and set:

```
NODE_ENV=production
PORT=5000
MONGODB_URI=mongodb+srv://...
CLIENT_URL=https://your-app.example.com
CLERK_PUBLISHABLE_KEY=pk_live_...
CLERK_SECRET_KEY=sk_live_...
VITE_API_URL=/api
VITE_CLERK_PUBLISHABLE_KEY=pk_live_...
```

`VITE_*` values are baked in at **build** time — set them before `npm run build`.

## 4. Build & start

```bash
npm install
npm run build
npm start
```

Express will:

- Mount `/api/*` and `/uploads/*`
- Serve `client/dist` and SPA fallback for all other routes

## 5. Smoke test

1. Open the app URL → home page loads
2. Register / login (Clerk)
3. Profile + project CRUD + image upload
4. Publish portfolio → `/portfolio/:username`
5. Explore + dashboard analytics after a public visit

## 6. Secrets

- Never commit `.env`
- Prefer host secret managers
- Rotate Clerk / Atlas credentials if leaked
