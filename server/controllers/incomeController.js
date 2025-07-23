// server/controllers/incomeController.js
const Income = require("../models/Income");

// Add income
exports.addIncome = async (req, res) => {
  try {
    const { amount, source, date, notes, userId } = req.body;
    const newIncome = new Income({ amount, source, date, notes, userId });
    await newIncome.save();
    res.status(201).json(newIncome);
  } catch (err) {
    res.status(500).json({ error: "Failed to add income" });
  }
};

// Get all incomes
exports.getAllIncomes = async (req, res) => {
  try {
    const incomes = await Income.find().sort({ date: -1 });
    res.status(200).json(incomes);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch incomes" });
  }
};

// Update income
exports.updateIncome = async (req, res) => {
  try {
    const { amount, source, date, notes } = req.body;
    const updatedIncome = await Income.findByIdAndUpdate(
      req.params.id,
      { amount, source, date, notes },
      { new: true }
    );
    if (!updatedIncome) {
      return res.status(404).json({ error: "Income not found" });
    }
    res.status(200).json(updatedIncome);
  } catch (err) {
    res.status(500).json({ error: "Failed to update income" });
  }
};

// Delete income
exports.deleteIncome = async (req, res) => {
  try {
    const deletedIncome = await Income.findByIdAndDelete(req.params.id);
    if (!deletedIncome) {
      return res.status(404).json({ error: "Income not found" });
    }
    res.status(200).json({ message: "Income deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: "Failed to delete income" });
  }
};
// Get total income for a user
