import React from "react";

const DashBoard = () => {
  return (
    <div className="sm:grid sm:grid-rows-[2.5rem_1fr] h-full">
      <div>Header</div>
      <div className="grid sm:grid-rows-[2fr_1.5fr_1.5fr] sm:grid-cols-[3fr_2fr] gap-4 h-[100%]">
        <div className="sm:col-[1_/_span_1] sm:row-[1_/_span_1] border-2">Data</div>
        <div className="sm:col-[2_/_span_1] sm:row-[1_/_span_1] border-2">Cards</div>
        <div className="sm:col-[1_/_span_1] sm:row-[2_/_span_1] border-2">Financial Statistics</div>
        <div className="sm:col-[1_/_span_1] sm:row-[3_/_span_1] border-2">Recent activities</div>
        <div className="sm:col-[2_/_span_1] sm:row-[2_/_span_2] border-2">Last Transaction</div>
      </div>
    </div>
  );
};

export default DashBoard;
