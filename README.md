# FinSmart – Smart Financial Dashboard

Full-stack personal finance app with AI-powered insights, budget tracking, and spending analytics.

## Tech Stack

| Layer    | Technology                        |
| -------- | --------------------------------- |
| Frontend | React 18 + React Router v6        |
| Charts   | Recharts                          |
| Backend  | Node.js + Express                 |
| Database | PostgreSQL (Supabase) + Prisma v6 |
| Auth     | JWT + bcryptjs                    |
| AI Layer | Groq (llama-3.3-70b-versatile)    |
| Runtime  | Docker + Docker Compose           |

---

## Folder Structure

```
smart_finance/
├── client/                  # React frontend
│   └── src/
│       ├── components/      # Layout, Card, Spinner
│       ├── pages/           # Dashboard, Transactions, Budget, AI
│       ├── charts/          # IncomeExpenseBar, CategoryPie, SavingsTrend
│       ├── context/         # AuthContext (JWT)
│       ├── api.js           # Axios instance
│       └── App.js           # Routes
├── server/                  # Express API
│   ├── prisma/
│   │   ├── schema.prisma    # Prisma schema (User, Transaction, Budget)
│   │   ├── seed.js          # Seed script (default user)
│   │   └── migrations/      # SQL migration history
│   └── src/
│       ├── routes/          # auth, transactions, budgets, ai
│       ├── controllers/     # Business logic
│       ├── models/          # Prisma client singleton
│       └── middleware/      # JWT auth guard
├── .env                     # Root env (used by Docker Compose)
└── docker-compose.yml
```

---

## Prerequisites

