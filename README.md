# Notes API

A production-ready backend REST API for a multi-user Notes application similar to Google Keep or Apple Notes. It supports user registration, JWT login, private notes, shared notes, note pinning, full text search, Swagger documentation, Docker, and Render PostgreSQL deployment.

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

```bash
NODE_ENV=development
PORT=5000
DATABASE_URL=postgresql://notes_user:notes_password@localhost:5432/notes_db
JWT_SECRET=replace-with-a-long-random-secret
JWT_EXPIRES_IN=24h
BCRYPT_SALT_ROUNDS=10
CORS_ORIGIN=*
API_BASE_URL=http://localhost:5000
```

`DATABASE_URL` is the only database configuration needed locally and on Render. In production, the app automatically enables PostgreSQL SSL with `rejectUnauthorized: false`, which is required for Render PostgreSQL.

## Local Development

1. Install dependencies.

```bash
npm install
```

2. Create `.env`.

```bash
cp .env.example .env
```

3. Start PostgreSQL locally and ensure `DATABASE_URL` points to it.

4. Start the API.

```bash
npm run dev
```

The server starts on `http://localhost:5000` by default. Tables are created automatically on startup:

- `users`
- `notes`
- `note_shares`

## Docker Setup

Run the API and PostgreSQL together:

```bash
docker compose up --build
```

The API will be available at:

```text
http://localhost:5000
```

The Docker Compose PostgreSQL connection string is:

```text
postgresql://notes_user:notes_password@postgres:5432/notes_db
```

## Swagger Usage

Swagger UI is available at:

```text
GET /api-docs
```

Raw OpenAPI JSON is available at:

```text
GET /openapi.json
```

Swagger UI supports JWT bearer authentication. After calling `/login`, click **Authorize** and enter:

```text
Bearer your_jwt_token
```

The OpenAPI document is generated from `src/config/swagger.js` and route JSDoc comments. To regenerate the checked-in `openapi.json` file manually:

```bash
npm run generate:openapi
```

## API Endpoints

### Health

```http
GET /
```

Response:

```json
{
  "status": "ok",
  "message": "Notes API running"
}
```

### Register

```bash
curl -X POST http://localhost:5000/register \
  -H "Content-Type: application/json" \
  -d "{\"email\":\"user@example.com\",\"password\":\"secret123\"}"
```

### Login

```bash
curl -X POST http://localhost:5000/login \
  -H "Content-Type: application/json" \
  -d "{\"email\":\"user@example.com\",\"password\":\"secret123\"}"
```

Response:

```json
{
  "access_token": "jwt_token"
}
```

### Create Note

```bash
curl -X POST http://localhost:5000/notes \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer jwt_token" \
  -d "{\"title\":\"Meeting notes\",\"content\":\"Discuss launch checklist.\"}"
```

### List Notes

```bash
curl "http://localhost:5000/notes?page=1&limit=10" \
  -H "Authorization: Bearer jwt_token"
```

Notes owned by the user and notes shared with the user are returned. Pinned notes appear first, then latest updated notes.

### Get Note

```bash
curl http://localhost:5000/notes/{note_id} \
  -H "Authorization: Bearer jwt_token"
```

### Update Note

```bash
curl -X PUT http://localhost:5000/notes/{note_id} \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer jwt_token" \
  -d "{\"title\":\"Updated title\",\"content\":\"Updated content.\"}"
```

Only note owners can update notes.

### Delete Note

```bash
curl -X DELETE http://localhost:5000/notes/{note_id} \
  -H "Authorization: Bearer jwt_token"
```

Only note owners can delete notes.

### Share Note

```bash
curl -X POST http://localhost:5000/notes/{note_id}/share \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer jwt_token" \
  -d "{\"share_with_email\":\"teammate@example.com\"}"
```

Only note owners can share notes. A note cannot be shared with the owner, with a missing user, or with the same user twice.

### Toggle Pin

```bash
curl -X PATCH http://localhost:5000/notes/{note_id}/pin \
  -H "Authorization: Bearer jwt_token"
```

Only note owners can pin or unpin notes.

### Search

```bash
curl "http://localhost:5000/search?q=launch" \
  -H "Authorization: Bearer jwt_token"
```

Search is case-insensitive and only returns notes the authenticated user can access.

### About

```bash
curl http://localhost:5000/about
```

Response:

```json
{
  "name": "Amit Godara",
  "email": "your-email@example.com",
  "my_features": {
    "note_pinning": "Allows users to pin important notes for quick access."
  }
}
```

## Render.com Deployment

1. Push this project to GitHub.

2. Create a new PostgreSQL database on Render.

3. Copy the database internal connection string from Render. It will look like:

```text
postgresql://user:password@host:5432/dbname
```

4. Create a new Render Web Service from the GitHub repository.

5. Use these settings:

```text
Environment: Node
Build Command: npm install
Start Command: npm start
```

6. Add environment variables in Render:

```text
NODE_ENV=production
PORT=10000
DATABASE_URL=your_render_postgres_database_url
JWT_SECRET=your_long_random_production_secret
JWT_EXPIRES_IN=24h
BCRYPT_SALT_ROUNDS=10
CORS_ORIGIN=https://your-frontend-domain.com
API_BASE_URL=https://your-render-service.onrender.com
```

Render provides `PORT` automatically. The server uses `process.env.PORT || 5000`, so no code changes are required.

7. Deploy. On first startup, the app creates all database tables automatically.

## Security Notes

- Passwords are hashed with bcrypt using salt rounds from `BCRYPT_SALT_ROUNDS`, defaulting to `10`.
- JWT payload contains only `userId`.
- All `/notes` and `/search` routes require a bearer token.
- SQL queries use parameterized `pg` calls.
- Stack traces are never exposed in API responses.
- Helmet and CORS are enabled globally.

## Error Format

Errors use a consistent JSON shape:

```json
{
  "message": "Validation failed",
  "errors": ["email must be a valid email"]
}
```

For non-validation errors:

```json
{
  "message": "Invalid email or password"
}
```
