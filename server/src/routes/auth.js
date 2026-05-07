// server/src/routes/auth.js
const router     = require("express").Router();
const { body }   = require("express-validator");
const authMidd   = require("../middleware/auth");
const ctrl       = require("../controllers/authController");

const validateRegister = [
  body("name").trim().notEmpty().withMessage("Name required"),
  body("email").isEmail().normalizeEmail(),
  body("password").isLength({ min: 6 }).withMessage("Password min 6 chars"),
];

router.post("/register", validateRegister, ctrl.register);
router.post("/login",    ctrl.login);
router.get ("/me",       authMidd, ctrl.me);
router.patch("/profile", authMidd, ctrl.updateProfile);

module.exports = router;
