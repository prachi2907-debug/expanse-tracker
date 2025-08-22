// src/components/sections/About.jsx
import React from "react";

const About = () => {
    return (
        <section id="about" className="min-h-screen bg-[#2c0e0e] text-[#f5f5dc] flex items-center justify-center px-6 py-12">
            <div className="max-w-6xl w-full flex flex-col md:flex-row items-center gap-12">
                {/* Left: Image */}
                <div className="w-full md:w-1/2">
                    <img
                        src="/images/pic.png"
                        alt="Expense Tracker"
                        className="w-full h-auto rounded-xl shadow-lg"
                    />

                </div>

                {/* Right: Text */}
                <div className="w-full md:w-1/2 text-center md:text-left">
                    <h2 className="text-3xl font-bold mb-6">About PocketPlan</h2>
                    <p className="text-lg mb-6">
                        Managing money as a student shouldn't be complicated. Expense Tracker helps
                        you keep things simple — track spending, plan budgets, and understand where
                        your money goes.
                    </p>

                    <div className="space-y-4">
                        <div className="flex items-start gap-3">
                            <span className="text-2xl">🎓</span>
                            <div>
                                <h4 className="font-semibold text-lg">Built for Students</h4>
                                <p className="text-sm">Specifically made for student expenses — rent, food, and more.</p>
                            </div>
                        </div>
                        <div className="flex items-start gap-3">
                            <span className="text-2xl">🔐</span>
                            <div>
                                <h4 className="font-semibold text-lg">Secure & Private</h4>
                                <p className="text-sm">Your data stays safe and encrypted — always.</p>
                            </div>
                        </div>
                        <div className="flex items-start gap-3">
                            <span className="text-2xl">📱</span>
                            <div>
                                <h4 className="font-semibold text-lg">Works on Any Device</h4>
                                <p className="text-sm">Use it on mobile, tablet, or laptop without hassle.</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default About;