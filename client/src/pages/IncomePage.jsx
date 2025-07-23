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


// Register all required elements (removed ChartDataLabels)
ChartJS.register(
  BarElement,
  ArcElement,
  CategoryScale,
  LinearScale,
  PointElement,
  Tooltip,
  Legend
);

const IncomePage = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [amount, setAmount] = useState("");
  const [source, setSource] = useState("");
  const [date, setDate] = useState("");
  const [notes, setNotes] = useState("");
  const [message, setMessage] = useState("");
  const [incomes, setIncomes] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editingIncomeId, setEditingIncomeId] = useState(null);
  const [filter, setFilter] = useState("24hrs");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  const fetchIncomes = async () => {
    try {
      const res = await axios.get("/api/incomes");
      setIncomes(res.data.reverse());
    } catch (error) {
      console.error("Error fetching incomes:", error);
    }
  };

  useEffect(() => {
    fetchIncomes();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingIncomeId) {
        await axios.put(`/api/incomes/${editingIncomeId}`,{
          amount,
          source,
          date,
          notes,
        });
        setMessage("✅ Income updated successfully!");
      } else {
        await axios.post("/api/incomes", { amount, source, date, notes });
        setMessage("✅ Income added successfully!");
      }
      setAmount("");
      setSource("");
      setDate("");
      setNotes("");
      setEditingIncomeId(null);
      setShowForm(false);
      fetchIncomes();
    } catch (error) {
      console.error("Error saving income:", error);
      setMessage("❌ Failed to save income.");
    }
  };

  const handleEdit = (income) => {
    setAmount(income.amount);
    setSource(income.source);
    setDate(income.date.slice(0, 10));
    setNotes(income.notes || "");
    setEditingIncomeId(income._id);
    setShowForm(true);
    setMessage("");
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this income?")) {
      try {
       await axios.delete(`/api/incomes/${id}`);
        fetchIncomes();
        setMessage("🗑 Income deleted successfully!");
      } catch (error) {
        console.error("Error deleting income:", error);
        setMessage("❌ Failed to delete income.");
      }
    }
  };

  const handleAddButton = () => {
    setShowForm(!showForm);
    setEditingIncomeId(null);
    setAmount("");
    setSource("");
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

  const filterIncomesByDate = () => {
    const now = new Date();
    return incomes.filter((income) => {
      const incomeDate = new Date(income.date);
      const timeDiff = now - incomeDate;

      if (startDate && endDate) {
        const start = new Date(startDate);
        const end = new Date(endDate);
        return incomeDate >= start && incomeDate <= end;
      }

      switch (filter) {
        case "24hrs":
          return timeDiff <= 24 * 60 * 60 * 1000;
        case "weekly":
          return timeDiff <= 7 * 24 * 60 * 60 * 1000;
        case "monthly":
          return (
            incomeDate.getMonth() === now.getMonth() &&
            incomeDate.getFullYear() === now.getFullYear()
          );
        case "quarterly":
          const currentQuarter = Math.floor(now.getMonth() / 3);
          const incomeQuarter = Math.floor(incomeDate.getMonth() / 3);
          return (
            incomeQuarter === currentQuarter &&
            incomeDate.getFullYear() === now.getFullYear()
          );
        case "yearly":
          return incomeDate.getFullYear() === now.getFullYear();
        default:
          return true;
      }
    });
  };

  const filteredIncomes = filterIncomesByDate();

  const totalIncome = incomes.reduce(
    (acc, curr) => acc + parseFloat(curr.amount || 0),
    0
  );

  const sourceMap = {};
  filteredIncomes.forEach(({ source, amount }) => {
    sourceMap[source] = (sourceMap[source] || 0) + Number(amount);
  });
  const sources = Object.keys(sourceMap);
  const sourceAmounts = Object.values(sourceMap);
  const colors = [
    "#4CAF50",
    "#FF9800",
    "#03A9F4",
    "#E91E63",
    "#9C27B0",
    "#FF5722",
    "#795548",
  ];

  const barData = {
    labels: sources,
    datasets: [
      {
        label: "Income by Source",
        data: sourceAmounts,
        backgroundColor: colors,
      },
    ],
  };

  const pieData = {
    labels: sources,
    datasets: [
      {
        label: "Income Distribution",
        data: sourceAmounts,
        backgroundColor: colors,
      },
    ],
  };

  const chartOptions = {
    plugins: {
      legend: {
        display: false,
      },
    },
  };

  const pieOptions = {
    plugins: {
      legend: {
        display: false,
      },
    },
  };

  // NEW: CSV Export function
  const exportToCSV = () => {
    if (filteredIncomes.length === 0) {
      alert("No data to export.");
      return;
    }

    const headers = ["Amount", "Source", "Date", "Notes"];
    const incomeRows = filteredIncomes.map(({ amount, source, date, notes }) => [
      amount.toString(),
      source,
      formatDate(date),
      notes || "",
    ]);

    // Calculate totals
    const totalFilteredIncome = filteredIncomes.reduce(
      (acc, curr) => acc + parseFloat(curr.amount || 0),
      0
    );
    const totalAllIncome = incomes.reduce(
      (acc, curr) => acc + parseFloat(curr.amount || 0),
      0
    );

    let csvRows = [];

    // Main income table
    csvRows.push(["Income Data"]);
    csvRows.push(headers);
    csvRows = csvRows.concat(incomeRows);

    // Add space and a clear divider
    csvRows.push([]);
    csvRows.push(["----------------------------"]);
    csvRows.push([]);

    // Summary section
    csvRows.push(["Summary"]);
    csvRows.push(["Description", "Amount"]);
    csvRows.push(["Total Income (Filtered)", totalFilteredIncome.toFixed(2)]);
    csvRows.push(["Total Income (All)", totalAllIncome.toFixed(2)]);

    // Convert to CSV string
    const csvContent =
      "data:text/csv;charset=utf-8," +
      csvRows.map((e) => e.join(",")).join("\n");

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    const nowStr = new Date().toISOString().slice(0, 10);
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `income_data_${nowStr}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };






  // NEW: PDF Export function
  const exportToPDF = () => {
    if (filteredIncomes.length === 0) {
      alert("No data to export.");
      return;
    }

    const doc = new jsPDF();

    const tableColumn = ["Amount", "Source", "Date", "Notes"];
    const tableRows = [];

    filteredIncomes.forEach(({ amount, source, date, notes }) => {
      const rowData = [amount.toString(), source, formatDate(date), notes || ""];
      tableRows.push(rowData);
    });

    doc.text("Income Data", 14, 15);
    autoTable(doc, {
      head: [tableColumn],
      body: tableRows,
      startY: 20,
    });

    const finalY = doc.lastAutoTable.finalY || 20;

    const totalFilteredIncome = filteredIncomes.reduce(
      (acc, curr) => acc + parseFloat(curr.amount || 0),
      0
    );

    doc.setFontSize(12);
    doc.text(`Total Income (Filtered): ${totalFilteredIncome.toFixed(2)}`, 14, finalY + 10);

    doc.text(`Total Income (All): ${totalIncome.toFixed(2)}`, 14, finalY + 18);


    const nowStr = new Date().toISOString().slice(0, 10);
    doc.save(`income_data_${nowStr}.pdf`);

  };





  return (
    <div className="flex h-screen bg-gray-100">
      <Sidebar
        isOpen={sidebarOpen}
        toggleSidebar={() => setSidebarOpen(!sidebarOpen)}
      />
      <div className="flex-1 flex flex-col p-6 overflow-y-auto space-y-8">
        {/* Summary */}
        <div className="flex justify-between items-start">
          <div className="bg-white p-4 w-52 rounded-xl shadow-md flex items-center gap-4">
            <div className="bg-green-100 p-3 rounded-full text-green-600 text-lg">
              💰
            </div>
            <div>
              <p className="text-sm text-gray-600 font-semibold">Total Income</p>
              <p className="text-lg font-bold text-gray-800">₹{totalIncome}</p>
            </div>
          </div>
          <button
            onClick={handleAddButton}
            className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
          >
            {showForm ? "Cancel" : "➕ Add Income"}
          </button>
        </div>

        {/* Filter */}
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
              <label className="block font-semibold text-black">Source</label>
              <input
                type="text"
                value={source}
                onChange={(e) => setSource(e.target.value)}
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
              className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
            >
              {editingIncomeId ? "Update Income" : "Save Income"}
            </button>
          </form>
        )}

        {!showForm && message && (
          <p className="text-blue-600 font-medium">{message}</p>
        )}

        {/* Income Table */}
        {!showForm && (
          <div className="bg-white p-6 rounded-xl shadow">
            <h2 className="text-xl font-bold text-black mb-4">Recent Incomes</h2>

            {/* NEW: Download Buttons */}
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

            {filteredIncomes.length === 0 ? (
              <p className="text-gray-500">No incomes found for selected filter.</p>
            ) : (
              <table className="w-full table-auto text-sm border-collapse">
                <thead>
                  <tr className="bg-gray-100 text-black font-semibold">
                    <th className="p-2 border-b">Amount (₹)</th>
                    <th className="p-2 border-b">Source</th>
                    <th className="p-2 border-b">Date</th>
                    <th className="p-2 border-b">Notes</th>
                    <th className="p-2 border-b">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredIncomes.map((income) => (
                    <tr
                      key={income._id}
                      className="hover:bg-gray-50 text-black"
                    >
                      <td className="p-2 border-b">₹{income.amount}</td>
                      <td className="p-2 border-b">{income.source}</td>
                      <td className="p-2 border-b">{formatDate(income.date)}</td>
                      <td className="p-2 border-b">{income.notes || "-"}</td>
                      <td className="p-2 border-b">
                        <button
                          className="text-blue-600 hover:underline mr-2"
                          onClick={() => handleEdit(income)}
                        >
                          Edit
                        </button>
                        <button
                          className="text-red-600 hover:underline"
                          onClick={() => handleDelete(income._id)}
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

        {/* 📊 Graphs */}
        <div className="space-y-8">
          <div className="bg-white p-6 rounded-xl shadow w-full max-w-xl mx-auto">
            <h2 className="text-xl font-bold text-black mb-4">
              📊 Income by Source (Bar Chart)
            </h2>
            <Bar data={barData} options={chartOptions} />
            <div className="mt-4 text-sm text-gray-700 space-y-1">
              {sources.map((source, idx) => (
                <div key={idx}>
                  <span
                    className="inline-block w-3 h-3 rounded-full mr-2"
                    style={{ backgroundColor: colors[idx % colors.length] }}
                  ></span>
                  {source}: ₹{sourceAmounts[idx]}
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl shadow w-full max-w-xl mx-auto">
            <h2 className="text-xl font-bold text-black mb-4">
              🥧 Income Distribution (Pie Chart)
            </h2>
            <Pie data={pieData} options={pieOptions} />
            <div className="mt-4 text-sm text-gray-700 space-y-1">
              {sources.map((source, idx) => {
                const total = sourceAmounts.reduce((a, b) => a + b, 0);
                const percent = ((sourceAmounts[idx] / total) * 100).toFixed(1);
                return (
                  <div key={idx}>
                    <span
                      className="inline-block w-3 h-3 rounded-full mr-2"
                      style={{ backgroundColor: colors[idx % colors.length] }}
                    ></span>
                    {source}: ₹{sourceAmounts[idx]} ({percent}%)
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

export default IncomePage;