const mongoose = require("mongoose");

const expenseSchema = new mongoose.Schema({
  amount: Number,
  category: String,
  date: Date,
  notes: String,
   userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },
});

module.exports = mongoose.model("Expense", expenseSchema);