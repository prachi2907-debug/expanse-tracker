const mongoose = require("mongoose");
const FutureExpense = require("../models/FutureExpense");

// @desc Get all future expenses (optionally by user later)
const getFutureExpenses = async (req, res) => {
  try {
    const expenses = await FutureExpense.find();
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
    console.log("Received Data:", req.body);

    // Validate fields
    if (!amount || !category || !date) {
      return res.status(400).json({ message: "All fields are required" });
    }

    // ✅ TEMP: hardcode ObjectId for testing (replace with req.user.id if using auth)
    const staticUserId = new mongoose.Types.ObjectId("64b2d3f34abcf2d5cc27c90a");

    const newExpense = new FutureExpense({
      amount,
      category,
      date,
      userId: staticUserId // Replace with req.user.id when JWT auth is added
    });

    await newExpense.save();
    res.status(201).json(newExpense);
  } catch (err) {
    console.error("Error while saving:", err);
    res.status(500).json({ message: "Error saving future expense", error: err.message });
  }
};

module.exports = {
  getFutureExpenses,
  addFutureExpense
};
