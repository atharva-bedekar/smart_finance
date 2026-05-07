// server/src/controllers/aiController.js

const Groq   = require("groq-sdk");
const prisma = require("../models/prisma");

const client = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

async function buildContext(userId) {
  const now   = new Date();
  const start = new Date(now.getFullYear(), now.getMonth(), 1);
  const end   = new Date(now.getFullYear(), now.getMonth() + 1, 1);

  const [txns, budgets] = await Promise.all([
    prisma.transaction.findMany({
      where: {
        userId,
        date: { gte: start, lt: end },
      },
    }),

    prisma.budget.findMany({
      where: {
        userId,
        month: `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`,
      },
    }),
  ]);

  const income = txns
    .filter(t => t.type === "income")
    .reduce((s, t) => s + t.amount, 0);

  const expenses = txns
    .filter(t => t.type === "expense")
    .reduce((s, t) => s + t.amount, 0);

  const catSpend = {};

  txns
    .filter(t => t.type === "expense")
    .forEach(t => {
      catSpend[t.category] =
        (catSpend[t.category] || 0) + t.amount;
    });

  return {
    income,
    expenses,
    net: income - expenses,
    categorySpending: catSpend,
    budgets,
  };
}

const PROMPTS = {
  savings: (ctx) =>
    `You are a financial advisor.
     Based on this month's data:
     ${JSON.stringify(ctx)}

     Give 3-4 specific actionable savings suggestions.
     Use concise bullet points.`,

  anomaly: (ctx) =>
    `Analyze this financial data:
     ${JSON.stringify(ctx)}

     Detect unusual spending patterns or anomalies.
     Compare categories against budgets.
     Be specific with numbers.
     Format as a short report.`,

  score: (ctx) =>
    `Calculate a financial health score (0-100) based on:
     ${JSON.stringify(ctx)}

     Format:
     Score: XX/100

     Then explain strengths and weaknesses.`,

  forecast: (ctx) =>
    `Based on:
     ${JSON.stringify(ctx)}

     Forecast whether the user will end the month
     in surplus or deficit.

     Give specific recommendations.
     Keep response under 150 words.`,
};

// POST /api/ai/:type
// types = savings | anomaly | score | forecast

exports.analyze = async (req, res, next) => {
  try {
    const { type } = req.params;

    if (!PROMPTS[type]) {
      return res
        .status(400)
        .json({ error: "Invalid analysis type" });
    }

    const ctx = await buildContext(req.user.id);

    const prompt = PROMPTS[type](ctx);

    const completion =
      await client.chat.completions.create({
        model: "llama-3.3-70b-versatile",

        messages: [
          {
            role: "user",
            content: prompt,
          },
        ],

        temperature: 0.7,
        max_tokens: 800,
      });

    res.json({
      result: completion.choices[0].message.content,
      context: ctx,
    });

  } catch (err) {
    next(err);
  }
};