// client/src/pages/HomePage.jsx
import React, { useState } from "react";
import Sidebar from "../components/Sidebar";
import TopStats from "../components/TopStats";
import FutureExpenseBox from "../components/FutureExpenseBox";

const HomePage = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);

  return (
    <div className="flex h-screen bg-gray-100">
      <Sidebar
        isOpen={sidebarOpen}
        toggleSidebar={() => setSidebarOpen(!sidebarOpen)}
      />
      <div className="flex-1 flex flex-col p-4">
        <div className="flex justify-between items-start mb-6">
          <div className="flex-1 flex justify-center">
            <TopStats />
          </div>
          <div className="w-64">
            <FutureExpenseBox />
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomePage;