## Understanding of the problem
The project is about reliable asynchronous processing. It needs to accept a processing request and work on it in the background,
while still being able to handle other requests, in a scalable way. This problem is common in the real world and is very important
for most software solutions out there.

## Technical decisions
Backend stack: FastAPI with asyncio
Frontend stack: React with TypeScript
Docker for a quick setup

## Project structure
backend/
  app/
    main.py          
    models.py
    store.py
    processing.py
    routers/
      requests.py      
  requirements.txt

## Assumptions
- All data must be validated, so we should not accept strings for the data processing;
- CORS is a must here;
- Added an extra 3-second pause between reaching 70% progress and the completed status, so the intermediate progress state is actually visible to a client polling every second, instead of jumping straight from 70 to 100 in the same instant.

## Expected difficulties
State management