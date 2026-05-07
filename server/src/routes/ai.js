// server/src/routes/ai.js
const router = require("express").Router();
const auth   = require("../middleware/auth");
const ctrl   = require("../controllers/aiController");

router.use(auth);

// POST /api/ai/savings | anomaly | score | forecast
router.post("/:type", ctrl.analyze);

module.exports = router;
