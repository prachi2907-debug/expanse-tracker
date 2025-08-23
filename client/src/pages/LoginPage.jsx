import React, { useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";

const LoginPage = () => {
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const navigate = useNavigate(); // 👈 Add this

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    try {
      const res = await axios.post("https://pocketplan-hbsw.onrender.com/api/auth/login", form);
      localStorage.setItem("token", res.data.token);
      localStorage.setItem("user", JSON.stringify(res.data.user));
      setSuccess("Login successful!");
      setTimeout(() => {
        navigate("/home"); // 👈 Redirect after 1s
      }, 1000);
    } catch (err) {
      setError(err.response?.data?.msg || "Login failed");
    }
  };

  return (
    <div className="min-h-screen bg-[#2c0e0e] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-lg bg-[#3b2317] text-[#f5f5dc] rounded-3xl shadow-xl p-10 border border-[#5a3a2c]">
        <div className="flex flex-col items-center mb-6">
          <img
            src="https://cdn-icons-png.flaticon.com/512/747/747545.png"
            alt="login avatar"
            className="w-20 h-20 rounded-full border-4 border-[#e1ad7d] mb-3"
          />
          <h2 className="text-3xl font-bold text-[#f5f5dc]">Login 🔐</h2>
        </div>

        {error && (
          <div className="bg-red-200 text-red-900 text-sm px-4 py-2 mb-4 rounded-md border border-red-300 text-center">
            {error}
          </div>
        )}
        {success && (
          <div className="bg-green-600 text-white text-sm px-4 py-2 mb-4 rounded text-center">
            {success}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <input
            name="email"
            type="email"
            placeholder="Email Address"
            value={form.email}
            onChange={handleChange}
            required
            className="w-full px-4 py-3 bg-[#4b2e22] text-white placeholder:text-[#dabfa3] border border-[#a67c52] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#ffc04d]"
          />
          <input
            name="password"
            type="password"
            placeholder="Password"
            value={form.password}
            onChange={handleChange}
            required
            className="w-full px-4 py-3 bg-[#4b2e22] text-white placeholder:text-[#dabfa3] border border-[#a67c52] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#ffc04d]"
          />
          <button
            type="submit"
            className="w-full py-3 bg-[#ff9900] hover:bg-[#ffad33] transition rounded-xl font-semibold text-[#2c0e0e]"
          >
            Sign In
          </button>
        </form>

        <p className="mt-6 text-sm text-center text-[#f5f5dc]">
          Don’t have an account?{" "}
          <Link to="/register" className="text-[#ffc04d] hover:underline">
            Create one
          </Link>
        </p>
      </div>
    </div>
  );
};

export default LoginPage;
