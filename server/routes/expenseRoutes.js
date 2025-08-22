// server/routes/expenseRoutes.js
const express = require("express");
const router = express.Router();
const {
  addExpense,
  getAllExpenses,
  updateExpense,
  deleteExpense,
} = require("../controllers/expenseController");

const authMiddleware = require("../middleware/auth"); // ✅ import

// Protect all routes with auth
router.post("/", authMiddleware, addExpense);
router.get("/", authMiddleware, getAllExpenses);
router.put("/:id", authMiddleware, updateExpense);
router.delete("/:id", authMiddleware, deleteExpense);

module.exports = router;
