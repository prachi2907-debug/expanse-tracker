import React from "react";
import { Link } from "react-router-dom";

const Layout = ({ children }) => {
  return (
    <div className="min-h-screen bg-[#1b1b1b] text-[#f5f5dc]">
      {/* Shared Navbar */}
      <nav className="flex justify-between items-center px-8 py-4 bg-[#2b1e15] shadow-md border-b border-[#3e2d22]">
        <h1 className="text-2xl font-bold tracking-wide">PocketPlan</h1>
        <div className="space-x-4">
          <Link to="/login" className="hover:text-[#ffcc80] font-medium">Login</Link>
          <Link to="/register" className="hover:text-[#ffcc80] font-medium">Sign Up</Link>
        </div>
      </nav>

      {/* Page Content */}
      <main>{children}</main>
    </div>
  );
};

export default Layout;