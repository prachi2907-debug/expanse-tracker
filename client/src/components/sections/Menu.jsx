// src/components/sections/Menu.jsx
import React from "react";

const Menu = () => {
  return (
    <section id="menu" className="min-h-screen bg-[#3b2317] text-[#f5f5dc] flex items-center justify-center px-6 py-12">
      <div className="max-w-5xl w-full text-center">
        <h2 className="text-3xl font-bold mb-6">What You Can Do</h2>
        <p className="mb-12 text-lg">
          All the essential tools to help manage your spending and budget like a pro.
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 text-left">
          <div className="bg-[#4b2e22] p-6 rounded-2xl shadow-md">
            <h3 className="text-xl font-semibold mb-2">Add Expenses</h3>
            <p>Log every expense with category, date, and description in seconds.</p>
          </div>
          <div className="bg-[#4b2e22] p-6 rounded-2xl shadow-md">
            <h3 className="text-xl font-semibold mb-2">Set Budgets</h3>
            <p>Control overspending by setting monthly or category-based budgets.</p>
          </div>
          <div className="bg-[#4b2e22] p-6 rounded-2xl shadow-md">
            <h3 className="text-xl font-semibold mb-2">Track Everything</h3>
            <p>See your financial history clearly, with total spend and breakdowns.</p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Menu;