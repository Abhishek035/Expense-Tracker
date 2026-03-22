import { Box, Flex, Text, Stack, ScrollArea, Badge, Checkbox, Button } from '@mantine/core';
import { IconPlus } from '@tabler/icons-react';
import { formatDate } from '../../utils/calendarUtils';
import classes from './TransactionSidePanel.module.css';

export default function TransactionSidePanel({ selectedDate, transactions }) {
  const dayTransactions = transactions.filter(t => formatDate(new Date(t.date)) === formatDate(selectedDate));
  
  const completed = dayTransactions.filter(t => !t.isPending);
  const pending = dayTransactions.filter(t => t.isPending || t.isRecurring);

  const formattedDate = selectedDate.toLocaleDateString('default', { weekday: 'long', month: 'long', day: 'numeric' });

  return (
    <aside className={classes.sidePanel}>
      <Box p="md" bg="primary.0" className={classes.header}>
        <Text fw={600} size="lg" c="primary.8">{formattedDate}</Text>
      </Box>

      <ScrollArea style={{ flex: 1 }} p="md">
        <Text size="sm" fw={600} c="dimmed" mb="sm">Completed</Text>
        <Stack gap="sm" mb="xl">
          {completed.length === 0 && <Text size="sm" c="dimmed">No completed transactions.</Text>}
          {completed.map(t => (
            <Flex key={t.id} justify="space-between" align="center" p="xs" className={classes.transactionCard}>
              <Box>
                <Text size="sm" fw={500}>{t.category}</Text>
                <Text size="xs" c="dimmed">{t.description}</Text>
              </Box>
              <Text size="sm" fw={600} c={t.type === 'income' ? 'teal.7' : 'red.7'}>
                {t.type === 'income' ? '+' : '-'}₹{t.amount}
              </Text>
            </Flex>
          ))}
        </Stack>

        <Text size="sm" fw={600} c="dimmed" mb="sm">Upcoming / Pending</Text>
        <Stack gap="sm">
          {pending.length === 0 && <Text size="sm" c="dimmed">No pending transactions.</Text>}
          {pending.map(t => (
            <Flex key={t.id} gap="sm" align="center" p="xs" className={classes.pendingCard}>
              <Checkbox color="primary" title="Mark as Paid" aria-label={`Mark ${t.category} as paid`} />
              <Box flex={1}>
                <Flex align="center" gap="xs">
                  <Text size="sm" fw={500}>{t.category}</Text>
                  <Badge size="xs" color="gray" variant="light">Upcoming</Badge>
                </Flex>
                <Text size="xs" c="dimmed">{t.description}</Text>
              </Box>
              <Text size="sm" fw={600} c={t.type === 'income' ? 'teal.7' : 'red.7'}>₹{t.amount}</Text>
            </Flex>
          ))}
        </Stack>
      </ScrollArea>

      <Box p="md" className={classes.footer}>
        <Button fullWidth color="primary" leftSection={<IconPlus size={16} />}>
          Add Transaction
        </Button>
      </Box>
    </aside>
  );
}