# Intern Project Showcase Platform

Production-ready MERN application where interns create profiles, manage projects, customize portfolios, and share public portfolio links with recruiters.

## Stack

- **Frontend:** React (Vite), React Router, Axios, Tailwind CSS
- **Backend:** Node.js, Express, MongoDB, Mongoose

## Project structure

```
├── backend/          # Express API
└── frontend/         # React (Vite) client
```

## Prerequisites

- Node.js 18+
- MongoDB running locally (or update `MONGODB_URI`)

## Setup

### Backend

```bash
cd backend
cp .env.example .env
npm install
npm run dev
```

API: `http://localhost:5000`  
Health: `http://localhost:5000/api/health`

### Frontend

```bash
cd frontend
cp .env.example .env
npm install
npm run dev
```

App: `http://localhost:5173`

## Module 1 status

Project foundation and application architecture are complete. Authentication and domain features arrive in later modules.