- [Node.js 18+](https://nodejs.org/) (for running without Docker)
- [Docker Desktop](https://www.docker.com/products/docker-desktop/) (for running with Docker)
- A [Supabase](https://supabase.com) project (free tier works)
- A [Groq](https://console.groq.com) API key (free tier works)

---

## Environment Setup

### 1. Get your Supabase connection strings

1. Open your Supabase project → **Settings → Database → Connection string**
2. Copy the **Transaction pooler** URI (port `6543`) — this is `DATABASE_URL`
3. Copy the **Session pooler** URI (port `5432`) — this is `DIRECT_URL`

> If your project shows **"Paused"**, click **Restore project** and wait ~1 minute before continuing.

### 2. Get your Groq API key

1. Go to [console.groq.com](https://console.groq.com) → **API Keys → Create new key**

### 3. Create the `.env` file

Copy the example file and fill in your values:

```bash
cp .env.example .env
```

Or create `.env` manually in the project root (next to `docker-compose.yml`):

```env
PORT=5000
NODE_ENV=development

# Supabase — connection pooling (runtime)
DATABASE_URL=postgresql://postgres.YOUR_REF:YOUR_PASSWORD@aws-1-ap-northeast-1.pooler.supabase.com:6543/postgres?pgbouncer=true

# Supabase — direct connection (migrations)
DIRECT_URL=postgresql://postgres.YOUR_REF:YOUR_PASSWORD@aws-1-ap-northeast-1.pooler.supabase.com:5432/postgres

# JWT
JWT_SECRET=your_long_random_secret_string
JWT_EXPIRES_IN=7d

# AI
GROQ_API_KEY=your_groq_api_key
```

> Copy `.env` into `server/.env` as well — both files must have the same values.

---

## Running with Docker

> **Note:** Docker Desktop reserves ports 5000 and 5001 on Windows. The server is mapped to host port **4000**.

### Start

```bash
docker compose up --build
```

| Service  | URL                        |
| -------- | -------------------------- |
| Frontend | http://localhost:5173      |
| Backend  | http://localhost:4000      |

### Stop

```bash
docker compose down
```

### Rebuild after code changes

```bash
docker compose up --build
```

### Common issues

| Error | Fix |
| ----- | --- |
| `port is already allocated` | Another process owns that port. Check with `netstat -ano \| findstr ":4000"` and kill it, or change the port in `docker-compose.yml` |
| `tenant/user not found` (Supabase) | Your Supabase project is paused — restore it from the dashboard |
| `prisma migrate deploy` fails | Verify `DATABASE_URL` and `DIRECT_URL` in `.env` are correct |

---

## Running Without Docker

> Useful for active development — both servers hot-reload on file save.

### Step 1 — Install dependencies

Open two terminals.

**Terminal 1 (server):**
```bash
cd server
npm install
```

**Terminal 2 (client):**
```bash
cd client
npm install
```

### Step 2 — Run database migrations

```bash
cd server
npx prisma migrate deploy
npx prisma generate
```

> Run this once on first setup, and again any time `schema.prisma` changes.

### Step 3 — Seed the database (first time only)

```bash
cd server
node prisma/seed.js
```

This creates the default test user.

### Step 4 — Start the servers

**Terminal 1 (server)** — auto-restarts on file save:
```bash
cd server
npm run dev
```

**Terminal 2 (client)** — hot-reloads on file save:
```bash
cd client
npm start
```

| Service  | URL                    |
| -------- | ---------------------- |
| Frontend | http://localhost:3000  |
| Backend  | http://localhost:4000  |

> The client proxies all `/api` calls to the backend automatically via `setupProxy.js`.

### Port conflict on Windows

Docker Desktop occupies port 5000 on Windows even when no containers are running. The server uses port **4000** by default. If you still get `EADDRINUSE`, check what's on the port:

```bash
netstat -ano | findstr ":4000"
```

Change `PORT=4000` in `.env` to any free port if needed.

---

## Default Login Credentials

| Email               | Password  |
| ------------------- | --------- |
| `user@company.com`  | `Pass@1234` |
| `vivek@comp.com`    | `vivek`   |
| `vivel@comp.com`    | `vivek`   |

---

## API Reference

All endpoints except `/api/auth/register` and `/api/auth/login` require:
```
Authorization: Bearer <token>
```

### Auth

| Method | Endpoint             | Description          |
| ------ | -------------------- | -------------------- |
| POST   | /api/auth/register   | Create account       |
| POST   | /api/auth/login      | Sign in → JWT        |
| GET    | /api/auth/me         | Get current user     |
| PATCH  | /api/auth/profile    | Update name/currency |

### Transactions

| Method | Endpoint                  | Description                       |
| ------ | ------------------------- | --------------------------------- |
| GET    | /api/transactions         | List (filter: type, month, page)  |
| POST   | /api/transactions         | Create transaction                |
| PUT    | /api/transactions/:id     | Update transaction                |
| DELETE | /api/transactions/:id     | Delete transaction                |
| GET    | /api/transactions/summary | Chart data (last N months)        |

**Transaction body:**
```json
{
  "type": "expense",
  "category": "Food",
  "amount": 500,
  "note": "Lunch",
  "date": "2026-06-05"
}
```

### Budgets

| Method | Endpoint         | Description               |
| ------ | ---------------- | ------------------------- |
| GET    | /api/budgets     | Get budgets (filter: month) |
| POST   | /api/budgets     | Create or update a budget |
| DELETE | /api/budgets/:id | Delete budget             |

**Budget body:**
```json
{
  "category": "Food",
  "amount": 6000,
  "month": "2026-06"
}
```

### AI Insights

| Method | Endpoint        | Description            |
| ------ | --------------- | ---------------------- |
| POST   | /api/ai/savings  | Savings suggestions   |
| POST   | /api/ai/anomaly  | Anomaly detection     |
| POST   | /api/ai/score    | Financial health score|
| POST   | /api/ai/forecast | Month-end forecast    |

---

## Database Schema

### User

| Field     | Type     | Notes        |
| --------- | -------- | ------------ |
| id        | String   | UUID         |
| email     | String   | Unique       |
| password  | String   | bcrypt hash  |
| name      | String   |              |
| currency  | String   | Default `₹`  |
| createdAt | DateTime |              |
| updatedAt | DateTime |              |

### Transaction

| Field       | Type     | Notes              |
| ----------- | -------- | ------------------ |
| id          | String   | UUID               |
| userId      | String   | FK → User          |
| type        | String   | `income`/`expense` |
| amount      | Float    |                    |
| category    | String   | e.g. `Food`, `Rent`|
| description | String?  | Optional note      |
| date        | DateTime |                    |
| createdAt   | DateTime |                    |

### Budget

| Field     | Type     | Notes                         |
| --------- | -------- | ----------------------------- |
| id        | String   | UUID                          |
| userId    | String   | FK → User                     |
| category  | String   |                               |
| limit     | Float    | Budget limit for the month    |
| month     | Int      | 1–12                          |
| year      | Int      | e.g. 2026                     |
| createdAt | DateTime |                               |

Unique constraint: `(userId, category, month, year)`

---

## Transaction Categories

| Type    | Categories                                              |
| ------- | ------------------------------------------------------- |
| Expense | Food, Rent, Travel, Shopping, Health, Entertainment, Utilities |
| Income  | Salary, Freelance, Investment, Other                    |
