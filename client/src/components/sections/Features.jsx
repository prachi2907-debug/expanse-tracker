// src/components/sections/Features.jsx
import React from "react";

const Features = () => {
    return (
        <section id="menu" className="min-h-screen bg-[#3b2317] text-[#f5f5dc] flex items-center justify-center px-6 py-12">
            <div className="max-w-5xl w-full text-center">
                <h2 className="text-3xl font-bold mb-6">Why Use Our App?</h2>
                <p className="mb-12 text-lg">
                    Designed specifically for students who want a smarter, easier way to manage money.
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 text-left">
                    <div className="bg-[#4b2e22] p-6 rounded-2xl shadow-md">
                        <h3 className="text-xl font-semibold mb-2">Fast & Simple</h3>
                        <p>Log your expenses in seconds with a smooth, clutter-free interface.</p>
                    </div>
                    <div className="bg-[#4b2e22] p-6 rounded-2xl shadow-md">
                        <h3 className="text-xl font-semibold mb-2">Data Security</h3>
                        <p>Your data stays safe and private – no compromises, no tracking.</p>
                    </div>
                    <div className="bg-[#4b2e22] p-6 rounded-2xl shadow-md">
                        <h3 className="text-xl font-semibold mb-2">Insightful Charts</h3>
                        <p>Visualize your spending habits and savings trends over time.</p>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Features;