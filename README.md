# CRM Project

A simple Customer Relationship Management (CRM) web application for managing sales leads. Built as a full-stack project with a React frontend and an Express/Node.js backend, using SQLite as the database.

---

## Project Overview

This CRM allows a sales team to track leads through the sales pipeline — from first contact all the way to won or lost. Users can create, view, edit, delete, and filter leads, add internal notes to each lead, and get a high-level summary of pipeline health on a dashboard.

---

## Tech Stack

**Frontend**
- React 19 (with Vite)
- React Router v7
- Axios
- Plain CSS (custom styling, bento-grid layout on dashboard)

**Backend**
- Node.js with Express 5
- SQLite3 (file-based, no external DB server required)
- JSON Web Tokens (JWT) for authentication
- bcryptjs
- dotenv
- nodemon (dev)

---

## Features Implemented

- **JWT Authentication** — Login with a hardcoded test user; token stored in `localStorage` and sent on every API request via an Axios interceptor.
- **Protected Routes** — All pages except `/login` are behind a `ProtectedRoute` component that checks for a valid token.
- **Dashboard** — Bento-grid layout showing total leads, leads by status (New / Qualified / Won / Lost), total estimated deal value, and total won deal value.
- **Lead List** — Paginated table of all leads with filter controls for status, lead source, assigned salesperson, and a free-text search across name, company, and email.
- **Lead CRUD** — Create, read, update, and delete leads. Required fields: lead name, company name, email.
- **Lead Detail View** — Full profile of a single lead including all field values, timestamps, and a notes section.
- **Notes** — Add internal notes to any lead; notes are stored with the author name and timestamp.
- **Lead Statuses** — New, Contacted, Qualified, Proposal Sent, Won, Lost.
- **Lead Sources** — Website, LinkedIn, Referral, Cold Email, Event, Other.

---

## How to Run Locally

### Prerequisites
- Node.js (v18 or higher recommended)
- npm

### 1. Clone / extract the project

```bash
unzip CRM_project.zip
cd CRM_project
```

### 2. Set up the backend

```bash
cd backend
npm install
```

Create a `.env` file in the `backend/` directory (see [Environment Variables](#environment-variables) below), then start the server:

```bash
node server.js
# or, for auto-reload during development:
npx nodemon server.js
```

The backend will run on **http://localhost:5000**.

The SQLite database file (`crm.db`) will be created automatically inside `backend/database/` on first run — no manual setup needed.

### 3. Set up the frontend

Open a new terminal tab:

```bash
cd frontend
npm install
npm run dev
```

The frontend will run on **http://localhost:5173** (default Vite port).

---

## Environment Variables

Create a file at `backend/.env` with the following:

```env
JWT_SECRET=crm_secret_key_123
```

| Variable     | Description                                      | Default (from repo) |
|--------------|--------------------------------------------------|---------------------|
| `JWT_SECRET` | Secret key used to sign and verify JWT tokens    | `crm_secret_key_123` |

> **Note:** The `.env` file is already present in the repo for convenience. In a real deployment, this should be removed from version control and replaced with a strong, randomly generated secret.

---

## Test Login Credentials

Authentication uses a single hardcoded user defined in `backend/routes/authRoutes.js`.

| Field    | Value               |
|----------|---------------------|
| Email    | `admin@example.com` |
| Password | `password123`       |

---

## Database Setup

No manual database setup is required. On first run, `initDatabase()` in `backend/db.js` automatically creates the SQLite file at `backend/database/crm.db` and runs `CREATE TABLE IF NOT EXISTS` for the two tables:

**`leads`**

| Column                  | Type    | Notes                          |
|-------------------------|---------|--------------------------------|
| `id`                    | INTEGER | Primary key, autoincrement     |
| `lead_name`             | TEXT    | Required                       |
| `company_name`          | TEXT    | Required                       |
| `email`                 | TEXT    | Required                       |
| `phone`                 | TEXT    |                                |
| `lead_source`           | TEXT    |                                |
| `assigned_salesperson`  | TEXT    |                                |
| `status`                | TEXT    | Default: `New`                 |
| `estimated_deal_value`  | REAL    | Default: `0`                   |
| `created_at`            | TEXT    | Default: `CURRENT_TIMESTAMP`   |
| `updated_at`            | TEXT    | Default: `CURRENT_TIMESTAMP`   |

**`notes`**

| Column          | Type    | Notes                                        |
|-----------------|---------|----------------------------------------------|
| `id`            | INTEGER | Primary key, autoincrement                   |
| `lead_id`       | INTEGER | Foreign key → `leads.id` (CASCADE DELETE)    |
| `note_content`  | TEXT    | Required                                     |
| `created_by`    | TEXT    | Default: `Admin User`                        |
| `created_at`    | TEXT    | Default: `CURRENT_TIMESTAMP`                 |

To reset the database, simply delete `backend/database/crm.db` and restart the server.

---

## Known Limitations

- **Single hardcoded user** — Authentication does not use a `users` table. There is no registration, password reset, or multi-user support. The credentials are stored in plain text in the source code.
- **No real password hashing** — `bcryptjs` is installed as a dependency but is not used. The login check is a plain string comparison.
- **No pagination** — The lead list fetches all records in a single query with no limit, which will degrade with large datasets.
- **CORS is fully open** — The backend uses `cors()` with no origin restrictions, which is not safe for production.
- **Frontend API base URL is hardcoded** — `api.js` points to `http://localhost:5000/api`. This needs to be changed or environment-variable-driven before deploying anywhere.
- **Salesperson list is static** — The dropdown in the lead form has three hardcoded options and is not driven by any data source.
- **No tests** — There are no unit, integration, or end-to-end tests.
- **`updated_at` is not auto-updated by SQLite triggers** — It is updated manually in the `PUT` route but would drift if records are ever modified by direct SQL.
- **Currency is hardcoded to Rs.** — Deal values are displayed with a Sri Lankan Rupee prefix and are not configurable.

---

## Reflection

This project covers the core CRUD cycle of a CRM and demonstrates a clean separation between a React SPA and a REST API backend. The use of SQLite keeps local setup completely friction-free — there's no database server to install or configure.

A few things I'd approach differently in a production context: authentication would be backed by a proper `users` table with hashed passwords (the bcryptjs dependency is already there, just not wired up), CORS would be locked to specific origins, and the frontend's API base URL would be pulled from an environment variable at build time using Vite's `import.meta.env`. Adding a state management layer (Zustand or React Query) would also reduce the amount of repetitive `useState`/`useEffect` data-fetching boilerplate scattered across the page components.
