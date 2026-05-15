# Notes API

A production-ready REST API for a multi-user Notes application similar to Google Keep, Apple Notes, and Notion. The backend supports authentication, private notes, shared notes, note pinning, search, pagination, Swagger/OpenAPI documentation, Docker, and Render PostgreSQL deployment.

## Live Links

Backend API base URL:

```text
https://notes-v7q9.onrender.com
```

Swagger API documentation:

```text
https://notes-v7q9.onrender.com/api-docs
```

Raw OpenAPI JSON:

```text
https://notes-v7q9.onrender.com/openapi.json
```

Frontend application:

```text
https://notes-khaki-beta.vercel.app
```

```

Automated API tests should suffix paths to the backend base URL, for example:

```text
https://notes-v7q9.onrender.com/about
https://notes-v7q9.onrender.com/login
https://notes-v7q9.onrender.com/register
https://notes-v7q9.onrender.com/notes
```

Important: `/login`, `/register`, `/notes`, and other write endpoints must be called with their documented HTTP methods. Opening `https://notes-v7q9.onrender.com/login` in a browser sends `GET /login`, which is not a defined route. Login is `POST /login`.

## Tech Stack

- Node.js
- Express.js
- PostgreSQL
- `pg`
- JWT authentication
- bcrypt password hashing
- Joi validation
- Helmet
- CORS
- Swagger/OpenAPI
- Docker and Docker Compose
- Render PostgreSQL

## Features

- User registration and login
- JWT bearer authentication
- Protected notes routes
- Owner-only update, delete, share, and pin operations
- Owner-or-shared-user read access
- Paginated notes listing
- Pinned notes ordered first
- Case-insensitive title and content search
- Note sharing by recipient email
- Consistent JSON error responses
- Auto-created PostgreSQL tables on startup
- Swagger UI with bearer token authorization support
- Render-ready PostgreSQL SSL configuration

## Folder Structure

```text
.
|-- app.js
|-- server.js
|-- openapi.json
|-- Dockerfile
|-- docker-compose.yml
|-- package.json
|-- README.md
|-- .env.example
|-- frontend/
`-- src
    |-- config
    |-- controllers
    |-- database
    |-- docs
    |-- middleware
    |-- models
    |-- routes
    |-- schemas
    |-- services
    `-- utils
```

## Environment Variables

Copy `.env.example` to `.env` and set values for your environment.

```env
NODE_ENV=development
PORT=5000
DATABASE_URL=postgresql://notes_user:notes_password@localhost:5432/notes_db
DATABASE_SSL=false
JWT_SECRET=replace-with-a-long-random-secret
JWT_EXPIRES_IN=24h
BCRYPT_SALT_ROUNDS=10
CORS_ORIGIN=*
API_BASE_URL=http://localhost:5000
```



## Local Development

Install dependencies:

```bash
npm install
```

Create `.env`:

```bash
cp .env.example .env
```

Start the backend:

```bash
npm run dev
```

The API runs at:

```text
http://localhost:5000
```

Tables are created automatically on startup:

- `users`
- `notes`
- `note_shares`

## Frontend Setup

The React frontend lives in `frontend/`.

```bash
cd frontend
npm install
npm run dev
```

Frontend local URL:

```text
http://localhost:5173
```

Frontend environment variable:

```env
VITE_API_BASE_URL=http://localhost:5000
```



## Docker Setup

Run the API and PostgreSQL together:

```bash
docker compose up --build
```

The API will be available at:

```text
http://localhost:5000
```

Docker Compose publishes PostgreSQL on host port `5433` to avoid conflicts with local PostgreSQL:

```text
localhost:5433 -> postgres:5432
```

The app container uses Docker internal networking:

```text
postgresql://notes_user:notes_password@postgres:5432/notes_db
```

## Swagger Usage

Local Swagger UI:

```text
http://localhost:5000/api-docs
```

Production Swagger UI:

```text
https://notes-v7q9.onrender.com/api-docs
```

Local OpenAPI JSON:

```text
http://localhost:5000/openapi.json
```

Production OpenAPI JSON:

```text
https://notes-v7q9.onrender.com/openapi.json
```

Swagger UI supports JWT bearer authentication. After calling `/login`, click **Authorize** and enter:

```text
Bearer your_jwt_token
```

