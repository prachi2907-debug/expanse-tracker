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

router.post("/", addIncome);
router.get("/", getAllIncomes);
router.put("/:id", updateIncome);
router.delete("/:id", deleteIncome);

module.exports = router;