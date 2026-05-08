// server/src/controllers/transactionController.js
const prisma = require("../models/prisma");

// GET /api/transactions
exports.getAll = async (req, res, next) => {
  try {
    const { type, category, month, page = 1, limit = 50 } = req.query;

    const where = { userId: req.user.id };
    if (type)     where.type     = type;
    if (category) where.category = category;
    if (month) {
      const [y, m] = month.split("-").map(Number);
      where.date = {
        gte: new Date(y, m - 1, 1),
        lt:  new Date(y, m,     1),
      };
    }

    const [total, transactions] = await prisma.$transaction([
      prisma.transaction.count({ where }),
      prisma.transaction.findMany({
        where,
        orderBy: { date: "desc" },
        skip:  (Number(page) - 1) * Number(limit),
        take:  Number(limit),
      }),
    ]);

    res.json({ transactions, total, page: Number(page), limit: Number(limit) });
  } catch (err) { next(err); }
};

// POST /api/transactions
exports.create = async (req, res, next) => {
  try {
    const { type, category, amount, note, date } = req.body;
    const tx = await prisma.transaction.create({
      data: { userId: req.user.id, type, category, amount: parseFloat(amount), description: note, date: new Date(date) },
    });
    res.status(201).json(tx);
  } catch (err) { next(err); }
};

// PUT /api/transactions/:id
exports.update = async (req, res, next) => {
  try {
    const { type, category, amount, note, date } = req.body;
    const tx = await prisma.transaction.updateMany({
      where: { id: req.params.id, userId: req.user.id },
      data:  { type, category, amount: parseFloat(amount), description: note, date: new Date(date) },
    });
    if (tx.count === 0) return res.status(404).json({ error: "Transaction not found" });
    const updated = await prisma.transaction.findUnique({ where: { id: req.params.id } });
    res.json(updated);
  } catch (err) { next(err); }
};

// DELETE /api/transactions/:id
exports.remove = async (req, res, next) => {
  try {
    const tx = await prisma.transaction.deleteMany({
      where: { id: req.params.id, userId: req.user.id },
    });
    if (tx.count === 0) return res.status(404).json({ error: "Transaction not found" });
    res.json({ message: "Deleted successfully" });
  } catch (err) { next(err); }
};

// GET /api/transactions/summary  (dashboard charts)
exports.summary = async (req, res, next) => {
  try {
    const { months = 5 } = req.query;
    const now     = new Date();
    const results = [];

    for (let i = Number(months) - 1; i >= 0; i--) {
      const d     = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const key   = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
      const start = new Date(d.getFullYear(), d.getMonth(), 1);
      const end   = new Date(d.getFullYear(), d.getMonth() + 1, 1);

      const txns = await prisma.transaction.findMany({
        where: { userId: req.user.id, date: { gte: start, lt: end } },
        select: { type: true, category: true, amount: true },
      });

      const income   = txns.filter(t => t.type === "income").reduce((s, t) => s + t.amount, 0);
      const expenses = txns.filter(t => t.type === "expense").reduce((s, t) => s + t.amount, 0);
      const catBreak = {};
      txns.filter(t => t.type === "expense").forEach(t => {
        catBreak[t.category] = (catBreak[t.category] || 0) + t.amount;
      });

      results.push({ month: key, income, expenses, savings: income - expenses, categories: catBreak });
    }

    res.json(results);
  } catch (err) { next(err); }
};
