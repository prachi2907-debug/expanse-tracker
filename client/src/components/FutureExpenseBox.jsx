import React, { useState, useEffect } from "react";
import axios from "axios";

const FutureExpenseBox = () => {
  const [expenses, setExpenses] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({ amount: "", category: "", date: "" });
  const [editId, setEditId] = useState(null); // Track if editing

  // get token once
  const token = localStorage.getItem("token");

  useEffect(() => {
    fetchExpenses();
  }, []);

  const fetchExpenses = async () => {
    try {
      const res = await axios.get("/api/future-expenses", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setExpenses(res.data);
    } catch (err) {
      console.error("Error fetching expenses:", err);
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleAddOrUpdate = async () => {
    try {
      if (editId) {
        // Update expense
        const res = await axios.put(`/api/future-expenses/${editId}`, formData, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setExpenses(
          expenses.map((exp) => (exp._id === editId ? res.data : exp))
        );
        setEditId(null);
      } else {
        // Add new expense
        const res = await axios.post("/api/future-expenses", formData, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setExpenses([...expenses, res.data]);
      }

      setFormData({ amount: "", category: "", date: "" });
      setShowForm(false);
    } catch (err) {
      console.error("Error saving expense:", err);
      alert("Failed to save expense. Please try again.");
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`/api/future-expenses/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setExpenses(expenses.filter((exp) => exp._id !== id));
    } catch (err) {
      console.error("Error deleting expense:", err);
      alert("Failed to delete expense. Please try again.");
    }
  };

  const handleEdit = (expense) => {
    setFormData({
      amount: expense.amount,
      category: expense.category,
      date: expense.date.split("T")[0], // format for input[type=date]
    });
    setEditId(expense._id);
    setShowForm(true);
  };

  return (
    <div className="bg-white p-4 shadow-md rounded h-auto flex flex-col justify-between">
      <div>
        <h3 className="text-md font-semibold text-black">Future Expenses</h3>
        {expenses.length === 0 ? (
          <p className="text-md font-semibold text-black">
            No future expenses added yet.
          </p>
        ) : (
          expenses.map((exp) => (
            <div key={exp._id} className="border-b py-2">
              {/* Expense text on one line */}
              <p className="text-black">
                {exp.category}: ₹{exp.amount} on{" "}
                {new Date(exp.date).toLocaleDateString()}
              </p>

              {/* Buttons on next line, aligned right */}
              <div className="flex justify-center space-x-2 mt-1">
                <button
                  onClick={() => handleEdit(exp)}
                  className="bg-blue-500 text-white px-2 py-1 rounded text-xs"
                  title="Edit"
                >
                  ✏️
                </button>
                <button
                  onClick={() => handleDelete(exp._id)}
                  className="bg-red-500 text-white px-2 py-1 rounded text-xs"
                  title="Delete"
                >
                  🗑️
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {showForm && (
        <div className="mt-4 space-y-2">
          <input
            type="number"
            name="amount"
            placeholder="Amount"
            value={formData.amount}
            onChange={handleChange}
            className="w-full px-2 py-1 border rounded"
          />
          <input
            type="text"
            name="category"
            placeholder="Category"
            value={formData.category}
            onChange={handleChange}
            className="w-full px-2 py-1 border rounded"
          />
          <input
            type="date"
            name="date"
            value={formData.date}
            onChange={handleChange}
            className="w-full px-2 py-1 border rounded"
          />
          <button
            onClick={handleAddOrUpdate}
            className="w-full bg-green-500 text-white py-1 rounded"
          >
            {editId ? "Update" : "Save"}
          </button>
        </div>
      )}

      <button
        onClick={() => {
          setShowForm(!showForm);
          setEditId(null);
          setFormData({ amount: "", category: "", date: "" });
        }}
        className="bg-purple-500 text-white py-1 px-3 rounded self-center mt-4"
      >
        {showForm ? "Cancel" : "Add Future Expense"}
      </button>
    </div>
  );
};

export default FutureExpenseBox;
