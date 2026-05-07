// server/src/index.js
require("dotenv").config({ path: "../.env" });
const express = require("express");
const cors    = require("cors");
const morgan  = require("morgan");

const authRoutes        = require("./routes/auth");
const transactionRoutes = require("./routes/transactions");
const budgetRoutes      = require("./routes/budgets");
const aiRoutes          = require("./routes/ai");

const app  = express();
const PORT = process.env.PORT || 5000;

// ── Middleware ──────────────────────────────────────────────
app.use(cors({ origin: "http://localhost:3000", credentials: true }));
app.use(express.json());
app.use(morgan("dev"));

// ── Routes ──────────────────────────────────────────────────
app.use("/api/auth",         authRoutes);
app.use("/api/transactions", transactionRoutes);
app.use("/api/budgets",      budgetRoutes);
app.use("/api/ai",           aiRoutes);

// ── Health check ────────────────────────────────────────────
app.get("/api/health", (_, res) => res.json({ status: "ok" }));

// ── Global error handler ────────────────────────────────────
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(err.status || 500).json({ error: err.message || "Internal Server Error" });
});

app.listen(PORT, () => console.log(`🚀 Server running on http://localhost:${PORT}`));
