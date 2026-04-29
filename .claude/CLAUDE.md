# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Collaborative Cloudboard is a Kanban-style collaborative task board with real-time updates (Socket.io). It is a monorepo with two independent apps:

- `client-vite/` — React 19 + TypeScript frontend (Vite)
- `server/` — Express 5 + TypeScript backend (MongoDB)

## Development Commands

Run each app from its own directory.

**Frontend** (`cd client-vite`):

```bash
npm run start     # dev server on port 5173
npm run build     # tsc -b && vite build
npm run lint      # eslint
```

**Backend** (`cd server`):

```bash
npm run start     # tsx watch src/index.ts (hot reload)
npm run build     # tsc → dist/
npm run prod      # node dist/index.js
```

No tests are configured yet (`test` script exits with error).

## Environment Variables

**`client-vite/.env`**

```
VITE_API_BASE_URL="http://localhost:5000/api"
```

**`server/.env`**

```
MONGODB_URI=mongodb://localhost:27017/cloudboard
JWT_SECRET=<secret>
PORT=5000
CLIENT_URL="http://localhost:5173"
```

## Architecture

### Frontend (`client-vite/src/`)

Feature-based structure under `features/`:

- `features/auth/` — AuthProvider (React Context), login/register forms, JWT token utils
- `features/projects/` — project list, cards, details, creation modal
- `features/tasks/` — TaskBoard with @dnd-kit drag-drop, TaskCard, TaskColumn, TaskModal

Shared:

- `components/` — ProtectedRoute, TopNav, SidePanel
- `pages/` — AuthPage, Dashboard, ErrorPage
- `api/axiosInstance.ts` — axios configured with auto-injected Bearer token from localStorage
- `styles/theme.scss` — global SASS variables and Bootstrap overrides

Routing in `App.tsx` (React Router 7): `/auth`, `/dashboard` (protected), `/projects/:id` (protected), `/error`. All protected routes are wrapped with `NavLayout` + `ProtectedRoute`.

Auth state is managed entirely via React Context (no Redux/Zustand).

### Backend (`server/src/`)

```
index.ts       HTTP + Socket.io bootstrap (port 5000)
app.ts         Express middleware + route mounting
routes/        Route definitions (auth, users, projects, tasks)
controllers/   Business logic
middleware/    verifyToken (JWT), validate (Zod)
validators/    Zod schemas (project, task)
models/        Mongoose schemas
config/db.ts   MongoDB connection
utils/         generateToken
```

Routes:

- `POST /api/auth/*` — public (no token required)
- `GET|POST|PUT|DELETE /api/users|projects|tasks` — protected via `verifyToken` middleware

**Mongoose models:**

- `User`: username, email, passwordHash, firstName, lastName, avatarUrl, role (`user` | `admin`)
- `Project`: name, description, owner (ref User), members (ref[] User)
- `Task`: title, description, status (`todo` | `in-progress` | `done`), project (ref), assignee (ref User), order (for drag-drop sort)

Backend uses ES modules (`"type": "module"` in package.json); imports must use `.js` extensions in TypeScript source files.

### Real-time

Socket.io is initialized in `server/src/index.ts` but only logs connections — not yet wired to any domain events. The frontend does not yet connect to it.

## Key Conventions

- TypeScript everywhere; strict mode enabled on the backend
- Functional components + hooks only on the frontend
- Validation at API boundaries via Zod (backend); no duplicate client-side schema validation exists yet
- Task ordering for drag-drop is persisted via the `order` field on the Task model
- `tasksApi.ts` is currently empty — task CRUD goes directly through `axiosInstance` in the component layer for now
