import React from "react";

const TopStats = () => {
  return (
    <div className="flex justify-center gap-6">
      {/* Total Balance Card */}
      <div className="bg-white p-4 w-52 rounded-xl shadow-md flex items-center gap-4">
        <div className="bg-purple-100 p-3 rounded-full text-purple-600 text-lg">
          💳
        </div>
        <div>
          <p className="text-sm text-gray-500">Total Balance</p>
          <p className="text-md font-semibold text-black">₹79,100</p>
        </div>
      </div>

      {/* Total Income Card */}
      <div className="bg-white p-4 w-52 rounded-xl shadow-md flex items-center gap-4">
        <div className="bg-orange-100 p-3 rounded-full text-orange-600 text-lg">
          🟧
        </div>
        <div>
          <p className="text-sm text-gray-500">Total Income</p>
          <p className="text-md font-semibold text-black">₹86,200</p>
        </div>
      </div>

      {/* Total Expenses Card */}
      <div className="bg-white p-4 w-52 rounded-xl shadow-md flex items-center gap-4">
        <div className="bg-red-100 p-3 rounded-full text-red-600 text-lg">
          🟥
        </div>
        <div>
          <p className="text-sm text-gray-500">Total Expense</p>
          <p className="text-md font-semibold text-black">₹7,100</p>
        </div>
      </div>
    </div>
  );
};

export default TopStats;