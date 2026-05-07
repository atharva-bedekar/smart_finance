// server/src/controllers/budgetController.js
const prisma = require("../models/prisma");

// GET /api/budgets?month=YYYY-MM
exports.getAll = async (req, res, next) => {
  try {
    const { month } = req.query;
    const where = { userId: req.user.id };
    if (month) where.month = month;
    const budgets = await prisma.budget.findMany({ where, orderBy: { category: "asc" } });
    res.json(budgets);
  } catch (err) { next(err); }
};

// POST /api/budgets  (upsert)
exports.upsert = async (req, res, next) => {
  try {
    const { category, amount, month } = req.body;
    const budget = await prisma.budget.upsert({
      where:  { userId_category_month: { userId: req.user.id, category, month } },
      update: { amount: parseFloat(amount) },
      create: { userId: req.user.id, category, amount: parseFloat(amount), month },
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
