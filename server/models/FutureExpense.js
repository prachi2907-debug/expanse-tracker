const mongoose = require("mongoose");

const FutureExpenseSchema = new mongoose.Schema({
  amount: {
    type: Number,
    required: true,
  },
  category: {
    type: String,
    required: true,
  },
  date: {
    type: Date,
    required: true,
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",         // 👈 assumes you have a User model
    required: true       // make this false if you're still testing without auth
  },
});

module.exports = mongoose.model("FutureExpense", FutureExpenseSchema);