Regenerate `openapi.json` from route JSDoc comments:

```bash
npm run generate:openapi
```

## API Endpoints

| Method | Endpoint | Auth | Description |
| --- | --- | --- | --- |
| `GET` | `/` | No | Health check |
| `GET` | `/about` | No | Project and feature metadata |
| `POST` | `/register` | No | Register a user |
| `POST` | `/login` | No | Login and receive JWT |
| `GET` | `/notes?page=1&limit=10` | Yes | List owned and shared notes |
| `GET` | `/notes/:id` | Yes | Get one accessible note |
| `POST` | `/notes` | Yes | Create note |
| `PUT` | `/notes/:id` | Yes | Update note, owner only |
| `DELETE` | `/notes/:id` | Yes | Delete note, owner only |
| `POST` | `/notes/:id/share` | Yes | Share note by email, owner only |
| `PATCH` | `/notes/:id/pin` | Yes | Toggle pin state, owner only |
| `GET` | `/search?q=keyword` | Yes | Search accessible notes |
| `GET` | `/api-docs` | No | Swagger UI |
| `GET` | `/openapi.json` | No | Raw OpenAPI JSON |

## API Examples

Health:

```bash
curl https://notes-v7q9.onrender.com/
```

About:

```bash
curl https://notes-v7q9.onrender.com/about
```

Register:

```bash
curl -X POST https://notes-v7q9.onrender.com/register \
  -H "Content-Type: application/json" \
  -d "{\"email\":\"user@example.com\",\"password\":\"secret123\"}"
```

Login:

```bash
curl -X POST https://notes-v7q9.onrender.com/login \
  -H "Content-Type: application/json" \
  -d "{\"email\":\"user@example.com\",\"password\":\"secret123\"}"
```

Login response:

```json
{
  "access_token": "jwt_token"
}
```

Create note:

```bash
curl -X POST https://notes-v7q9.onrender.com/notes \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer jwt_token" \
  -d "{\"title\":\"Meeting notes\",\"content\":\"Discuss launch checklist.\"}"
```

List notes:

```bash
curl "https://notes-v7q9.onrender.com/notes?page=1&limit=10" \
  -H "Authorization: Bearer jwt_token"
```

Get note:

```bash
curl https://notes-v7q9.onrender.com/notes/{note_id} \
  -H "Authorization: Bearer jwt_token"
```

Update note:

```bash
curl -X PUT https://notes-v7q9.onrender.com/notes/{note_id} \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer jwt_token" \
  -d "{\"title\":\"Updated title\",\"content\":\"Updated content.\"}"
```

Delete note:

```bash
curl -X DELETE https://notes-v7q9.onrender.com/notes/{note_id} \
  -H "Authorization: Bearer jwt_token"
```

Share note:

```bash
curl -X POST https://notes-v7q9.onrender.com/notes/{note_id}/share \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer jwt_token" \
  -d "{\"share_with_email\":\"teammate@example.com\"}"
```

Toggle pin:

```bash
curl -X PATCH https://notes-v7q9.onrender.com/notes/{note_id}/pin \
  -H "Authorization: Bearer jwt_token"
```

Search:

```bash
curl "https://notes-v7q9.onrender.com/search?q=launch" \
  -H "Authorization: Bearer jwt_token"
```

## Access Rules

- Register and login are public.
- `/notes` routes require JWT bearer auth.
- `/search` requires JWT bearer auth.
- Note owners can read, update, delete, share, pin, and unpin their notes.
- Shared users can read notes shared with them.
- Shared users cannot update, delete, share, pin, or unpin notes they do not own.

## Error Format

Validation error:

```json
{
  "message": "Validation failed",
  "errors": ["email must be a valid email"]
}
```

Authentication error:

```json
{
  "message": "Invalid email or password"
}
```

Forbidden error:

```json
{
  "message": "You are not allowed to perform this action"
}
```

Not found error:

```json
{
  "message": "Note not found"
}
```



## Security Notes

- Passwords are hashed with bcrypt.
- JWT payload contains only `userId`.
- JWT expiry is 24 hours by default.
- SQL queries use parameterized `pg` calls.
- Stack traces are not exposed in API responses.
- Helmet and CORS are enabled globally.
- Secrets are loaded from environment variables.
- `.env` is ignored by Git.
