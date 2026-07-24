# Intern Project Showcase Platform

Full-stack MERN application where interns create profiles, manage projects, customize portfolios, and share public portfolio links with recruiters.

## Stack

- **Server:** Node.js, Express, MongoDB, Mongoose, Clerk (`@clerk/express`)
- **Client:** React (Vite), React Router, Axios, Tailwind CSS, Clerk React
- **One package** — Express API + React UI in a single project

## Project structure

```
├── server.js           # Express entry (API + serves client/dist in production)
├── config/             # Env + database
├── models/             # Mongoose models
├── controllers/        # Route handlers
├── routes/             # Express routers
├── middleware/         # Auth, security, uploads, errors
├── utils/              # Helpers
├── uploads/            # Local media
├── client/             # React (Vite) UI
│   ├── index.html
│   ├── vite.config.mjs
│   ├── public/
│   └── src/
├── .env.example
├── DEPLOYMENT.md
└── package.json        # Single dependency tree
```

## Prerequisites

- Node.js 18+
- MongoDB running locally (or set `MONGODB_URI`)
- A Clerk application ([dashboard.clerk.com](https://dashboard.clerk.com))

## Setup

1. Copy environment file and fill in Clerk keys:

```bash
cp .env.example .env
```

2. Install and run (one install for the whole app):

```bash
npm install
npm run dev
```

That starts:
- API server: `http://localhost:5000`
- Vite client: `http://localhost:5173` (proxies `/api` and `/uploads` to the API)

> Passwords are hashed and stored by **Clerk**, not in MongoDB.

## Production (single server)

```bash
npm install
npm run build      # builds client/dist
npm start          # Express serves API + React SPA
```

Set `CLIENT_URL` to your public app URL. See [DEPLOYMENT.md](./DEPLOYMENT.md).

## Scripts

| Script | Description |
|--------|-------------|
| `npm run dev` | API + Vite client together |
| `npm run dev:server` | API only (nodemon) |
| `npm run dev:client` | Vite only |
| `npm run build` | Production React build → `client/dist` |
| `npm start` | Production Express (serves API + SPA) |

## Module status

- **Module 1:** Project foundation & architecture — complete
- **Module 2:** Clerk authentication & authorization — complete
- **Module 3:** Intern profile management — complete
- **Module 4:** Project management — complete
- **Module 5:** Dynamic portfolio editor — complete
- **Module 6:** Public portfolio & shareable links — complete
- **Module 7:** Search, discovery & employer view — complete
- **Module 8:** Dashboard, analytics, security & deployment — complete

### Core APIs

| Area | Base path |
|------|-----------|
| Health | `/api/health` |
| Auth | `/api/auth` |
| Profiles | `/api/profiles` |
| Projects | `/api/projects` |
| Portfolio | `/api/portfolio` |
| Explore | `/api/explore` |
| Dashboard | `/api/dashboard` |
| Account | `/api/account` |

Full endpoint tables and feature notes are maintained in git history / module docs above. Public portfolios: `/portfolio/:username`. Employer discovery: `/explore`, `/interns`.

## Deployment

See **[DEPLOYMENT.md](./DEPLOYMENT.md)** for MongoDB Atlas, Clerk, and single-host full-stack deploy steps.
