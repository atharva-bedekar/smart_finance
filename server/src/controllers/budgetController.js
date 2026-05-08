// server/src/controllers/budgetController.js
const prisma = require("../models/prisma");

function parseMonthYear(monthStr) {
  const [year, month] = monthStr.split("-").map(Number);
  return { month, year };
}

// GET /api/budgets?month=YYYY-MM
exports.getAll = async (req, res, next) => {
  try {
    const { month } = req.query;
    const where = { userId: req.user.id };
    if (month) {
      const { month: m, year: y } = parseMonthYear(month);
      where.month = m;
      where.year = y;
    }
    const budgets = await prisma.budget.findMany({ where, orderBy: { category: "asc" } });
    res.json(budgets);
  } catch (err) { next(err); }
};

// POST /api/budgets  (upsert)
exports.upsert = async (req, res, next) => {
  try {
    const { category, amount, month } = req.body;
    const { month: m, year: y } = parseMonthYear(month);
    const budget = await prisma.budget.upsert({
      where:  { userId_category_month_year: { userId: req.user.id, category, month: m, year: y } },
      update: { limit: parseFloat(amount) },
      create: { userId: req.user.id, category, limit: parseFloat(amount), month: m, year: y },
    });
    res.status(201).json(budget);
  } catch (err) { next(err); }
};

// DELETE /api/budgets/:id
exports.remove = async (req, res, next) => {
  try {
    await prisma.budget.deleteMany({ where: { id: req.params.id, userId: req.user.id } });
    res.json({ message: "Deleted" });
  } catch (err) { next(err); }
};
