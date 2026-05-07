// server/src/routes/budgets.js
const router = require("express").Router();
const auth   = require("../middleware/auth");
const ctrl   = require("../controllers/budgetController");

router.use(auth);

router.get   ("/",    ctrl.getAll);
router.post  ("/",    ctrl.upsert);
router.delete("/:id", ctrl.remove);

module.exports = router;
