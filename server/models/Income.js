const mongoose = require("mongoose");

const incomeSchema = new mongoose.Schema({
  amount: Number,
  source: String,
  date: Date,
  notes: String,
  userId: String, // optional if using auth
});

module.exports = mongoose.model("Income", incomeSchema);