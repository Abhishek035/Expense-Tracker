import React, { useState, useMemo } from "react";
import { Text, Group, SegmentedControl, Box } from "@mantine/core";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import classes from "./CreditItemDetails.module.css";

const timeframeOptions = ["5D", "1M", "6M", "1Y", "5Y", "Max"];

export function CreditItemDetails({ account }) {
  const [timeframe, setTimeframe] = useState("1M");

  const chartData = useMemo(() => {
    const now = new Date();
    let startDate = new Date(account.creationDate);

    switch (timeframe) {
      case "5D":
        startDate = new Date(now.setDate(now.getDate() - 5));
        break;
      case "1M":
        startDate = new Date(now.setMonth(now.getMonth() - 1));
        break;
      case "6M":
        startDate = new Date(now.setMonth(now.getMonth() - 6));
        break;
      case "1Y":
        startDate = new Date(now.setFullYear(now.getFullYear() - 1));
        break;
      case "5Y":
        startDate = new Date(now.setFullYear(now.getFullYear() - 5));
        break;
      case "Max":
      default:
        // startDate is already creationDate
        break;
    }

    return account.transactions
      .filter((t) => new Date(t.date) >= startDate)
      .map((t) => ({
        ...t,
        formattedDate: new Date(t.date).toLocaleDateString("en-US", {
          month: "short",
          day: "numeric",
        }),
      }));
  }, [account.transactions, account.creationDate, timeframe]);

  const lastTransaction =
    account.transactions.length > 0
      ? account.transactions[account.transactions.length - 1]
      : { amount: "N/A", date: "N/A" };

  // Dynamic interval for X-axis ticks to prevent congestion
  const tickInterval = Math.max(1, Math.floor(chartData.length / 7));

  return (
    <Box mt="lg" className={classes.detailsContainer}>
      <Group
        justify="space-between"
        align="flex-start"
        className={classes.infoGroup}
      >
        <div>
          <Text fz="sm">Due amount:</Text>
          <Text fw={600} fz="lg">
            ₹{account.amount}
          </Text>
          <Text fz="sm" mt="sm">
            Recent transaction:
          </Text>
          <Text fw={600} fz="lg">
            ₹{lastTransaction.amount} on{" "}
            {new Date(lastTransaction.date).toLocaleDateString()}
          </Text>
        </div>
        <SegmentedControl
          value={timeframe}
          onChange={setTimeframe}
          data={timeframeOptions}
          color="primary"
        />
      </Group>

      <Box className={classes.chartWrapper}>
        <ResponsiveContainer width="100%" height={250}>
          <LineChart
            data={chartData}
            margin={{ top: 5, right: 20, left: -10, bottom: 20 }}
          >
            <CartesianGrid
              strokeDasharray="3 3"
              stroke="var(--color-background2)"
            />
            <XAxis
              dataKey="formattedDate"
              stroke="var(--color-text)"
              tick={{ fontSize: 12 }}
              interval={tickInterval}
              angle={-30}
              textAnchor="end"
              height={50}
            />
            <YAxis stroke="var(--color-text)" tick={{ fontSize: 12 }} />
            <Tooltip />
            <Line
              type="monotone"
              dataKey="amount"
              stroke="var(--color-primary)"
              strokeWidth={2}
              dot={{ r: 0 }}
              activeDot={{ r: 4 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </Box>
    </Box>
  );
}
