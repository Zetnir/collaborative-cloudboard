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
npm run preview   # preview built app
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
CLOUDINARY_CLOUD_NAME=<name>
CLOUDINARY_API_KEY=<key>
CLOUDINARY_API_SECRET=<secret>
```

## Architecture

### Frontend (`client-vite/src/`)

Feature-based structure under `features/`:

- `features/auth/` — AuthProvider (React Context), login/register forms, JWT token utils, authApi
- `features/projects/` — project list, cards, creation modal, projectsApi
- `features/tasks/` — TaskBoard with @dnd-kit drag-drop, TaskCard, TaskColumn, TaskDetails modal (full task edit with RTE, comments, priority, assignee)

Shared:

- `components/` — ProtectedRoute, TopNav, SidePanel, PrioritySelect (TomSelect-based dropdown)
- `pages/` — AuthPage, Dashboard, ErrorPage, ProjectDetails
- `api/axiosInstance.ts` — axios with request interceptor that auto-injects `Authorization: Bearer <token>` from localStorage
- `api/tasksApi.ts` — `getTasksByProject(projectId)`, `createTask(taskData)`, `moveTask(id, { status, order })`
- `api/usersApi.ts` — `getAll()`, `getById(id)`
- `api/uploadsApi.ts` — image upload to Cloudinary via FormData
- `styles/theme.scss` — global SASS variables and Bootstrap overrides

Routing in `App.tsx` (React Router 7): `/auth`, `/dashboard` (protected), `/projects/:id` (protected), `/error`. All protected routes are wrapped with `NavLayout` + `ProtectedRoute`.

Auth state is managed entirely via React Context (no Redux/Zustand). `refreshToken` is stored in localStorage but auto-refresh is **not yet implemented** — the interceptor only validates/attaches the access token.

### Backend (`server/src/`)

```
index.ts       HTTP + Socket.io bootstrap
app.ts         Express middleware + route mounting
routes/        auth, users, projects, tasks, upload
controllers/   Business logic; all return DTOs (never raw Mongoose docs)
middleware/    verifyToken (JWT), validate (Zod)
validators/    Zod schemas (project, task)
models/        Mongoose schemas
config/db.ts   MongoDB connection
utils/         generateToken
```

**Routes:**

- `POST /api/auth/register|login` — public
- `GET /api/auth/me` — requires `verifyToken`
- `POST /api/upload` — protected; multer memory storage → Cloudinary
- All `users|projects|tasks` routes — protected via `verifyToken`

**Task-specific endpoints:**
- `GET /api/tasks?project=<id>` — fetch tasks filtered by project, sorted by `order`
- `PATCH /api/tasks/:id/move` — accepts `{ order, status }` to persist drag-drop position

**Project-specific endpoints:**
- `PATCH /api/projects/:id/move` — accepts `{ columns }` to persist column order/additions

**Mongoose models:**

- `User`: username, email, passwordHash, firstName, lastName, avatarUrl, role (`user` | `admin`)
- `Project`: name, description, owner (ref User), members (ref[] User), access (`private` | `public`), workspace, coverImgUrl, columns (`string[]` — ordered list of column names)
- `Task`: title, description, status (mirrors current column name), project (ref), assignee (ref User, nullable), order (drag-drop sort within column), priority (`lowest` | `low` | `medium` | `high` | `highest`), dueDate, comments (`{ user, text, createdAt }[]`)

Backend uses ES modules (`"type": "module"`); imports must use `.js` extensions in TypeScript source files.

### Real-time

Socket.io is initialized in `server/src/index.ts` but only logs connections — not yet wired to any domain events. The frontend does not yet connect to it.

## Key Conventions

- TypeScript everywhere; strict mode enabled on the backend
- Functional components + hooks only on the frontend
- Validation at API boundaries via Zod (`validate` middleware replaces `req.body` with the parsed result); no client-side schema validation
- All controllers transform Mongoose documents to DTOs before responding — never return raw `_id` fields
- Task ordering for drag-drop is persisted via the `order` field on the Task model; use `PATCH /tasks/:id/move` for position updates
- Zod validator for `assignee` transforms `""` → `null` to avoid Mongoose ObjectId cast errors
- Columns are dynamic and stored on the Project model as `string[]`; `PATCH /api/projects/:id/move` persists column reordering; a task's `status` field mirrors its column name
- Priority display uses `getPriorityIcon()` from `utils/priority.utils.tsx` — two render modes: React element (default) and static HTML string (`isStatic: true`) for TomSelect dropdown injection
