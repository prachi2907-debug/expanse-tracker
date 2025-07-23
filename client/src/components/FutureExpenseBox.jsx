import React, { useState, useEffect } from "react";
import axios from "axios";

const FutureExpenseBox = () => {
  const [expenses, setExpenses] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({ amount: "", category: "", date: "" });

  // Fetch future expenses on mount
  useEffect(() => {
    fetchExpenses();
  }, []);

  const fetchExpenses = async () => {
    try {
      const res = await axios.get("/api/future-expenses");
      setExpenses(res.data);
    } catch (err) {
      console.error("Error fetching expenses:", err);
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleAdd = async () => {
    console.log("Sending:", formData);
    try {
      const res = await axios.post("/api/future-expenses", formData);
      setExpenses([...expenses, res.data]); // Update UI
      setFormData({ amount: "", category: "", date: "" }); // Reset form
      setShowForm(false);
    } catch (err) {
      console.error("Error saving future expense:", err);
      alert("Failed to save future expense. Please try again.");
    }
  };

  return (
    <div className="bg-white p-4 shadow-md rounded h-auto flex flex-col justify-between">
      <div>
        <h3 className="text-md font-semibold text-black">Future Expenses</h3>
        {expenses.length === 0 ? (
          <p className="text-md font-semibold text-black">No future expenses added yet.</p>
        ) : (
          expenses.map((exp, index) => {
            if (!exp || !exp.category || !exp.amount || !exp.date) return null;
            return (
              <p key={index} className="text-black">
                - {exp.category}: ₹{exp.amount} on{" "}
                {new Date(exp.date).toLocaleDateString()}
              </p>
            );
          })
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
            onClick={handleAdd}
            className="w-full bg-green-500 text-white py-1 rounded"
          >
            Save
          </button>
        </div>
      )}

      <button
        onClick={() => setShowForm(!showForm)}
        className="bg-purple-500 text-white py-1 px-3 rounded self-center mt-4"
      >
        {showForm ? "Cancel" : "Add Future Expense"}
      </button>
    </div>
  );
};

export default FutureExpenseBox;
