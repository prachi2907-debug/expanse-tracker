const express = require("express");
const router = express.Router();

const {
  getFutureExpenses,
  addFutureExpense
} = require("../controllers/futureExpenseController");

// Later you can add auth middleware like this:
// const { requireAuth } = require("../middleware/auth");

// Routes
// router.get("/", requireAuth, getFutureExpenses);
// router.post("/", requireAuth, addFutureExpense);

// For now (no auth middleware)
router.get("/", getFutureExpenses);
router.post("/", addFutureExpense);

module.exports = router;

