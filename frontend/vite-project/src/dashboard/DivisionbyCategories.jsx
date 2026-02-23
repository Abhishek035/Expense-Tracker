import React, { useState } from "react";
import { Pie, PieChart, Cell, Tooltip } from "recharts";
import { ActionIcon, Text, Box, Group, Flex } from "@mantine/core";
import { IconChevronLeft, IconChevronRight } from "@tabler/icons-react";
import styles from "./DivisionbyCategories.module.css";

const incomeData = [
  { name: "Salary", value: 65, color: "#0090A0" },
  { name: "Freelance", value: 20, color: "#33cddb" },
  { name: "Investments", value: 10, color: "#66d9e4" },
  { name: "Other", value: 5, color: "#99e6ed" },
];

const expenseData = [
  { name: "Housing", value: 35, color: "#0090A0" },
  { name: "Food", value: 25, color: "#33cddb" },
  { name: "Transport", value: 15, color: "#66d9e4" },
  { name: "Entertainment", value: 12, color: "#99e6ed" },
  { name: "Utilities", value: 8, color: "#ccf2f6" },
  { name: "Other", value: 5, color: "#e6f9fb" },
];

const getContrastYIQ = (hexcolor) => {
  hexcolor = hexcolor.replace("#", "");
  const r = parseInt(hexcolor.substr(0, 2), 16);
  const g = parseInt(hexcolor.substr(2, 2), 16);
  const b = parseInt(hexcolor.substr(4, 2), 16);
  const yiq = (r * 299 + g * 587 + b * 114) / 1000;
  return yiq >= 128 ? "black" : "white";
};

const RADIAN = Math.PI / 180;
const renderCustomizedLabel = ({
  cx,
  cy,
  midAngle,
  innerRadius,
  outerRadius,
  percent,
  payload,
}) => {
  const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
  const x = cx + radius * Math.cos(-(midAngle ?? 0) * RADIAN);
  const y = cy + radius * Math.sin(-(midAngle ?? 0) * RADIAN);

  const textColor = getContrastYIQ(payload.color);

  return (
    <text
      x={x}
      y={y}
      fill={textColor}
      textAnchor={"middle"}
      dominantBaseline="central"
    >
      {`${((percent ?? 1) * 100).toFixed(0)}%`}
    </text>
  );
};

const CustomTooltip = ({ active, payload }) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    return (
      <div className="bg-primary text-white p-3 rounded-lg shadow-lg">
        <p className="text-var(--color-primary)">{`${data.name} ${data.value}%`}</p>
      </div>
    );
  }
  return null;
};

const DivisionbyCategories = () => {
  const [activeTab, setActiveTab] = useState("income");

  const currentData = activeTab === "income" ? incomeData : expenseData;
  const title =
    activeTab === "income" ? "Income Breakdown" : "Expense Breakdown";

  return (
    <Box className={styles.container}>
      {/* Header with navigation */}
      <Group justify="space-between" className={styles.header}>
        <ActionIcon
          variant="subtle"
          color="primary"
          onClick={() =>
            setActiveTab(activeTab === "income" ? "expense" : "income")
          }
        >
          <IconChevronLeft size={16} />
        </ActionIcon>

        <Text className={styles.title}>{title}</Text>

        <ActionIcon
          variant="subtle"
          color="primary"
          onClick={() =>
            setActiveTab(activeTab === "income" ? "expense" : "income")
          }
        >
          <IconChevronRight size={16} />
        </ActionIcon>
      </Group>

      {/* Chart container */}
      <Box className={styles.chartContainer}>
        <PieChart width={300} height={300}>
          <Pie
            data={currentData}
            cx="50%"
            cy="50%"
            labelLine={false}
            label={renderCustomizedLabel}
            innerRadius={75}
            outerRadius={130}
            paddingAngle={2}
            dataKey="value"
          >
            {currentData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.color} />
            ))}
          </Pie>
          {/* Add the Tooltip component here */}
          <Tooltip content={<CustomTooltip />} />
        </PieChart>
      </Box>

      {/* Categories legend - horizontal layout */}
      <Box className={styles.legendContainer}>
        <Flex wrap="wrap" gap="xs" justify="center">
          {currentData.map((item, index) => (
            <Group key={index} gap={6} className={styles.legendItem}>
              <Box
                className={styles.colorDot}
                style={{ backgroundColor: item.color }}
              />
              <Text className={styles.legendText}>{item.name}</Text>
              <Text className={styles.legendValue}>{item.value}%</Text>
            </Group>
          ))}
        </Flex>
      </Box>
    </Box>
  );
};

export default DivisionbyCategories;
