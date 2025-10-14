import React, { useState, useMemo } from "react";
import { Text, Group, SegmentedControl, Box, Title } from "@mantine/core";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import classes from "./index.module.css";

const timeframeOptions = ["1M", "6M", "1Y", "Max"];

export function ItemDetails({ account }) {
  const [timeframe, setTimeframe] = useState("1M");

  // Chart data logic only runs if there are transactions
  const chartData = useMemo(() => {
    if (!account.transactions) return null;

    const now = new Date();
    let startDate = new Date(account.creationDate);

    // Timeframe filtering logic...
    switch (timeframe) {
        case "1M": startDate = new Date(now.setMonth(now.getMonth() - 1)); break;
        case "6M": startDate = new Date(now.setMonth(now.getMonth() - 6)); break;
        case "1Y": startDate = new Date(now.setFullYear(now.getFullYear() - 1)); break;
        case "Max": default: break;
    }

    return account.transactions
      .filter((t) => new Date(t.date) >= startDate)
      .map((t) => ({
        ...t,
        formattedDate: new Date(t.date).toLocaleDateString("en-US", { month: "short", day: "numeric" }),
      }));
  }, [account.transactions, account.creationDate, timeframe]);

  // Handle case where there are no transactions
  if (!account.transactions) {
    return (
      <Box mt="lg" className={classes.detailsContainer}>
        <Text c="dimmed">No transaction history available for this account type.</Text>
      </Box>
    );
  }

  const lastTransaction = account.transactions.length > 0 ? account.transactions[account.transactions.length - 1] : { amount: "N/A", date: "N/A" };
  const tickInterval = Math.max(1, Math.floor(chartData.length / 7));

  return (
    <Box mt="lg" className={classes.detailsContainer}>
      <Group justify="space-between" align="flex-start" className={classes.infoGroup}>
        <div>
          <Text fz="sm">{account.amount ? "Due amount:" : "Current balance:"}</Text>
          <Text fw={600} fz="lg">₹{account.amount || account.balance}</Text>
          <Text fz="sm" mt="sm">Recent transaction:</Text>
          <Text fw={600} fz="lg">₹{lastTransaction.amount} on {new Date(lastTransaction.date).toLocaleDateString()}</Text>
        </div>
        <SegmentedControl value={timeframe} onChange={setTimeframe} data={timeframeOptions} color="primary" />
      </Group>

      <Box className={classes.chartWrapper}>
        <ResponsiveContainer width="100%" height={250}>
          <LineChart data={chartData} margin={{ top: 5, right: 20, left: -10, bottom: 20 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="var(--mantine-color-gray-2)" />
            <XAxis dataKey="formattedDate" stroke="var(--mantine-color-dimmed)" tick={{ fontSize: 12 }} interval={tickInterval} angle={-30} textAnchor="end" height={50} />
            <YAxis stroke="var(--mantine-color-dimmed)" tick={{ fontSize: 12 }} />
            <Tooltip />
            <Line type="monotone" dataKey="amount" stroke="var(--mantine-color-blue-6)" strokeWidth={2} dot={{ r: 0 }} activeDot={{ r: 4 }} />
          </LineChart>
        </ResponsiveContainer>
      </Box>
    </Box>
  );
}