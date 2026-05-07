// server/src/controllers/authController.js
const bcrypt = require("bcryptjs");
const jwt    = require("jsonwebtoken");
const prisma = require("../models/prisma");

const signToken = (user) =>
  jwt.sign(
    { id: user.id, email: user.email, name: user.name, currency: user.currency },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN || "7d" }
  );

// POST /api/auth/register
exports.register = async (req, res, next) => {
  try {
    const { name, email, password, currency = "₹" } = req.body;

    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) return res.status(409).json({ error: "Email already registered" });

    const hashed = await bcrypt.hash(password, 12);
    const user   = await prisma.user.create({
      data: { name, email, password: hashed, currency },
      select: { id: true, name: true, email: true, currency: true, createdAt: true },
    });

    res.status(201).json({ token: signToken(user), user });
  } catch (err) { next(err); }
};

// POST /api/auth/login
exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user || !(await bcrypt.compare(password, user.password)))
      return res.status(401).json({ error: "Invalid email or password" });

    const { password: _, ...safeUser } = user;
    res.json({ token: signToken(safeUser), user: safeUser });
  } catch (err) { next(err); }
};

// GET /api/auth/me
exports.me = async (req, res, next) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.user.id },
      select: { id: true, name: true, email: true, currency: true, createdAt: true },
    });
    res.json(user);
  } catch (err) { next(err); }
};

// PATCH /api/auth/profile
exports.updateProfile = async (req, res, next) => {
  try {
    const { name, currency } = req.body;
    const user = await prisma.user.update({
      where: { id: req.user.id },
      data:  { name, currency },
      select: { id: true, name: true, email: true, currency: true },
    });
    res.json({ token: signToken(user), user });
  } catch (err) { next(err); }
};
