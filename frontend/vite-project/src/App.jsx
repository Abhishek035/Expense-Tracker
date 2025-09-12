import React from "react";
import "@mantine/core/styles.css";
// ‼️ import carousel styles after core package styles
import "@mantine/carousel/styles.css";

import Dashboard from "./DashBoard";
import "./index.css"; // Your CSS file

const App = () => {
  return (
    <>
      {/* On small screens (mobile-first), it's a single column (default).
          On 'md' screens and larger, we switch to a 2-column grid. */}
      <div className="md:grid md:grid-cols-[16rem_1fr] min-h-screen font-poppins">
        {/* 
          Column 1: Sidebar.
          - Has a fixed width of 280px on medium screens and up. This provides consistency.
          - The '1fr' in the grid-cols definition for the main content means it will take up the rest of the available space.
          - This approach is superior to col-span for a primary sidebar because the sidebar's width remains predictable and ideal for its content, while the main content area is fluid.
        */}

        <div className="p-4 flex-col gap-2 bg-primary text-gray-50 hidden md:flex">
          {" "}
          {/* Use `hidden md:flex` to hide on mobile */}
          <div className="flex justify-center items-center h-[5vh] text-xl font-bold">
            Tracker
          </div>
          <div className="flex-grow pl-4 pt-2 flex flex-col gap-1.5">
            <p className="font-inter-tight text-xs uppercase tracking-wider text-gray-400 mb-2">
              MAIN MENU
            </p>
            {/* Using text-base ensures fonts scale with user's browser settings */}
            <a
              href="#"
              className="menu-button text-base flex items-center gap-3"
            >
              <i className="fa-solid fa-compass w-5 text-center"></i>
              <span>Overview</span>
            </a>
            <a
              href="#"
              className="menu-button text-base flex items-center gap-3"
            >
              <i className="fa-solid fa-credit-card w-5 text-center"></i>
              <span>Cards</span>
            </a>
            <a
              href="#"
              className="menu-button text-base flex items-center gap-3"
            >
              <i className="fa-solid fa-dollar-sign w-5 text-center"></i>
              <span>Budget</span>
            </a>
            <a
              href="#"
              className="menu-button text-base flex items-center gap-3"
            >
              <i className="fa-solid fa-chart-simple w-5 text-center"></i>
              <span>Statistics</span>
            </a>
            <a
              href="#"
              className="menu-button text-base flex items-center gap-3"
            >
              <i className="fa-solid fa-book w-5 text-center"></i>
              <span>Report</span>
            </a>
            <a
              href="#"
              className="menu-button text-base flex items-center gap-3"
            >
              <i className="fa-solid fa-money-bill-transfer w-5 text-center"></i>
              <span>Transactions</span>
            </a>
          </div>
          <div>
            <a href="#" className="menu-button text-base">
              Settings
            </a>
          </div>
          <div>
            <a href="#" className="menu-button text-base">
              Upgrade to Pro
            </a>
          </div>
        </div>

        {/* 
          Column 2: Main Content.
          - This will automatically take up the remaining space because of the '1fr' unit.
          - When you zoom, the browser recalculates the available space, and this column will reflow naturally.
        */}
        <div className="p-6">
          {/* A button or mobile menu would go here for small screens */}
          <div className="md:hidden text-left">
            <button className="text-2xl">
              <i className="fa-solid fa-bars"></i>
            </button>
          </div>
          <Dashboard />
        </div>
      </div>
    </>
  );
};

export default App;
