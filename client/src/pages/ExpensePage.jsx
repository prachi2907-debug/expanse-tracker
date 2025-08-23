import React, { useState, useEffect } from "react";
import axios from "axios";
import Sidebar from "../components/Sidebar";
import { Bar, Pie } from "react-chartjs-2";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import {
  Chart as ChartJS,
  BarElement,
  ArcElement,
  CategoryScale,
  LinearScale,
  PointElement,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(
  BarElement,
  ArcElement,
  CategoryScale,
  LinearScale,
  PointElement,
  Tooltip,
  Legend
);

const ExpensePage = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [amount, setAmount] = useState("");
  const [category, setCategory] = useState("");
  const [date, setDate] = useState("");
  const [notes, setNotes] = useState("");
  const [message, setMessage] = useState("");
  const [expenses, setExpenses] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editingExpenseId, setEditingExpenseId] = useState(null);
  const [filter, setFilter] = useState("24hrs");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  const fetchExpenses = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get("https://pocketplan-hbsw.onrender.com/api/expenses",{
      headers: { Authorization: `Bearer ${token}` },
    });
      setExpenses(res.data.reverse());
    } catch (error) {
      console.error("Error fetching expenses:", error);
    }
  };

  useEffect(() => {
    fetchExpenses();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");
      if (editingExpenseId) {
       await axios.put(`https://pocketplan-hbsw.onrender.com/api/expenses/${editingExpenseId}`, {
          amount,
          category,
          date,
          notes},
        { headers: { Authorization: `Bearer ${token}` } }
      );
        setMessage("✅ Expense updated successfully!");
      } else {
        await axios.post("https://pocketplan-hbsw.onrender.com/api/expenses",  {amount, category, date, notes} , { headers: { Authorization: `Bearer ${token}` } });
        setMessage("✅ Expense added successfully!");
      }
      setAmount("");
      setCategory("");
      setDate("");
      setNotes("");
      setEditingExpenseId(null);
      setShowForm(false);
      fetchExpenses();
    } catch (error) {
      console.error("Error saving expense:", error);
      setMessage("❌ Failed to save expense.");
    }
  };

  const handleEdit = (expense) => {
    setAmount(expense.amount);
    setCategory(expense.category);
    setDate(expense.date.slice(0, 10));
    setNotes(expense.notes || "");
    setEditingExpenseId(expense._id);
    setShowForm(true);
    setMessage("");
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this expense?")) {
      try {
        const token = localStorage.getItem("token");
        await axios.delete(`https://pocketplan-hbsw.onrender.com/api/expenses/${id}`,{
        headers: { Authorization: `Bearer ${token}` }});
        fetchExpenses();
        setMessage("🗑 Expense deleted successfully!");
      } catch (error) {
        console.error("Error deleting expense:", error);
        setMessage("❌ Failed to delete expense.");
      }
    }
  };

  const handleAddButton = () => {
    setShowForm(!showForm);
    setEditingExpenseId(null);
    setAmount("");
    setCategory("");
    setDate("");
    setNotes("");
    setMessage("");
  };

  const formatDate = (dateStr) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  const filterExpensesByDate = () => {
    const now = new Date();
    return expenses.filter((expense) => {
      const expenseDate = new Date(expense.date);
      const timeDiff = now - expenseDate;

      if (startDate && endDate) {
        const start = new Date(startDate);
        const end = new Date(endDate);
        return expenseDate >= start && expenseDate <= end;
      }

      switch (filter) {
        case "24hrs":
          return timeDiff <= 24 * 60 * 60 * 1000;
        case "weekly":
          return timeDiff <= 7 * 24 * 60 * 60 * 1000;
        case "monthly":
          return (
            expenseDate.getMonth() === now.getMonth() &&
            expenseDate.getFullYear() === now.getFullYear()
          );
        case "quarterly":
          const currentQuarter = Math.floor(now.getMonth() / 3);
          const expenseQuarter = Math.floor(expenseDate.getMonth() / 3);
          return (
            expenseQuarter === currentQuarter &&
            expenseDate.getFullYear() === now.getFullYear()
          );
        case "yearly":
          return expenseDate.getFullYear() === now.getFullYear();
        default:
          return true;
      }
    });
  };

  const filteredExpenses = filterExpensesByDate();

  const totalExpense = expenses.reduce(
    (acc, curr) => acc + parseFloat(curr.amount || 0),
    0
  );

  const categoryMap = {};
  filteredExpenses.forEach(({ category, amount }) => {
    categoryMap[category] = (categoryMap[category] || 0) + Number(amount);
  });
  const categories = Object.keys(categoryMap);
  const categoryAmounts = Object.values(categoryMap);
  const colors = [
    "#F44336",
    "#9C27B0",
    "#FF9800",
    "#03A9F4",
    "#4CAF50",
    "#E91E63",
    "#795548",
  ];

  const barData = {
    labels: categories,
    datasets: [
      {
        label: "Expense by Category",
        data: categoryAmounts,
        backgroundColor: colors,
      },
    ],
  };

  const pieData = {
    labels: categories,
    datasets: [
      {
        label: "Expense Distribution",
        data: categoryAmounts,
        backgroundColor: colors,
      },
    ],
  };

  const exportToCSV = () => {
    if (filteredExpenses.length === 0) {
      alert("No data to export.");
      return;
    }

    const headers = ["Amount", "Category", "Date", "Notes"];
    const rows = filteredExpenses.map(({ amount, category, date, notes }) => [
      amount.toString(),
      category,
      formatDate(date),
      notes || "",
    ]);

    const totalFilteredExpense = filteredExpenses.reduce(
      (acc, curr) => acc + parseFloat(curr.amount || 0),
      0
    );

    let csvRows = [];

    csvRows.push(["Expense Data"]);
    csvRows.push(headers);
    csvRows = csvRows.concat(rows);

    csvRows.push([]);
    csvRows.push(["----------------------------"]);
    csvRows.push([]);

    csvRows.push(["Summary"]);
    csvRows.push(["Description", "Amount"]);
    csvRows.push(["Total Expense (Filtered)", totalFilteredExpense.toFixed(2)]);
    csvRows.push(["Total Expense (All)", totalExpense.toFixed(2)]);

    const csvContent =
      "data:text/csv;charset=utf-8," +
      csvRows.map((e) => e.join(",")).join("\n");

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    const nowStr = new Date().toISOString().slice(0, 10);
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `expense_data_${nowStr}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const exportToPDF = () => {
    if (filteredExpenses.length === 0) {
      alert("No data to export.");
      return;
    }

    const doc = new jsPDF();

    const tableColumn = ["Amount", "Category", "Date", "Notes"];
    const tableRows = [];

    filteredExpenses.forEach(({ amount, category, date, notes }) => {
      tableRows.push([amount.toString(), category, formatDate(date), notes || ""]);
    });

    doc.text("Expense Data", 14, 15);
    autoTable(doc, {
      head: [tableColumn],
      body: tableRows,
      startY: 20,
    });

    const finalY = doc.lastAutoTable.finalY || 20;

    const totalFilteredExpense = filteredExpenses.reduce(
      (acc, curr) => acc + parseFloat(curr.amount || 0),
      0
    );

    doc.setFontSize(12);
    doc.text(`Total Expense (Filtered): ₹${totalFilteredExpense.toFixed(2)}`, 14, finalY + 10);
    doc.text(`Total Expense (All): ₹${totalExpense.toFixed(2)}`, 14, finalY + 18);

    const nowStr = new Date().toISOString().slice(0, 10);
    doc.save(`expense_data_${nowStr}.pdf`);
  };

  return (
    <div className="flex h-screen bg-gray-100">
      <Sidebar
        isOpen={sidebarOpen}
        toggleSidebar={() => setSidebarOpen(!sidebarOpen)}
      />
      <div className="flex-1 flex flex-col p-6 overflow-y-auto space-y-8">
        <div className="flex justify-between items-start">
          <div className="bg-white p-4 w-52 rounded-xl shadow-md flex items-center gap-4">
            <div className="bg-red-100 p-3 rounded-full text-red-600 text-lg">
              💸
            </div>
            <div>
              <p className="text-sm text-gray-600 font-semibold">Total Expense</p>
              <p className="text-lg font-bold text-gray-800">₹{totalExpense}</p>
            </div>
          </div>
          <button
            onClick={handleAddButton}
            className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
          >
            {showForm ? "Cancel" : "➕ Add Expense"}
          </button>
        </div>

        {/* Filter Controls */}
        <div className="flex flex-wrap gap-4 items-center">
          <div>
            <label className="text-black font-semibold mr-2">Sort by:</label>
            <select
              value={filter}
              onChange={(e) => {
                setFilter(e.target.value);
                setStartDate("");
                setEndDate("");
              }}
              className="border p-2 rounded text-black"
            >
              <option value="all">All</option>
              <option value="24hrs">Past 24 Hours</option>
              <option value="weekly">This Week</option>
              <option value="monthly">This Month</option>
              <option value="quarterly">This Quarter</option>
              <option value="yearly">This Year</option>
            </select>
          </div>
          <div className="flex items-center gap-2">
            <input
              type="date"
              value={startDate}
              onChange={(e) => {
                setStartDate(e.target.value);
                setFilter("custom");
              }}
              className="border p-2 rounded text-black"
            />
            <span className="text-black">to</span>
            <input
              type="date"
              value={endDate}
              onChange={(e) => {
                setEndDate(e.target.value);
                setFilter("custom");
              }}
              className="border p-2 rounded text-black"
            />
          </div>
        </div>

        {/* Form */}
        {showForm && (
          <form
            onSubmit={handleSubmit}
            className="bg-white p-6 rounded-xl shadow space-y-4 max-w-2xl"
          >
            <div>
              <label className="block font-semibold text-black">Amount (₹)</label>
              <input
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="w-full border p-2 rounded text-black"
                required
              />
            </div>
            <div>
              <label className="block font-semibold text-black">Category</label>
              <input
                type="text"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full border p-2 rounded text-black"
                required
              />
            </div>
            <div>
              <label className="block font-semibold text-black">Date</label>
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full border p-2 rounded text-black"
                required
              />
            </div>
            <div>
              <label className="block font-semibold text-black">Notes</label>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                className="w-full border p-2 rounded text-black"
                rows={3}
              ></textarea>
            </div>
            <button
              type="submit"
              className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
            >
              {editingExpenseId ? "Update Expense" : "Save Expense"}
            </button>
          </form>
        )}

        {!showForm && message && (
          <p className="text-blue-600 font-medium">{message}</p>
        )}

        {/* Table */}
        {!showForm && (
          <div className="bg-white p-6 rounded-xl shadow">
            <h2 className="text-xl font-bold text-black mb-4">Recent Expenses</h2>

            <div className="mb-4 flex gap-4">
              <button
                onClick={exportToCSV}
                className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
              >
                Download CSV
              </button>
              <button
                onClick={exportToPDF}
                className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
              >
                Download PDF
              </button>
            </div>

            {filteredExpenses.length === 0 ? (
              <p className="text-gray-500">No expenses found for selected filter.</p>
            ) : (
              <table className="w-full table-auto text-sm border-collapse">
                <thead>
                  <tr className="bg-gray-100 text-black font-semibold">
                    <th className="p-2 border-b">Amount (₹)</th>
                    <th className="p-2 border-b">Category</th>
                    <th className="p-2 border-b">Date</th>
                    <th className="p-2 border-b">Notes</th>
                    <th className="p-2 border-b">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredExpenses.map((expense) => (
                    <tr key={expense._id} className="hover:bg-gray-50 text-black">
                      <td className="p-2 border-b">₹{expense.amount}</td>
                      <td className="p-2 border-b">{expense.category}</td>
                      <td className="p-2 border-b">{formatDate(expense.date)}</td>
                      <td className="p-2 border-b">{expense.notes || "-"}</td>
                      <td className="p-2 border-b">
                        <button
                          className="text-blue-600 hover:underline mr-2"
                          onClick={() => handleEdit(expense)}
                        >
                          Edit
                        </button>
                        <button
                          className="text-red-600 hover:underline"
                          onClick={() => handleDelete(expense._id)}
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        )}

        {/* Charts */}
        <div className="space-y-8">
          <div className="bg-white p-6 rounded-xl shadow w-full max-w-xl mx-auto">
            <h2 className="text-xl font-bold text-black mb-4">
              📊 Expense by Category (Bar Chart)
            </h2>
            <Bar data={barData} options={{ plugins: { legend: { display: false } } }} />
            <div className="mt-4 text-sm text-gray-700 space-y-1">
              {categories.map((cat, idx) => (
                <div key={idx}>
                  <span
                    className="inline-block w-3 h-3 rounded-full mr-2"
                    style={{ backgroundColor: colors[idx % colors.length] }}
                  ></span>
                  {cat}: ₹{categoryAmounts[idx]}
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl shadow w-full max-w-xl mx-auto">
            <h2 className="text-xl font-bold text-black mb-4">
              🥧 Expense Distribution (Pie Chart)
            </h2>
            <Pie data={pieData} options={{ plugins: { legend: { display: false } } }} />
            <div className="mt-4 text-sm text-gray-700 space-y-1">
              {categories.map((cat, idx) => {
                const total = categoryAmounts.reduce((a, b) => a + b, 0);
                const percent = ((categoryAmounts[idx] / total) * 100).toFixed(1);
                return (
                  <div key={idx}>
                    <span
                      className="inline-block w-3 h-3 rounded-full mr-2"
                      style={{ backgroundColor: colors[idx % colors.length] }}
                    ></span>
                    {cat}: ₹{categoryAmounts[idx]} ({percent}%)
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ExpensePage;