# math-processor

Async Process Tracker — accepts a list of numbers, processes it in the background (validation → sum), and lets you track progress, logs and result in real time.

## Stack

- Backend: Python (FastAPI + asyncio)
- Frontend: React + TypeScript (Vite)

## Prerequisites

- Python 3.10+
- Node.js 18+
- `make` (optional, but recommended — see below)

## Quick start

```bash
make setup   # creates the backend venv and installs both dependency sets
make dev     # runs backend and frontend together; Ctrl+C stops both
```

Backend at `http://localhost:8000`, frontend at `http://localhost:5173`. That's it — skip to [Using the app](#using-the-app).

## Manual setup

If you don't have `make`, run each side yourself, in two terminals.

### Backend

```bash
cd backend
python -m venv venv
source venv/bin/activate
pip install -r requirements.txt
uvicorn app.main:app --reload
```

The API runs at `http://localhost:8000`. Interactive docs (Swagger) at `http://localhost:8000/docs`.

### Frontend

In a separate terminal:

```bash
cd frontend
npm install
npm run dev
```

The app runs at `http://localhost:5173`.

> Both need to be running at the same time. The backend only accepts requests from `http://localhost:5173` (CORS) — if you change the frontend port, update `allow_origins` in `backend/app/main.py`.

## Using the app

1. Open `http://localhost:5173`.
2. Click **New request**, enter a comma-separated list of numbers (e.g. `10, 20, 5`) and submit.
3. You'll be taken to the detail screen, which polls the backend every second and shows status, progress, logs and the final result.
4. From the detail screen you can cancel a request that's still running, or jump straight to creating another one.
5. From the list screen, **Clear all** wipes every stored request (and cancels any still in progress).

## Things worth knowing

- Storage is in-memory only — restarting the backend clears all requests.
- Numbers must be non-negative integers; a negative number makes the request fail with `status: "error"`.
- Cancelling a request also results in `status: "error"` (no separate `cancelled` status), with a log entry indicating it was cancelled by the user.
- Processing takes about 16 seconds end to end (deliberately slow, with pauses between steps, so progress is actually visible while polling).

See `PLANNING.md` for the reasoning behind these decisions.
