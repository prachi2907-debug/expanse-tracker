import React, { useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";

const RegisterPage = () => {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
  });
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    console.log("✅ Form submitted!", form);

    try {
      const res = await axios.post("https://pocketplan-hbsw.onrender.com/api/auth/register", form);
      console.log("✅ Server response:", res.data);
      localStorage.setItem("token", res.data.token);
      navigate("/login");
    } catch (err) {
      console.error("❌ Error during registration:", err);
      setError(err.response?.data?.msg || "Registration failed");
    }
  };

  return (
    <div className="min-h-screen bg-[#2c0e0e] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-lg bg-[#3b2317] text-[#f5f5dc] rounded-3xl shadow-xl p-10 border border-[#5a3a2c]">
        <h2 className="text-3xl font-bold text-center mb-6">Create Account</h2>

        {error && (
          <div className="bg-red-100 border border-red-300 text-red-800 text-sm px-4 py-3 rounded-md mb-5 text-center">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <input
            type="text"
            name="name"
            value={form.name}
            onChange={handleChange}
            placeholder="Full Name"
            required
            className="w-full px-4 py-3 rounded-xl bg-[#4b2e22] text-white placeholder-[#dabfa3] border border-[#a67c52] focus:outline-none focus:ring-2 focus:ring-[#ffc04d]"
          />
          <input
            type="email"
            name="email"
            value={form.email}
            onChange={handleChange}
            placeholder="Email Address"
            required
            className="w-full px-4 py-3 rounded-xl bg-[#4b2e22] text-white placeholder-[#dabfa3] border border-[#a67c52] focus:outline-none focus:ring-2 focus:ring-[#ffc04d]"
          />
          <input
            type="password"
            name="password"
            value={form.password}
            onChange={handleChange}
            placeholder="Password"
            required
            className="w-full px-4 py-3 rounded-xl bg-[#4b2e22] text-white placeholder-[#dabfa3] border border-[#a67c52] focus:outline-none focus:ring-2 focus:ring-[#ffc04d]"
          />

          <button
            type="submit"
            className="w-full py-3 mt-2 bg-[#ff9900] text-[#2c0e0e] font-semibold rounded-xl hover:bg-[#ffad33] transition"
          >
            Register
          </button>
        </form>

        <p className="mt-6 text-sm text-center">
          Already have an account?{" "}
          <Link to="/login" className="text-[#ffc04d] hover:underline">
            Login here
          </Link>
        </p>
      </div>
    </div>
  );
};

export default RegisterPage;