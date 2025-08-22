const express = require("express");
const {
  getMonthlyData,
  getCategoryData,
  getWeeklyData,
  getRecentHistory,
} = require("../controllers/dashboardController");

const requireAuth = require("../middleware/auth"); 

const router = express.Router();

// ✅ Protect all dashboard routes with middleware
router.get("/monthly", requireAuth, getMonthlyData);
router.get("/categories", requireAuth, getCategoryData);
router.get("/weekly", requireAuth, getWeeklyData);
router.get("/recent-history", requireAuth, getRecentHistory);

module.exports = router;
