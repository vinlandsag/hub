# Kerala Events Hub: Backend Prototype

This folder contains a small Express + SQLite prototype for the frontend in `html/hub`.

## Setup

1. `cd html/hub/server`
2. `npm install`
3. `npm run start` (or `npm run dev`)

Server runs at `http://localhost:5000`.

## API Endpoints

- `GET /api/status`
- `GET /api/events`  (optional `?type=workshop`)
- `GET /api/events/:id`
- `POST /api/register` `{ name, email, phone, college }`
- `POST /api/login` `{ email }`
- `POST /api/event-registration` `{ userId, eventId }`
- `GET /api/my-events/:userId`

## Notes

- Database file: `kerala-events.db`
- Uses `better-sqlite3` for local persistence
- Ready for integration from `html/hub/script.js`
