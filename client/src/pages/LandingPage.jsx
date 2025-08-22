// src/pages/LandingPage.jsx
import React, { useState } from "react";
import Navbar from "../components/Navbar";
import About from "../components/sections/About";
import Menu from "../components/sections/Menu";
import Features from "../components/sections/Features";
import { Link } from "react-router-dom";

const LandingPage = () => {
  const [activeSection, setActiveSection] = useState("home");

  return (
    <div className="bg-[#1b1b1b] text-[#f5f5dc] scroll-smooth">
      {/* Navbar with prop */}
      <Navbar setActiveSection={setActiveSection} />

      {/* Hero Section */}
      {activeSection === "home" && (
        <>
          <section
            id="home"
            className="h-screen flex flex-col justify-center items-center px-6 bg-[#2b1e15] text-center pt-20"
          >
           <img src="./images/pic.png" alt="error" className="w-15 h-15 rounded" />
            <h1 className="text-5xl font-bold mb-4">PocketPlan</h1>
            <p className="text-lg max-w-xl">
              Simplify your college budgeting. Track expenses, set goals, and stay financially smart!
            </p>
          </section>

          {/* Call to Action only on home */}
          <section className="py-20 px-6 bg-[#4b2e22] text-center">
            <h2 className="text-3xl font-bold mb-4">Start Tracking Today</h2>
            <p className="mb-8">Join hundreds of students managing their finances better.</p>
            <Link
              to="/register"
              className="bg-[#ff9900] hover:bg-[#ffad33] px-8 py-4 text-lg rounded-lg font-bold text-[#2c0e0e] transition"
            >
              Create an Account
            </Link>
          </section>
        </>
      )}

      {activeSection === "about" && <About />}
      {activeSection === "menu" && <Menu />}
      {activeSection === "features" && <Features />}
    </div>
  );
};

export default LandingPage;