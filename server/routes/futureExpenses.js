const express = require("express");
const router = express.Router();

const {
  getFutureExpenses,
  addFutureExpense,
  updateFutureExpense,
  deleteFutureExpense,
} = require("../controllers/futureExpenseController");


 const  requireAuth  = require("../middleware/auth");

// Routes
 router.get("/", requireAuth, getFutureExpenses);
  router.post("/", requireAuth, addFutureExpense);
 router.put("/:id", requireAuth, updateFutureExpense);
 router.delete("/:id", requireAuth, deleteFutureExpense);

// For now (no auth middleware)
// router.get("/", getFutureExpenses);
// router.post("/", addFutureExpense);
// router.put("/:id", updateFutureExpense);
// router.delete("/:id", deleteFutureExpense);

module.exports = router;
