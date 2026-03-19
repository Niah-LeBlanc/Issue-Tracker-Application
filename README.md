# Issue Tracker — Backend

Express + MongoDB REST API with Better Auth session management.

## Setup

```bash
npm install
cp .env.example .env   # fill in MONGO_URI, MONGO_DB_NAME, BETTER_AUTH_SECRET
```

## Run

```bash
npm run dev    # auto-restarts on file changes (node --watch)
npm start      # production
```

Server starts on `http://localhost:5000`.

## Environment variables

| Variable | Required | Description |
|---|---|---|
| `MONGO_URI` | ✅ | MongoDB connection string |
| `MONGO_DB_NAME` | ✅ | Database name |
| `BETTER_AUTH_SECRET` | ✅ | Random secret for session signing |
| `BETTER_AUTH_URL` | | Backend URL (default: `http://localhost:5000`) |
| `CORS_ORIGIN` | | Comma-separated allowed origins (default: `http://localhost:5173`) |
| `PORT` | | Port (default: `5000`) |

## API Routes

| Method | Route | Description |
|---|---|---|
| GET | `/api/bugs` | List all bugs |
| POST | `/api/bugs` | Create a bug |
| PATCH | `/api/bugs/:id` | Update bug fields |
| PATCH | `/api/bugs/:id/classify` | Set classification (`critical`/`major`/`minor`/`trivial`) |
| PATCH | `/api/bugs/:id/assign` | Assign to user (`{ assignedToUserId }`) |
| PATCH | `/api/bugs/:id/close` | Open/close (`{ closed: bool }`) |
| POST | `/api/bugs/:id/worklog` | Log hours (`{ time: number }`) |
| POST | `/api/comments/:bugId/comments` | Add comment (`{ author, commentText }`) |
| POST | `/api/bugs/:id/tests` | Add test case |
| DELETE | `/api/bugs/:id/tests/:testId` | Delete test case |
| GET | `/api/users` | List users |
| GET | `/api/users/me` | Get current user |
| PUT | `/api/users/me` | Update own profile |
| PATCH | `/api/users/:id` | Admin: update any user |
| DELETE | `/api/users/:id` | Admin: delete user |
| ALL | `/api/auth/*` | Better Auth (login, register, session) |
