import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

const Sidebar = ({ isOpen, toggleSidebar }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const [userName, setUserName] = useState("User");

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      const user = JSON.parse(storedUser);
      setUserName(user.name || "User");
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  };

  const handleDashboardClick = () => {
    if (location.pathname !== "/home") {
      navigate("/home");
    }
  };

  const handleIncomeClick = () => {
    if (location.pathname !== "/income") {
      navigate("/income");
    }
  };

  const handleExpenseClick = () => {
    if (location.pathname !== "/expense") {
      navigate("/expense");
    }
  };

  const isActive = (path) => location.pathname === path;

  return (
    <div
      className={`bg-white shadow-md h-full p-6 transition-all duration-300 ${
        isOpen ? "w-64" : "w-20"
      } flex flex-col`}
    >
      <button
        onClick={toggleSidebar}
        className="mb-6 text-gray-600 hover:text-black text-xl"
      >
        ☰
      </button>

      {isOpen && (
        <div className="flex flex-col items-center mb-10">
          <img
            src="/images/logo1.png"
            alt="User"
            className="w-16 h-16 rounded-full mb-2"
          />
          <h2 className="text-md font-semibold text-black">{userName}</h2>
        </div>
      )}

      <ul className="space-y-4 text-gray-700 flex-1">
        <li
          onClick={handleDashboardClick}
          className={`flex items-center gap-3 cursor-pointer ${
            isActive("/home")
              ? "text-violet-600 font-semibold"
              : "hover:text-violet-600"
          }`}
        >
          📊 {isOpen && "Dashboard"}
        </li>

        <li
          onClick={handleIncomeClick}
          className={`flex items-center gap-3 cursor-pointer ${
            isActive("/income")
              ? "text-green-600 font-semibold"
              : "hover:text-green-600"
          }`}
        >
          💰 {isOpen && "Income"}
        </li>

        <li
          onClick={handleExpenseClick}
          className={`flex items-center gap-3 cursor-pointer ${
            isActive("/expense")
              ? "text-red-500 font-semibold"
              : "hover:text-red-500"
          }`}
        >
          💸 {isOpen && "Expense"}
        </li>

        <li className="flex items-center gap-3 cursor-pointer hover:text-yellow-600">
          📋 {isOpen && "Budget"}
        </li>

        <li
          onClick={handleLogout}
          className="flex items-center gap-3 cursor-pointer hover:text-gray-800 mt-auto"
        >
          🚪 {isOpen && "Logout"}
        </li>
      </ul>
    </div>
  );
};

export default Sidebar;
