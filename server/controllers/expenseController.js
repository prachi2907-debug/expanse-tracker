const Expense = require("../models/Expense");

// Add expense
exports.addExpense = async (req, res) => {
  try {
    const { amount, category, date, notes, userId } = req.body;
    const newExpense = new Expense({ amount, category, date, notes, userId });
    await newExpense.save();
    res.status(201).json(newExpense);
  } catch (err) {
    res.status(500).json({ error: "Failed to add expense" });
  }
};

// Get all expenses
exports.getAllExpenses = async (req, res) => {
  try {
    const expenses = await Expense.find().sort({ date: -1 });
    res.status(200).json(expenses);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch expenses" });
  }
};

// Update expense
exports.updateExpense = async (req, res) => {
  try {
    const { amount, category, date, notes } = req.body;
    const updatedExpense = await Expense.findByIdAndUpdate(
      req.params.id,
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

// Delete expense
exports.deleteExpense = async (req, res) => {
  try {
    const deletedExpense = await Expense.findByIdAndDelete(req.params.id);
    if (!deletedExpense) {
      return res.status(404).json({ error: "Expense not found" });
    }
    res.status(200).json({ message: "Expense deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: "Failed to delete expense" });
  }
};