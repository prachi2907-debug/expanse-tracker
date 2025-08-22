const FutureExpense = require("../models/FutureExpense");

// @desc Get all future expenses for the logged-in user
const getFutureExpenses = async (req, res) => {
  try {
    // ✅ Only fetch expenses belonging to this user
    const expenses = await FutureExpense.find({ userId: req.userId });
    res.json(expenses);
  } catch (err) {
    console.error("Error fetching expenses:", err);
    res.status(500).json({ message: "Server Error" });
  }
};

// @desc Add a new future expense
const addFutureExpense = async (req, res) => {
  try {
    const { amount, category, date } = req.body;

    // Validate fields
    if (!amount || !category || !date) {
      return res.status(400).json({ message: "All fields are required" });
    }

    // ✅ Use req.user.id from middleware
    const newExpense = new FutureExpense({
      amount,
      category,
      date,
      userId: req.userId,
    });

    await newExpense.save();
    res.status(201).json(newExpense);
  } catch (err) {
    console.error("Error while saving:", err);
    res.status(500).json({ message: "Error saving future expense", error: err.message });
  }
};

// @desc Update a future expense (only if it belongs to this user)
const updateFutureExpense = async (req, res) => {
  try {
    const { id } = req.params;
    const { amount, category, date } = req.body;

    const updatedExpense = await FutureExpense.findOneAndUpdate(
      { _id: id, userId: req.userId }, // ✅ ensure ownership
      { amount, category, date },
      { new: true, runValidators: true }
    );

    if (!updatedExpense) {
      return res.status(404).json({ message: "Expense not found or not authorized" });
    }

    res.json(updatedExpense);
  } catch (err) {
    console.error("Error updating expense:", err);
    res.status(500).json({ message: "Error updating future expense", error: err.message });
  }
};

// @desc Delete a future expense (only if it belongs to this user)
const deleteFutureExpense = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedExpense = await FutureExpense.findOneAndDelete({
      _id: id,
      userId: req.userId, // ✅ ensure ownership
    });

    if (!deletedExpense) {
      return res.status(404).json({ message: "Expense not found or not authorized" });
    }

    res.json({ message: "Expense deleted successfully", id });
  } catch (err) {
    console.error("Error deleting expense:", err);
    res.status(500).json({ message: "Error deleting future expense", error: err.message });
  }
};

module.exports = {
  getFutureExpenses,
  addFutureExpense,
  updateFutureExpense,
  deleteFutureExpense,
};
