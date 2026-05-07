// server/src/routes/transactions.js
const router = require("express").Router();
const auth   = require("../middleware/auth");
const ctrl   = require("../controllers/transactionController");

router.use(auth);

router.get   ("/summary", ctrl.summary);
router.get   ("/",        ctrl.getAll);
router.post  ("/",        ctrl.create);
router.put   ("/:id",     ctrl.update);
router.delete("/:id",     ctrl.remove);

module.exports = router;
