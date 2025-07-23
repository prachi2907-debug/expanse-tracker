require('dotenv').config(); 
const express = require('express');
const mongoose = require('mongoose');
const authRoutes = require("./routes/authRoutes");
const futureExpenseRoutes = require('./routes/futureExpenses');
const incomeRoutes = require("./routes/incomeRoutes");
const expenseRoutes = require("./routes/expenseRoutes");


const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3000;
const MONGO_URL = process.env.MONGO_URL;
app.use(cors());
app.use(express.json());

mongoose.connect(MONGO_URL).then(() => {
  console.log("MongoDB connected");

  // Routes (register after DB is connected)
  app.use("/api/auth", authRoutes);
 app.use("/api/future-expenses", futureExpenseRoutes);
 app.use("/api/incomes", incomeRoutes);
 app.use("/api/expenses", expenseRoutes);

  app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}).catch(err => {
  console.error('Error while connecting to Mongo:', err);
});

