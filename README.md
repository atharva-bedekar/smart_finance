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
├── client/                  # React frontend (port 5173)
│   └── src/
│       ├── components/      # Layout, Card, Spinner
│       ├── pages/           # Dashboard, Transactions, Budget, AI
│       ├── charts/          # IncomeExpenseBar, CategoryPie, SavingsTrend
│       ├── context/         # AuthContext (JWT)
│       ├── api.js           # Axios instance
│       └── App.js           # Routes
├── server/                  # Express API (port 5000)
│   ├── prisma/
│   │   └── schema.prisma    # Prisma schema (User, Transaction, Budget)
│   └── src/
│       ├── routes/          # auth, transactions, budgets, ai
│       ├── controllers/     # authController, transactionController, budgetController, aiController
│       ├── models/          # prisma.js (Prisma client singleton)
│       └── middleware/      # auth.js (JWT guard)
└── docker-compose.yml
```

---

## Quick Start (Docker)

### 1. Clone the repo

```bash
git clone <repo>
cd smart_finance
```

### 2. Configure environment

Create a `.env` file in the project root:

```env
DATABASE_URL=postgresql://...
DIRECT_URL=postgresql://...
JWT_SECRET=your_jwt_secret
GROQ_API_KEY=your_groq_api_key
```

### 3. Run with Docker Compose

```bash
docker compose up --build
```

- Frontend: http://localhost:5173
- Backend API: http://localhost:5000

---

## Running Without Docker

### Install dependencies

```bash
# From project root
cd server && npm install
cd ../client && npm install
```

### Run database migrations

```bash
cd server
npx prisma migrate dev --name init
npx prisma generate
```

### Start dev servers

```bash
# Terminal 1 – server
cd server && npm run dev

# Terminal 2 – client
cd client && npm start
```

---

## API Endpoints

All endpoints except `/api/auth/register` and `/api/auth/login` require an `Authorization: Bearer <token>` header.

### Auth

| Method | Endpoint            | Description          |
| ------ | ------------------- | -------------------- |
| POST   | /api/auth/register  | Create account       |
| POST   | /api/auth/login     | Sign in → JWT        |
| GET    | /api/auth/me        | Get current user     |
| PATCH  | /api/auth/profile   | Update name/currency |

### Transactions

| Method | Endpoint                   | Description                        |
| ------ | -------------------------- | ---------------------------------- |
| GET    | /api/transactions          | List (filter by type/month/page)   |
| POST   | /api/transactions          | Create transaction                 |
| PUT    | /api/transactions/:id      | Update transaction                 |
| DELETE | /api/transactions/:id      | Delete transaction                 |
| GET    | /api/transactions/summary  | Chart data (last N months)         |

### Budgets

| Method | Endpoint          | Description               |
| ------ | ----------------- | ------------------------- |
| GET    | /api/budgets      | Get budgets by month      |
| POST   | /api/budgets      | Create or update a budget |
| DELETE | /api/budgets/:id  | Delete budget             |

### AI Insights

| Method | Endpoint          | Description            |
| ------ | ----------------- | ---------------------- |
| POST   | /api/ai/savings   | Savings suggestions    |
| POST   | /api/ai/anomaly   | Anomaly detection      |
| POST   | /api/ai/score     | Financial health score |
| POST   | /api/ai/forecast  | Month-end forecast     |

---

## Database Schema

### Budget

| Field     | Type     | Notes                            |
| --------- | -------- | -------------------------------- |
| id        | String   | UUID                             |
| userId    | String   | FK → User                        |
| category  | String   |                                  |
| limit     | Float    | Budget limit amount              |
| month     | Int      | 1–12                             |
| year      | Int      | e.g. 2026                        |
| createdAt | DateTime |                                  |

Unique constraint: `(userId, category, month, year)`

### Transaction

| Field       | Type     | Notes             |
| ----------- | -------- | ----------------- |
| id          | String   | UUID              |
| userId      | String   | FK → User         |
| type        | String   | `income`/`expense`|
| amount      | Float    |                   |
| category    | String   |                   |
| description | String?  | Optional note     |
| date        | DateTime |                   |
| createdAt   | DateTime |                   |
