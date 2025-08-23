import React, { useState, useEffect } from "react";
import axios from "axios";
import Sidebar from "../components/Sidebar";
import TopStats from "../components/TopStats";
import FutureExpenseBox from "../components/FutureExpenseBox";
import {
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  Tooltip,
  CartesianGrid,
  XAxis,
  YAxis,
  ResponsiveContainer,
} from "recharts";
import { TrendingUp, TrendingDown } from "lucide-react";

// ✅ Create axios instance that includes token
const API = axios.create({ baseURL: "https://pocketplan-hbsw.onrender.com/api" });
API.interceptors.request.use((req) => {
  const token = localStorage.getItem("token");
  if (token) {
    req.headers.Authorization = `Bearer ${token}`;
  }
  return req;
});

// Utility function
const formatCurrency = (value) => `₹${Number(value).toLocaleString("en-IN")}`;

const HomePage = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [monthlyData, setMonthlyData] = useState([]);
  const [categoryData, setCategoryData] = useState([]);
  const [weeklySpending, setWeeklySpending] = useState([]);
  const [recentHistory, setRecentHistory] = useState([]);

  const fetchDashboardData = async () => {
    try {
      const [monthlyRes, categoryRes, weeklyRes, recentRes] = await Promise.all([
        API.get("/dashboard/monthly"),   // ✅ use API instead of axios
        API.get("/dashboard/categories"),
        API.get("/dashboard/weekly"),
        API.get("/dashboard/recent-history"),
      ]);

      setMonthlyData(monthlyRes.data || []);
      setCategoryData(categoryRes.data || []);
      setWeeklySpending(weeklyRes.data || []);
      setRecentHistory(recentRes.data || []);
    } catch (error) {
      console.error("Error fetching dashboard data:", error);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  // ---- UI-only helpers ----
  const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  const months = [
    "Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"
  ];
  const todayKey = days[new Date().getDay()];
  const currentMonthKey = months[new Date().getMonth()];

  // Recent Expenses & Incomes
  const todayExpense = weeklySpending.find((d) => d?.day === todayKey)?.amount || 0;
  const thisMonthIncome = monthlyData.find((m) => m?.month === currentMonthKey)?.income || 0;

  return (
    <div className="flex h-screen bg-gray-50 text-gray-900">
      {/* Sidebar */}
      <Sidebar
        isOpen={sidebarOpen}
        toggleSidebar={() => setSidebarOpen(!sidebarOpen)}
      />

      {/* Main Content */}
      <div className="flex-1 flex flex-col p-4 overflow-auto">
        {/* Top Section */}
        <div className="flex justify-between items-start mb-6">
          <div className="flex-1 flex justify-center">
            {/* Top Stats */}
            <div className="bg-white p-4 rounded-xl shadow-md">
             <TopStats />
            </div>
          </div>

          {/* FutureExpenseBox TOP RIGHT */}
          <div className="w-64 ml-4">
            <FutureExpenseBox />
          </div>
        </div>

        {/* Charts Section */}
        <div className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Income vs Expense Trend */}
            <div className="bg-white rounded-2xl shadow-md p-4 hover:scale-[1.01] transition-transform">
              <div className="flex items-center gap-2 mb-2 font-semibold">
                <TrendingUp className="w-5 h-5 text-green-600" />
                <span>Income vs Expense Trend</span>
              </div>
              <ResponsiveContainer width="100%" height={250}>
                <LineChart data={monthlyData}>
                  <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                  <XAxis dataKey="month" />
                  <YAxis
                    tickFormatter={(value) => `₹${(value / 1000).toFixed(0)}k`}
                  />
                  <Tooltip
                    formatter={(value) => [formatCurrency(value), ""]}
                    labelStyle={{ color: "#111" }}
                  />
                  <Line
                    type="monotone"
                    dataKey="income"
                    stroke="#10b981"
                    strokeWidth={3}
                    dot={{ r: 4 }}
                    name="Income"
                  />
                  <Line
                    type="monotone"
                    dataKey="expense"
                    stroke="#ef4444"
                    strokeWidth={3}
                    dot={{ r: 4 }}
                    name="Expense"
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>

            {/* Expense by Category */}
            <div className="bg-white rounded-2xl shadow-md p-4 hover:scale-[1.01] transition-transform">
              <div className="flex items-center gap-2 mb-2 font-semibold">
                <TrendingDown className="w-5 h-5 text-red-500" />
                <span>Expense by Category</span>
              </div>
              <ResponsiveContainer width="100%" height={250}>
                <PieChart>
                  <Pie
                    data={Array.isArray(categoryData) ? categoryData : []}
                    cx="50%"
                    cy="50%"
                    innerRadius={40}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {(Array.isArray(categoryData) ? categoryData : []).map(
                      (entry, index) => (
                        <Cell key={index} fill={entry.color} />
                      )
                    )}
                  </Pie>
                  <Tooltip formatter={(value) => formatCurrency(value)} />
                </PieChart>
              </ResponsiveContainer>
              <div className="grid grid-cols-2 gap-1 mt-2">
                {(Array.isArray(categoryData) ? categoryData : []).map(
                  (category, index) => (
                    <div key={index} className="flex items-center gap-2">
                      <div
                        className="w-2 h-2 rounded-full"
                        style={{ backgroundColor: category.color }}
                      />
                      <span className="text-xs text-gray-600 truncate">
                        {category.name}
                      </span>
                    </div>
                  )
                )}
              </div>
            </div>
          </div>

          {/* Recent Expenses & Incomes (24h) */}
          <div className="bg-white rounded-2xl shadow-md p-4 hover:scale-[1.01] transition-transform">
            <div className="flex items-center gap-2 mb-2 font-semibold">
              <span>Recent History (24h)</span>
            </div>

            {recentHistory.length === 0 ? (
              <p className="text-gray-500">No recent records found.</p>
            ) : (
              <table className="w-full table-auto text-sm border-collapse">
                <thead>
                  <tr className="bg-gray-100 text-black font-semibold">
                    <th className="p-2 border-b">Type</th>
                    <th className="p-2 border-b">Amount (₹)</th>
                    <th className="p-2 border-b">Source / Category</th>
                  </tr>
                </thead>
                <tbody>
                  {recentHistory.map((item, idx) => (
                    <tr key={idx} className="hover:bg-gray-50 text-black">
                      <td className={`p-2 border-b font-medium ${item.type === 'income' ? 'text-green-600' : 'text-red-600'}`}>
                        {item.type.toUpperCase()}
                      </td>
                      <td className="p-2 border-b">₹{item.amount}</td>
                      <td className="p-2 border-b">{item.source || item.category || "-"}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
          {/* End Recent */}
        </div>
      </div>
    </div>
  );
};

export default HomePage;
