import React from "react";

const DashBoard = () => {
  return (
    <div className="sm:grid sm:grid-rows-[2.5rem_1fr] min-h-full">
      <div>Header</div>
      <div className="grid sm:grid-rows-[2fr_1.5fr_1.5fr] sm:grid-cols-[3fr_2fr] gap-4 h-[100%]">
        <div className="sm:col-[1_/_span_1] sm:row-[1_/_span_1] grid sm:grid-cols-2 sm:grid-rows-2 gap-4">
          <div class="border-2 p-4 rounded-xl">Balance</div>
          <div class="border-2 p-4 rounded-xl">Savings</div>
          <div class="border-2 p-4 rounded-xl">Income</div>
          <div class="border-2 p-4 rounded-xl">Expense</div>
        </div>
        <div className="sm:col-[2_/_span_1] sm:row-[1_/_span_1] border-2 rounded-xl">
          Cards
        </div>
        <div className="sm:col-[1_/_span_1] sm:row-[2_/_span_1] border-2 rounded-xl">
          Financial Statistics
        </div>
        <div className="sm:col-[1_/_span_1] sm:row-[3_/_span_1] border-2 rounded-xl">
          Recent activities
        </div>
        <div className="sm:col-[2_/_span_1] sm:row-[2_/_span_2] border-2 rounded-xl">
          Last Transaction
        </div>
      </div>
    </div>
  );
};

export default DashBoard;
