import { Paper, Flex, Text, Title, Select, Divider, Box } from '@mantine/core';
import classes from '../RemindersPage.module.css';

export default function RemindersSummary({ summary, timeframe, setTimeframe }) {
  return (
    <div className={classes.floatingCard}>
      <div className={classes.summaryHeader}>
        <Title order={3} fw={600}>
          Upcoming Reminders
        </Title>
        <Select 
          data={[
            { value: '7', label: 'Next 7 Days' }, 
            { value: '14', label: 'Next 14 Days' }, 
            { value: '30', label: 'Next 30 Days' }
          ]}
          value={timeframe}
          onChange={setTimeframe}
          size="sm"
          w={150}
        />
      </div>
      <div className={classes.summaryBody}>
        <Box className={classes.summaryCol} style={{ borderLeft: '4px solid var(--mantine-color-primary-5)' }}>
          <Text size="sm" c="dimmed" fw={600} mb={4} tt="uppercase">Upcoming Income</Text>
          <Text size="2rem" fw={700} c="primary.7" lh={1}>₹{summary.income.toLocaleString()}</Text>
        </Box>
        <Divider orientation="vertical" />
        <Box className={classes.summaryCol} style={{ borderLeft: '4px solid var(--mantine-color-red-5)' }}>
          <Text size="sm" c="dimmed" fw={600} mb={4} tt="uppercase">Upcoming Bills</Text>
          <Text size="2rem" fw={700} c="red.7" lh={1}>₹{summary.bills.toLocaleString()}</Text>
        </Box>
      </div>
    </div>
  );
}