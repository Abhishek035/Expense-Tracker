import { Box, Text, Flex, Divider, Stack } from '@mantine/core';
import classes from './CalendarSidebar.module.css';

export default function CalendarSidebar({ summaries }) {
  const { monthlyIncome, monthlyExpense, weeklyIncome, weeklyExpense } = summaries;
  const monthlyNet = monthlyIncome - monthlyExpense;
  const weeklyNet = weeklyIncome - weeklyExpense;

  return (
    <aside className={classes.sidebar}>
      <Stack gap="md">
        <Box className={classes.summaryBox}>
          <Text fw={600} mb="sm">Monthly Summary</Text>
          <Flex justify="space-between" mb={4}>
            <Text size="sm">Income</Text>
            <Text size="sm" c="teal.7" fw={600}>₹{monthlyIncome.toLocaleString()}</Text>
          </Flex>
          <Flex justify="space-between" mb={8}>
            <Text size="sm">Expenses</Text>
            <Text size="sm" c="red.7" fw={600}>₹{monthlyExpense.toLocaleString()}</Text>
          </Flex>
          <Divider my="xs" />
          <Flex justify="space-between">
            <Text size="sm" fw={600}>Net</Text>
            <Text size="sm" fw={600} c={monthlyNet >= 0 ? "teal.7" : "red.7"}>
              {monthlyNet > 0 ? '+' : ''}₹{monthlyNet.toLocaleString()}
            </Text>
          </Flex>
        </Box>

        <Box className={classes.summaryBox}>
          <Text fw={600} mb="sm">Weekly Summary</Text>
          <Text size="xs" c="dimmed" mb="xs">Based on selected date</Text>
          <Flex justify="space-between" mb={4}>
            <Text size="sm">Income</Text>
            <Text size="sm" c="teal.7" fw={600}>₹{weeklyIncome.toLocaleString()}</Text>
          </Flex>
          <Flex justify="space-between" mb={8}>
            <Text size="sm">Expenses</Text>
            <Text size="sm" c="red.7" fw={600}>₹{weeklyExpense.toLocaleString()}</Text>
          </Flex>
          <Divider my="xs" />
          <Flex justify="space-between">
            <Text size="sm" fw={600}>Net</Text>
            <Text size="sm" fw={600} c={weeklyNet >= 0 ? "teal.7" : "red.7"}>
              {weeklyNet > 0 ? '+' : ''}₹{weeklyNet.toLocaleString()}
            </Text>
          </Flex>
        </Box>
      </Stack>
    </aside>
  );
}