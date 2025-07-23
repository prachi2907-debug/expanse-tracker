const mongoose = require("mongoose");

const expenseSchema = new mongoose.Schema({
  amount: Number,
  category: String,
  date: Date,
  notes: String,
  userId: String, // For user-specific data if needed
});

module.exports = mongoose.model("Expense", expenseSchema);