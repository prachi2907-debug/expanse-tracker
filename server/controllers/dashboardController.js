const Income = require("../models/Income");
const Expense = require("../models/Expense");

// 📊 Monthly Income vs Expense trend
exports.getMonthlyData = async (req, res) => {
  try {
    const incomes = await Income.find({ userId: req.userId });   // ✅ user-specific
    const expenses = await Expense.find({ userId: req.userId }); // ✅ user-specific

    // group by month (Jan, Feb...)
    const months = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
    const dataMap = {};

    incomes.forEach((inc) => {
      const m = months[new Date(inc.date).getMonth()];
      dataMap[m] = dataMap[m] || { month: m, income: 0, expense: 0 };
      dataMap[m].income += inc.amount;
    });

    expenses.forEach((exp) => {
      const m = months[new Date(exp.date).getMonth()];
      dataMap[m] = dataMap[m] || { month: m, income: 0, expense: 0 };
      dataMap[m].expense += exp.amount;
    });

    const result = months.map((m) => dataMap[m] || { month: m, income: 0, expense: 0 });
    res.json(result);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch monthly data" });
  }
};

// 🥧 Expense by category
exports.getCategoryData = async (req, res) => {
  try {
    const expenses = await Expense.find({ userId: req.userId }); // ✅ user-specific
    const categoryMap = {};

    expenses.forEach((exp) => {
      categoryMap[exp.category] = (categoryMap[exp.category] || 0) + exp.amount;
    });

    const colors = [
      "#ef4444","#3b82f6","#10b981","#f59e0b","#8b5cf6","#ec4899","#14b8a6",
    ];

    const result = Object.keys(categoryMap).map((cat, idx) => ({
      name: cat,
      value: categoryMap[cat],
      color: colors[idx % colors.length],
    }));

    res.json(result);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch category data" });
  }
};

// 📊 Weekly Spending
exports.getWeeklyData = async (req, res) => {
  try {
    const expenses = await Expense.find({ userId: req.userId }); // ✅ user-specific
    const days = ["Sun","Mon","Tue","Wed","Thu","Fri","Sat"];
    const weekMap = {};

    expenses.forEach((exp) => {
      const d = days[new Date(exp.date).getDay()];
      weekMap[d] = (weekMap[d] || 0) + exp.amount;
    });

    const result = days.map((d) => ({ day: d, amount: weekMap[d] || 0 }));
    res.json(result);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch weekly spending" });
  }
};

// 📜 Recent History (last 24h)
exports.getRecentHistory = async (req, res) => {
  try {
    const now = new Date();
    const yesterday = new Date(now.getTime() - 24 * 60 * 60 * 1000);

    // Get expenses from last 24h (user-specific)
    const expenses = await Expense.find({ 
      userId: req.userId,
      date: { $gte: yesterday } 
    }).lean();

    // Get incomes from last 24h (user-specific)
    const incomes = await Income.find({ 
      userId: req.userId,
      date: { $gte: yesterday } 
    }).lean();

    // Tag type for frontend display
    const formattedExpenses = expenses.map((e) => ({ ...e, type: "expense" }));
    const formattedIncomes = incomes.map((i) => ({ ...i, type: "income" }));

    // Combine and sort by date descending
    const recentHistory = [...formattedExpenses, ...formattedIncomes].sort(
      (a, b) => new Date(b.date) - new Date(a.date)
    );

    res.json(recentHistory);
  } catch (error) {
    console.error("Error fetching recent history:", error);
    res.status(500).json({ message: "Failed to fetch recent history" });
  }
};
