import React from "react";

const App = () => {
  return (
    <div className="min-h-screen sm:grid sm:grid-cols-12 font-poppins">
      <div className="sm:col-span-3 xl:col-span-2 p-4 flex flex-col gap-2 bg-primary text-gray-50">
        <div className="flex justify-center items-center h-[5vh]">Tracker</div>
        <div className="flex-grow pl-4 pt-2 flex flex-col gap-1.5">
          <p className="font-inter-tight text-[1.5vmin]">MAIN MENU</p>
          <p className="menu-button">
            <i class="fa-solid fa-compass"></i>Overview
          </p>
          <p className="menu-button">
            <i class="fa-solid fa-credit-card"></i>Cards
          </p>
          <p className="menu-button">
            <i class="fa-solid fa-dollar-sign"></i>Budget
          </p>
          <p className="menu-button">
            <i class="fa-solid fa-chart-simple"></i>Statistics
          </p>
          <p className="menu-button">
            <i class="fa-solid fa-book"></i>Report
          </p>
          <p className="menu-button">
            <i class="fa-solid fa-money-bill-transfer"></i>Transactions
          </p>
        </div>
        <div className="">Settings</div>
        <div className="">Upgrade to Pro</div>
      </div>
      <div className="sm:col-span-9 xl:col-span-10"></div>
    </div>
  );
};

export default App;
