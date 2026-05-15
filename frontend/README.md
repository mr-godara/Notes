# Notes Frontend

Production-ready React frontend for the Notes REST API. It provides authentication, protected routes, note CRUD, sharing, pinning, search, pagination, dark mode, draft autosave, copy-to-clipboard, and responsive layouts.

## Tech Stack

- React + Vite
- Tailwind CSS
- React Router DOM
- Axios
- TanStack Query
- Context API
- React Hook Form
- Zod
- React Hot Toast
- Lucide React
- Framer Motion

## Project Structure

```text
src/
 |-- api/
 |   `-- axios.js
 |-- components/
 |   |-- Loader.jsx
 |   |-- Navbar.jsx
 |   |-- NoteCard.jsx
 |   |-- NoteModal.jsx
 |   |-- Pagination.jsx
 |   |-- ProtectedRoute.jsx
 |   `-- ShareModal.jsx
 |-- context/
 |   `-- AuthContext.jsx
 |-- hooks/
 |   `-- useAuth.js
 |-- layouts/
 |   `-- MainLayout.jsx
 |-- pages/
 |   |-- About.jsx
 |   |-- Dashboard.jsx
 |   |-- Login.jsx
 |   |-- NotFound.jsx
 |   `-- Register.jsx
 |-- routes/
 |   `-- AppRoutes.jsx
 |-- services/
 |   |-- authService.js
 |   `-- notesService.js
 |-- utils/
 |   `-- formatDate.js
 |-- App.jsx
 |-- main.jsx
 `-- index.css
```

## Environment Variables

Create a `.env` file in the `frontend` directory:

```env
VITE_API_BASE_URL=http://localhost:5000
```

For production, set this to your deployed Render backend URL:

```env
VITE_API_BASE_URL=https://your-render-api.onrender.com
```

## Local Development

Install dependencies:

```bash
npm install
```

Start the Vite dev server:

```bash
npm run dev
```

Open:

```text
http://localhost:5173
```

Make sure the backend API is running at `http://localhost:5000` or update `VITE_API_BASE_URL`.

## Features

- Register and login
- JWT stored in localStorage
- Axios interceptor attaches bearer token
- Automatic logout on `401`
- Protected routes
- Notes dashboard with pinned notes first
- Create, edit, delete, share, pin, and unpin notes
- Owner-only edit/delete controls
- Debounced live search through `/search?q=keyword`
- Pagination through `/notes?page=1&limit=20`
- About page powered by `/about`
- Dark/light theme toggle
- Autosaved draft notes
- Character counter
- Copy note button
- Keyboard shortcuts:
  - `/` focuses search
  - `n` opens the create-note modal

## Production Build

```bash
npm run build
```

Preview locally:

```bash
npm run preview
```

## Deploy to Vercel

1. Push the repository to GitHub.
2. Create a new Vercel project.
3. Set the root directory to:

```text
frontend
```

4. Use these build settings:

```text
Framework Preset: Vite
Build Command: npm run build
Output Directory: dist
Install Command: npm install
```

5. Add the production environment variable:

```env
VITE_API_BASE_URL=https://your-render-api.onrender.com
```

6. Deploy.

## Backend CORS

Update the backend `CORS_ORIGIN` environment variable on Render to your Vercel domain:

```env
CORS_ORIGIN=https://your-frontend.vercel.app
```

For multiple origins, use a comma-separated list:

```env
CORS_ORIGIN=http://localhost:5173,https://your-frontend.vercel.app
```
