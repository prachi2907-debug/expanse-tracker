import React, { useEffect, useState } from "react";
import axios from "axios";

// ✅ Create axios instance with token support
const API = axios.create({ baseURL: "/api" });
API.interceptors.request.use((req) => {
  const token = localStorage.getItem("token");
  if (token) {
    req.headers.Authorization = `Bearer ${token}`;
  }
  return req;
});

const TopStats = () => {
  const [totalIncome, setTotalIncome] = useState(0);
  const [totalExpense, setTotalExpense] = useState(0);
  const [totalBalance, setTotalBalance] = useState(0);

  const fetchTotals = async () => {
    try {
      // Fetch incomes and expenses (✅ with token automatically attached)
      const [incomeRes, expenseRes] = await Promise.all([
        API.get("/incomes"),
        API.get("/expenses"),
      ]);

      // Calculate total income
      const incomeTotal = incomeRes.data.reduce(
        (acc, curr) => acc + parseFloat(curr.amount || 0),
        0
      );

      // Calculate total expense
      const expenseTotal = expenseRes.data.reduce(
        (acc, curr) => acc + parseFloat(curr.amount || 0),
        0
      );

      setTotalIncome(incomeTotal);
      setTotalExpense(expenseTotal);
      setTotalBalance(incomeTotal - expenseTotal);
    } catch (error) {
      console.error("Error fetching totals:", error);
    }
  };

  useEffect(() => {
    fetchTotals();
  }, []);

  return (
    <div className="flex justify-center gap-6">
      {/* Total Balance Card */}
      <div className="bg-white p-4 w-52 rounded-xl shadow-md flex items-center gap-4">
        <div className="bg-purple-100 p-3 rounded-full text-purple-600 text-lg">
          💳
        </div>
        <div>
          <p className="text-sm text-gray-500">Total Balance</p>
          <p className="text-md font-semibold text-black">
            ₹{totalBalance.toLocaleString("en-IN")}
          </p>
        </div>
      </div>

      {/* Total Income Card */}
      <div className="bg-white p-4 w-52 rounded-xl shadow-md flex items-center gap-4">
        <div className="bg-orange-100 p-3 rounded-full text-orange-600 text-lg">
          🟧
        </div>
        <div>
          <p className="text-sm text-gray-500">Total Income</p>
          <p className="text-md font-semibold text-black">
            ₹{totalIncome.toLocaleString("en-IN")}
          </p>
        </div>
      </div>

      {/* Total Expenses Card */}
      <div className="bg-white p-4 w-52 rounded-xl shadow-md flex items-center gap-4">
        <div className="bg-red-100 p-3 rounded-full text-red-600 text-lg">
          🟥
        </div>
        <div>
          <p className="text-sm text-gray-500">Total Expense</p>
          <p className="text-md font-semibold text-black">
            ₹{totalExpense.toLocaleString("en-IN")}
          </p>
        </div>
      </div>
    </div>
  );
};

export default TopStats;
