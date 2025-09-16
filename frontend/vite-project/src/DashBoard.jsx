import React from "react";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
} from "recharts";
import Cards from "./dashboard/Cards";
import FinStats from "./dashboard/FinStats";
import Recurring from "./dashboard/Recurring";
import DivisionbyCategories from "./dashboard/DivisionbyCategories";

const balanceData = [
  { value: 52000 },
  { value: 47000 },
  { value: 59000 },
  { value: 35000 },
  { value: 42000 },
  { value: 56000 },
  { value: 31000 },
  { value: 45000 },
  { value: 37000 },
  { value: 58000 },
  { value: 39000 },
  { value: 54000 },
];

const savingsData = [
  { month: "Jan", value: 2100 },
  { month: "Feb", value: 2500 },
  { month: "Mar", value: 1900 },
  { month: "Apr", value: 2800 },
  { month: "May", value: 2333 },
  { month: "Jun", value: 2600 },
  { month: "Jul", value: 2000 },
  { month: "Aug", value: 2700 },
  { month: "Sep", value: 2200 },
  { month: "Oct", value: 2900 },
  { month: "Nov", value: 2400 },
  { month: "Dec", value: 2750 },
];

const incomeData = [
  { value: 9500 },
  { value: 10200 },
  { value: 9700 },
  { value: 10800 },
  { value: 9300 },
  { value: 10500 },
  { value: 9900 },
  { value: 11000 },
  { value: 9400 },
  { value: 10750 },
  { value: 9800 },
  { value: 10300 },
];

const expenseData = [
  { name: "Used", value: 77 },
  { name: "Remaining", value: 23 },
];

const DashBoard = () => {
  return (
    <div className="flex flex-col sm:grid sm:grid-rows-[2.5rem_1fr] min-h-full">
      <div>Header</div>
      <div className="grid sm:grid-rows-[2fr_1.5fr_1.5fr] sm:grid-cols-[3fr_2fr] gap-4 h-[100%]">
        <div className="sm:col-[1_/_span_1] sm:row-[1_/_span_1] grid sm:grid-cols-2 sm:grid-rows-2 gap-4">
          {/* Balance Card */}
          <div className="bg-white rounded-lg p-4 shadow-sm hover:shadow-md border border-gray-100">
            <div className="flex items-center justify-between h-full">
              <div className="flex-1 flex flex-col justify-between h-full">
                <p className="text-sm text-gray-500 mb-1">Balance</p>
                <h2 className="text-2xl font-semibold text-gray-900 mb-2">
                  $54,130.00
                </h2>
                <div className="flex items-center">
                  <span className="text-green-500 text-sm">↗</span>
                  <span className="text-green-500 text-sm ml-1">12.2%</span>
                </div>
              </div>
              <div className="w-[50%] h-20">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={balanceData}>
                    <Line
                      type="monotone"
                      dataKey="value"
                      stroke="#ec4899"
                      strokeWidth={2}
                      dot={false}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
          {/* Savings Card */}
          <div className="bg-white rounded-lg p-4 shadow-sm hover:shadow-md border border-gray-100">
            <div className="flex items-center justify-between h-full">
              <div className="flex-1 flex flex-col justify-between h-full">
                <p className="text-sm text-gray-500 mb-1">Savings</p>
                <h2 className="text-2xl font-semibold text-gray-900 mb-2">
                  $2,333.00
                </h2>
                <div className="flex items-center">
                  <span className="text-green-500 text-sm">↗</span>
                  <span className="text-green-500 text-sm ml-1">3.5%</span>
                </div>
              </div>
              <div className="w-[50%] h-20">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={savingsData}>
                    <Bar
                      dataKey="value"
                      fill="var(--color-primary)"
                      radius={[2, 2, 0, 0]}
                    />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>

          {/* Income Card */}
          <div className="bg-white rounded-lg p-4 shadow-sm hover:shadow-md border border-gray-100">
            <div className="flex items-center justify-between h-full">
              <div className="flex-1 flex flex-col justify-between h-full">
                <p className="text-sm text-gray-500 mb-1">Income</p>
                <h2 className="text-2xl font-semibold text-gray-900 mb-2">
                  $10,150.00
                </h2>
                <div className="flex items-center">
                  <span className="text-green-500 text-sm">↗</span>
                  <span className="text-green-500 text-sm ml-1">2.8%</span>
                </div>
              </div>
              <div className="w-[50%] h-20">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={incomeData}>
                    <Line
                      type="monotone"
                      dataKey="value"
                      stroke="#10b981"
                      strokeWidth={2}
                      dot={false}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>

          {/* Expenses Card */}
          <div className="bg-white rounded-lg p-4 shadow-sm hover:shadow-md border border-gray-100 transition-shadow ease-in-out duration-500">
            <div className="flex items-center justify-between h-[100%]">
              <div className="flex-1 flex flex-col justify-between h-full">
                <p className="text-sm text-gray-500 mb-1">Expenses</p>
                <h2 className="text-2xl font-semibold text-gray-900 mb-2">
                  $7,817.00
                </h2>
                <div className="flex items-center">
                  <span className="text-green-500 text-sm">↗</span>
                  <span className="text-green-500 text-sm ml-1">2.7%</span>
                </div>
              </div>
              <div className="w-[50%] h-full relative">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={expenseData}
                      cx="50%"
                      cy="50%"
                      innerRadius="85%"
                      outerRadius="100%"
                      paddingAngle={0}
                      dataKey="value"
                      startAngle={90}
                      endAngle={450}
                      cornerRadius={10}
                    >
                      <Cell fill="var(--color-primary)" />
                      <Cell fill="#e5e7eb" />
                    </Pie>
                  </PieChart>
                </ResponsiveContainer>
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-lg md:text-xl font-semibold text-gray-900">
                    77%
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="sm:col-[2_/_span_1] sm:row-[1_/_span_1 flex flex-col bg-white rounded-lg shadow-sm border border-gray-100 h-full">
          <Cards />
        </div>
        <div className="sm:col-[1_/_span_1] sm:row-[2_/_span_1] min-h-[200px]">
          <FinStats />
        </div>
        <div className="sm:col-[1_/_span_1] sm:row-[3_/_span_1]">
          <Recurring />
        </div>
        <div className="sm:col-[2_/_span_1] sm:row-[2_/_span_2] bg-white h-full">
          <DivisionbyCategories />
        </div>
      </div>
    </div>
  );
};

export default DashBoard;
