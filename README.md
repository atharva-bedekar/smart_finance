# 💰 FinSmart – Smart Financial Dashboard

Full-stack personal finance app with AI insights.

## Tech Stack

| Layer    | Technology              |
| -------- | ----------------------- |
| Frontend | React 18 + React Router |
| Charts   | Recharts                |
| Backend  | Node.js + Express       |
| Database | PostgreSQL + Prisma ORM |
| Auth     | JWT + bcryptjs          |
| AI Layer | Anthropic Claude API    |

---

## Folder Structure

```
smart-finance/
├── client/                  # React frontend
│   └── src/
│       ├── components/      # Layout, Card, Spinner
│       ├── pages/           # Dashboard, Transactions, Budget, AI
│       ├── charts/          # IncomeExpenseBar, CategoryPie, SavingsTrend
│       ├── context/         # AuthContext (JWT)
│       ├── api.js           # Axios instance
│       └── App.js           # Routes
├── server/
│   └── src/
│       ├── routes/          # auth, transactions, budgets, ai
│       ├── controllers/     # authController, transactionController, ...
│       ├── models/          # prisma.js (Prisma client singleton)
│       └── middleware/      # auth.js (JWT guard)
└── database/
    ├── schema.sql           # Raw PostgreSQL DDL
    └── schema.prisma        # Prisma schema
```

---

## Quick Start

### 1. Clone & install

```bash
git clone <repo>
cd smart-finance
npm run install:all
```

### 2. Configure environment

```bash
cp .env.example .env
# Fill in: DATABASE_URL, JWT_SECRET, ANTHROPIC_API_KEY
```

### 3. Set up PostgreSQL

```bash
# Create database
createdb smart_finance

# Option A – raw SQL
psql smart_finance < database/schema.sql

# Option B – Prisma migrations (from server/)
cd server
cp ../database/schema.prisma prisma/schema.prisma
npx prisma migrate dev --name init
npx prisma generate
```

### 4. Run development servers

```bash
# From root — starts both client (3000) and server (5000)
npm run dev
```

Open http://localhost:3000

---

## API Endpoints

### Auth

| Method | Endpoint           | Description          |
| ------ | ------------------ | -------------------- |
| POST   | /api/auth/register | Create account       |
| POST   | /api/auth/login    | Sign in → JWT        |
| GET    | /api/auth/me       | Get current user     |
| PATCH  | /api/auth/profile  | Update name/currency |

### Transactions

| Method | Endpoint                  | Description                 |
| ------ | ------------------------- | --------------------------- |
| GET    | /api/transactions         | List (filter by type/month) |
| POST   | /api/transactions         | Create transaction          |
| PUT    | /api/transactions/:id     | Update                      |
| DELETE | /api/transactions/:id     | Delete                      |
| GET    | /api/transactions/summary | Chart data (last N months)  |

### Budgets

| Method | Endpoint         | Description          |
| ------ | ---------------- | -------------------- |
| GET    | /api/budgets     | Get budgets by month |
| POST   | /api/budgets     | Upsert budget        |
| DELETE | /api/budgets/:id | Delete budget        |

### AI

| Method | Endpoint         | Description            |
| ------ | ---------------- | ---------------------- |
| POST   | /api/ai/savings  | Savings suggestions    |
| POST   | /api/ai/anomaly  | Anomaly detection      |
| POST   | /api/ai/score    | Financial health score |
| POST   | /api/ai/forecast | Month-end forecast     |

---

## Deployment

**Frontend → Vercel**

```bash
cd client && npm run build
# Deploy /build to Vercel
```

**Backend → Railway**

```bash
# Set env vars in Railway dashboard
# Connect PostgreSQL plugin
# Deploy server/ directory
```
