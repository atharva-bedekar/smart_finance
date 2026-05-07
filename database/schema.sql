-- ============================================================
--  smart_finance  ·  PostgreSQL Schema
-- ============================================================

CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ── Users ──────────────────────────────────────────────────
CREATE TABLE users (
  id          UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  name        VARCHAR(100) NOT NULL,
  email       VARCHAR(150) NOT NULL UNIQUE,
  password    TEXT        NOT NULL,
  currency    VARCHAR(5)  NOT NULL DEFAULT '₹',
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ── Categories ─────────────────────────────────────────────
CREATE TABLE categories (
  id    SERIAL      PRIMARY KEY,
  name  VARCHAR(50) NOT NULL UNIQUE,
  icon  VARCHAR(10),
  type  VARCHAR(10) CHECK (type IN ('income', 'expense', 'both')) DEFAULT 'both'
);

INSERT INTO categories (name, icon, type) VALUES
  ('Salary',        '💼', 'income'),
  ('Freelance',     '💻', 'income'),
  ('Investment',    '📈', 'income'),
  ('Food',          '🍜', 'expense'),
  ('Rent',          '🏠', 'expense'),
  ('Travel',        '✈️',  'expense'),
  ('Shopping',      '🛍️',  'expense'),
  ('Health',        '💊', 'expense'),
  ('Entertainment', '🎬', 'expense'),
  ('Utilities',     '⚡', 'expense'),
  ('Other',         '📦', 'both');

-- ── Transactions ───────────────────────────────────────────
CREATE TABLE transactions (
  id          UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id     UUID        NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  type        VARCHAR(10) NOT NULL CHECK (type IN ('income', 'expense')),
  category    VARCHAR(50) NOT NULL,
  amount      NUMERIC(12,2) NOT NULL CHECK (amount > 0),
  note        TEXT,
  date        DATE        NOT NULL DEFAULT CURRENT_DATE,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_transactions_user_id ON transactions(user_id);
CREATE INDEX idx_transactions_date    ON transactions(date DESC);
CREATE INDEX idx_transactions_type    ON transactions(type);

-- ── Budgets ────────────────────────────────────────────────
CREATE TABLE budgets (
  id          UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id     UUID        NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  category    VARCHAR(50) NOT NULL,
  amount      NUMERIC(12,2) NOT NULL CHECK (amount > 0),
  month       VARCHAR(7)  NOT NULL,           -- e.g. "2025-05"
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE (user_id, category, month)
);

CREATE INDEX idx_budgets_user_month ON budgets(user_id, month);

-- ── Auto-update updated_at ─────────────────────────────────
CREATE OR REPLACE FUNCTION set_updated_at()
RETURNS TRIGGER AS $$
BEGIN NEW.updated_at = NOW(); RETURN NEW; END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_users_updated        BEFORE UPDATE ON users        FOR EACH ROW EXECUTE FUNCTION set_updated_at();
CREATE TRIGGER trg_transactions_updated BEFORE UPDATE ON transactions FOR EACH ROW EXECUTE FUNCTION set_updated_at();
CREATE TRIGGER trg_budgets_updated      BEFORE UPDATE ON budgets      FOR EACH ROW EXECUTE FUNCTION set_updated_at();
