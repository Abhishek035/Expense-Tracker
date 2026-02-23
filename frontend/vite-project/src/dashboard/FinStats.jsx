import React from "react";
import {
  BarChart,
  Bar,
  Rectangle,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

const financialData = [
  { month: "Jan", income: 18000, expenses: 11000 },
  { month: "Feb", income: 26000, expenses: 10000 },
  { month: "Mar", income: 32000, expenses: 31000 },
  { month: "Apr", income: 28000, expenses: 8000 },
  { month: "May", income: 39000, expenses: 28000 },
  { month: "Jun", income: 20000, expenses: 10000 },
  { month: "Jul", income: 32000, expenses: 10000 },
  { month: "Aug", income: 26000, expenses: 9000 },
  { month: "Sep", income: 36000, expenses: 7000 },
  { month: "Oct", income: 20000, expenses: 10000 },
  { month: "Nov", income: 15000, expenses: 9000 },
  { month: "Dec", income: 30000, expenses: 8000 },
];

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    return (
      <div className="bg-primary text-white p-3 rounded-lg shadow-lg">
        <p className="font-medium">{`${label} 2023`}</p>
        <p className="text-var(--color-primary)">{`$${
          data.income / 1000
        }k Income`}</p>
        {data.expenses > 0 && (
          <p className="text-gray-300">{`$${
            data.expenses / 1000
          }k Expenses`}</p>
        )}
      </div>
    );
  }
  return null;
};

const FinStats = () => {
  const calculateYAxisConfig = () => {
    const allValues = financialData.flatMap((item) => [
      item.income,
      item.expenses,
    ]);
    const maxValue = Math.max(...allValues);

    // Round up to the nearest significant value for better visual spacing
    const roundToNearestThousand = (value) => {
      const thousands = Math.ceil(value / 1000) * 1000;
      // Round to nearest 5k or 10k for cleaner intervals
      if (thousands <= 10000) return Math.ceil(thousands / 5000) * 5000;
      return Math.ceil(thousands / 10000) * 10000;
    };

    const maxDomain = roundToNearestThousand(maxValue);

    // Generate tick marks - aim for 4-6 ticks
    const tickCount = 5;
    const tickInterval = maxDomain / (tickCount - 1);
    const ticks = Array.from({ length: tickCount }, (_, i) => i * tickInterval);

    return {
      domain: [0, maxDomain],
      ticks: ticks,
      tickFormatter: (value) => {
        if (value === 0) return "0";
        return `${value / 1000}k`;
      },
    };
  };

  const yAxisConfig = calculateYAxisConfig();
  return (
    <div className="bg-white rounded-lg pt-3 pl-3 pr-4 shadow-sm border border-gray-100 h-full flex flex-col">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold text-text">Financial Statistics</h2>
        <div className="flex items-center">
          <div className="flex items-center gap-3 mr-4">
            <div className="w-3 h-3 rounded-full bg-primary"></div>
            <span className="text-sm text-text">Income</span>
          </div>
          <div className="flex items-center gap-3">
            <div className="w-3 h-3 rounded-full bg-gray-300"></div>
            <span className="text-sm text-text">Expense</span>
          </div>
        </div>
      </div>

      {/*Chart Placeholder*/}
      <div className="w-full flex-1">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={financialData}
            margin={{ top:20, left:-20 }}
            barCategoryGap="20%"
          >
            <XAxis
              dataKey="month"
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 12, fill: "#9ca3af" }}
            />
            <YAxis
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 12, fill: "#9ca3af" }}
              tickFormatter={yAxisConfig.tickFormatter}
              domain={yAxisConfig.domain}
              ticks={yAxisConfig.ticks}
            />
            <Tooltip content={<CustomTooltip />} />
            <Bar
              dataKey="income"
              fill="var(--color-primary)"
              radius={[4, 4, 0, 0]}
              maxBarSize={40}
            />
            <Bar
              dataKey="expenses"
              fill="#d1d5db"
              radius={[4, 4, 0, 0]}
              maxBarSize={40}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default FinStats;
