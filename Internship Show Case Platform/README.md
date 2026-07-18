# Intern Project Showcase Platform

Production-ready MERN application where interns create profiles, manage projects, customize portfolios, and share public portfolio links with recruiters.

## Stack

- **Frontend:** React (Vite), React Router, Axios, Tailwind CSS, Clerk
- **Backend:** Node.js, Express, MongoDB, Mongoose, Clerk (`@clerk/express`)

## Project structure

```
├── backend/          # Express API
└── frontend/         # React (Vite) client
```

## Prerequisites

- Node.js 18+
- MongoDB running locally (or update `MONGODB_URI`)
- A Clerk application ([dashboard.clerk.com](https://dashboard.clerk.com))

## Clerk setup

1. Create a Clerk application.
2. Enable **Email** + **Password** under User & Authentication.
3. Copy API keys into env files:

**`backend/.env`**
```
CLERK_PUBLISHABLE_KEY=pk_test_...
CLERK_SECRET_KEY=sk_test_...
```

**`frontend/.env`**
```
VITE_CLERK_PUBLISHABLE_KEY=pk_test_...
```

4. In Clerk Dashboard → Configure → Paths (or Domains), allow `http://localhost:5173`.

> Passwords are hashed and stored by **Clerk**, not in MongoDB. The app User model stores `clerkId`, profile fields, and role.

## Setup

From the project root:

```bash
npm run install:all
npm run dev
```

That starts both servers:
- Frontend: `http://localhost:5173`
- Backend API: `http://localhost:5000`

Or run them separately:

```bash
npm run dev:backend
npm run dev:frontend
```

## Auth API (Module 2)

| Method | Endpoint | Access | Description |
|--------|----------|--------|-------------|
| `POST` | `/api/auth/sync` | Private (Clerk JWT) | Upsert MongoDB user from Clerk |
| `GET` | `/api/auth/me` | Private (Clerk JWT) | Current app user |

## Module status

- **Module 1:** Project foundation & architecture — complete
- **Module 2:** Clerk authentication & authorization — complete
- **Module 3:** Intern profile management — complete
- **Module 4:** Project management — complete
- **Module 5:** Dynamic portfolio editor — complete
- **Module 6:** Public portfolio & shareable links — complete

### Profile API

| Method | Endpoint | Access | Description |
|--------|----------|--------|-------------|
| `GET` | `/api/profiles/me` | Private | Get current profile |
| `POST` | `/api/profiles` | Private | Create profile |
| `PUT` | `/api/profiles/me` | Private | Update profile |
| `POST` | `/api/profiles/me/image` | Private | Upload profile image |
| `POST` | `/api/profiles/me/skills` | Private | Add skill |
| `DELETE` | `/api/profiles/me/skills/:skill` | Private | Remove skill |
| `PUT` | `/api/profiles/me/social` | Private | Update social links |

### Portfolio API (Module 5)

| Method | Endpoint | Access | Description |
|--------|----------|--------|-------------|
| `GET` | `/api/portfolio/me` | Private | Get portfolio settings (+ profile & ordered projects) |
| `PUT` | `/api/portfolio/me` | Private | Update / save all portfolio settings |
| `PUT` | `/api/portfolio/me/visibility` | Private | Save section visibility |
| `PUT` | `/api/portfolio/me/project-order` | Private | Save project order |
| `PUT` | `/api/portfolio/me/theme` | Private | Save selected theme (& primary color) |
| `PUT` | `/api/portfolio/me/customization` | Private | Save about / skills / projects / contact customization |
| `PUT` | `/api/portfolio/me/username` | Private | Set portfolio username (slug) |
| `POST` | `/api/portfolio/me/username/generate` | Private | Generate a unique username suggestion |

**Portfolio settings model:** `user`, `username`, `theme`, `primaryColor`, `sectionVisibility`, `projectOrder`, `customHeadline`, `portfolioStatus`, plus nested `customization` for each section.

**Frontend:** `/portfolio` — live preview, theme & color picker, section toggles, drag-and-drop project order, username/slug controls, and save controls.

### Public Portfolio API (Module 6)

| Method | Endpoint | Access | Description |
|--------|----------|--------|-------------|
| `GET` | `/api/portfolio/check-username?username=` | Public | Check username availability |
| `GET` | `/api/portfolio/public/:username` | Public | Full published portfolio (settings + intern + projects) |
| `GET` | `/api/portfolio/public/:username/profile` | Public | Public intern information only |
| `GET` | `/api/portfolio/public/:username/projects` | Public | Public projects list |
| `GET` | `/api/portfolio/public/:username/projects/:projectId` | Public | Single public project (full details) |

Public responses omit private fields (`clerkId`, auth providers, role, email unless contact visibility allows it). Only portfolios with `portfolioStatus: published` are accessible.

**Frontend:** `/portfolio/:username` — public hero, about, skills, projects (modal details), contact/socials, copy link & share buttons. No authentication required.
