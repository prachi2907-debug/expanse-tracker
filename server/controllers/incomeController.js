const Income = require("../models/Income");

// Add income
exports.addIncome = async (req, res) => {
  try {
    const { amount, source, date, notes } = req.body;

    const newIncome = new Income({
      amount,
      source,
      date,
      notes,
      userId: req.userId, // ✅ use userId from middleware
    });

    await newIncome.save();
    res.status(201).json(newIncome);
  } catch (err) {
    res.status(500).json({ error: "Failed to add income" });
  }
};

// Get all incomes for logged-in user
exports.getAllIncomes = async (req, res) => {
  try {
    const incomes = await Income.find({ userId: req.userId }).sort({ date: -1 }); // ✅ filter by user
    res.status(200).json(incomes);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch incomes" });
  }
};

// Update income (only if owned by the logged-in user)
exports.updateIncome = async (req, res) => {
  try {
    const { amount, source, date, notes } = req.body;

    const updatedIncome = await Income.findOneAndUpdate(
      { _id: req.params.id, userId: req.userId }, // ✅ ensure ownership
      { amount, source, date, notes },
      { new: true }
    );

    if (!updatedIncome) {
      return res.status(404).json({ error: "Income not found or unauthorized" });
    }

    res.status(200).json(updatedIncome);
  } catch (err) {
    res.status(500).json({ error: "Failed to update income" });
  }
};

// Delete income (only if owned by the logged-in user)
exports.deleteIncome = async (req, res) => {
  try {
    const deletedIncome = await Income.findOneAndDelete({
      _id: req.params.id,
      userId: req.userId, // ✅ ensure ownership
    });

    if (!deletedIncome) {
      return res.status(404).json({ error: "Income not found or unauthorized" });
    }

    res.status(200).json({ message: "Income deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: "Failed to delete income" });
  }
};
