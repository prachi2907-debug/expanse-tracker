const mongoose = require("mongoose");

const incomeSchema = new mongoose.Schema({
  amount: Number,
  source: String,
  date: Date,
  notes: String,
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },
});

module.exports = mongoose.model("Income", incomeSchema);