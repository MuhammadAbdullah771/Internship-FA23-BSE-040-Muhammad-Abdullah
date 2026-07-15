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
