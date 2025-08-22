// server/routes/incomeRoutes.js
const express = require("express");
const router = express.Router();
const {
  addIncome,
  getAllIncomes,
  updateIncome,
  deleteIncome,
  getTotalIncome,
} = require("../controllers/incomeController");

const requireAuth = require("../middleware/auth"); // ✅ import middleware

// ✅ Protect all income routes
router.post("/", requireAuth, addIncome);
router.get("/", requireAuth, getAllIncomes);
router.put("/:id", requireAuth, updateIncome);
router.delete("/:id", requireAuth, deleteIncome);

module.exports = router;
