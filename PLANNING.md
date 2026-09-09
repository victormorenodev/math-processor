## Understanding of the problem
The project is about reliable asynchronous processing. It needs to accept a processing request and work on it in the background,
while still being able to handle other requests, in a scalable way. This problem is common in the real world and is very important
for most software solutions out there.

## Technical decisions
Backend stack: FastAPI with asyncio
Frontend stack: React with TypeScript
Makefile for a quick setup (`make setup` creates the venv and installs both dependency sets, `make dev` runs backend and frontend together with a single command and Ctrl+C stops both). Originally planned to use Docker for this, but switched to a Makefile: it keeps the setup to tooling the reviewer already has installed (Python, Node, make), avoids image build/rebuild time during development, and is enough for a two-process local app that doesn't need containerization's isolation or deployment benefits.

## Project structure
Makefile
README.md
PLANNING.md
backend/
  requirements.txt
  app/
    main.py
    models.py
    store.py
    processing.py
    routers/
      requests.py
frontend/
  package.json
  index.html
  src/
    main.tsx
    index.css
    App.tsx
    api.ts
    types.ts
    pages/
      RequestList.tsx
      NewRequest.tsx
      RequestDetail.tsx

## Assumptions
- All data must be validated, so we should not accept strings for the data processing;
- CORS is a must here;
- Added an extra 3-second pause between reaching 70% progress and the completed status, so the intermediate progress state is actually visible to a client polling every second, instead of jumping straight from 70 to 100 in the same instant.

## Expected difficulties
State management