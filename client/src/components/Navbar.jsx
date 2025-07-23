// src/components/Navbar.jsx
import React from "react";

const Navbar = ({ setActiveSection }) => {
  const scrollToSection = (id) => {
    setActiveSection(id);
    setTimeout(() => {
      const section = document.getElementById(id);
      section?.scrollIntoView({ behavior: "smooth" });
    }, 50);
  };

  return (
    <nav className="flex justify-between items-center px-8 py-4 bg-[#3b2317] text-[#f5f5dc] shadow-md fixed w-full z-50">
      <div className="text-xl font-bold tracking-wide">Expense Tracker</div>
      <ul className="flex space-x-6 text-sm font-medium">
        <li className="cursor-pointer hover:text-[#ffc04d]" onClick={() => scrollToSection("home")}>Home</li>
        <li className="cursor-pointer hover:text-[#ffc04d]" onClick={() => scrollToSection("about")}>About</li>
        <li className="cursor-pointer hover:text-[#ffc04d]" onClick={() => scrollToSection("menu")}>Menu</li>
        <li className="cursor-pointer hover:text-[#ffc04d]" onClick={() => scrollToSection("features")}>Features</li>
        <li className="cursor-pointer hover:text-[#ffc04d]" onClick={() => window.location.href = "/register"}>Sign Up</li>
        <li className="cursor-pointer hover:text-[#ffc04d]" onClick={() => window.location.href = "/login"}>Login</li>
      </ul>
    </nav>
  );
};

export default Navbar;