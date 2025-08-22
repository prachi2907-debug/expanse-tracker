// server/controllers/expenseController.js
const Expense = require("../models/Expense");

// Add expense
exports.addExpense = async (req, res) => {
  try {
    const { amount, category, date, notes } = req.body;

    const newExpense = new Expense({
      amount,
      category,
      date,
      notes,
      userId: req.userId, // ✅ take from middleware, not req.body
    });

    await newExpense.save();
    res.status(201).json(newExpense);
  } catch (err) {
    res.status(500).json({ error: "Failed to add expense" });
  }
};

// Get all expenses for logged-in user
exports.getAllExpenses = async (req, res) => {
  try {
    const expenses = await Expense.find({ userId: req.userId }) // ✅ user filter
      .sort({ date: -1 });

    res.status(200).json(expenses);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch expenses" });
  }
};

// Update expense (only if belongs to logged-in user)
exports.updateExpense = async (req, res) => {
  try {
    const { amount, category, date, notes } = req.body;

    const updatedExpense = await Expense.findOneAndUpdate(
      { _id: req.params.id, userId: req.userId }, // ✅ ownership check
      { amount, category, date, notes },
      { new: true }
    );

    if (!updatedExpense) {
      return res.status(404).json({ error: "Expense not found" });
    }

    res.status(200).json(updatedExpense);
  } catch (err) {
    res.status(500).json({ error: "Failed to update expense" });
  }
};

// Delete expense (only if belongs to logged-in user)
exports.deleteExpense = async (req, res) => {
  try {
    const deletedExpense = await Expense.findOneAndDelete({
      _id: req.params.id,
      userId: req.userId, // ✅ ownership check
    });

    if (!deletedExpense) {
      return res.status(404).json({ error: "Expense not found" });
    }

    res.status(200).json({ message: "Expense deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: "Failed to delete expense" });
  }
};
