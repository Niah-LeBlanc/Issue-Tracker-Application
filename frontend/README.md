# Issue Tracker — Frontend

React + TypeScript + Vite SPA for the Issue Tracker backend.

## Setup

```bash
npm install
```

The `.env.local` file already points to `http://localhost:5000` (the backend).  
Change `VITE_API_URL` if your backend runs elsewhere.

## Run

```bash
npm run dev      # dev server on http://localhost:5173
npm run build    # production build → dist/
npm run preview  # preview the production build locally
```

During development, Vite proxies all `/api/*` requests to `http://localhost:5000`
so you don't need to worry about CORS in dev mode.
