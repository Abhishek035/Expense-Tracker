import React, { useState } from 'react';
import { Box, Flex, Text, Stack, ScrollArea, Badge, Checkbox, Button, Divider, Collapse, ActionIcon } from '@mantine/core';
import { IconPlus, IconChevronDown, IconChevronUp } from '@tabler/icons-react';
import { formatDate } from '../../utils/calendarUtils';
import classes from './TransactionSidePanel.module.css';
// REMOVE the mockAccounts import!

// 1. Pass accountsList into the Card
const TransactionCard = ({ t, showCheckbox, onToggleCompletion, accountsList }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const isChecked = !!t.isCompleted;

  // 2. Use the live accountsList to find the real bank name!
  const accountLabel = accountsList?.find(a => a.value === (t.accountId || t.account_id))?.label || 'Unknown Account';

  return (
    <Box className={`
      ${showCheckbox ? classes.reminderCard : classes.transactionCard} 
      ${showCheckbox && isChecked ? classes.strikethrough : ''}
    `}>
      <Flex gap="sm" align="center" p="xs">
        {showCheckbox && (
          <Checkbox 
            color="primary" 
            checked={isChecked}
            onChange={() => onToggleCompletion(t.id)}
            title="Mark as Paid"
          />
        )}
        
        <Box flex={1} style={{ overflow: 'hidden' }}>
          <Flex align="center" gap="xs">
            <Text size="sm" fw={500} truncate td={showCheckbox && isChecked ? 'line-through' : 'none'}>
              {t.category}
            </Text>
            {showCheckbox && !isChecked && (
              <Badge size="xs" color={t.isRecurring ? 'blue' : 'orange'} variant="light">
                {t.isRecurring ? 'Recurring' : 'Pending'}
              </Badge>
            )}
          </Flex>
          {/* Shows the actual Bank Name now instead of UUID */}
          <Text size="xs" c="dimmed" truncate td={showCheckbox && isChecked ? 'line-through' : 'none'}>
            {t.description || accountLabel}
          </Text>
        </Box>
        
        <Text size="sm" fw={600} c={t.type === 'income' ? 'teal.7' : 'red.7'} td={showCheckbox && isChecked ? 'line-through' : 'none'}>
          {t.type === 'income' ? '+' : '-'}₹{Number(t.amount).toLocaleString('en-IN')}
        </Text>

        <ActionIcon variant="subtle" color="gray" size="sm" className={classes.chevronIcon} onClick={() => setIsExpanded((prev) => !prev)}>
          {isExpanded ? <IconChevronUp size={16} /> : <IconChevronDown size={16} />}
        </ActionIcon>
      </Flex>

      <Collapse in={isExpanded}>
        <Box p="xs" className={classes.detailsBox}>
          <Flex justify="space-between" mb={4}>
            <Text size="xs" c="dimmed">Account:</Text>
            <Text size="xs" fw={500}>{accountLabel}</Text> 
          </Flex>
          <Flex justify="space-between" mb={4}>
            <Text size="xs" c="dimmed">Category:</Text>
            <Text size="xs" fw={500}>{t.category}</Text>
          </Flex>
          <Flex justify="space-between" mb={4}>
            <Text size="xs" c="dimmed">Type:</Text>
            <Text size="xs" fw={500} tt="capitalize">{t.type}</Text>
          </Flex>
          {t.description && (
            <Flex justify="space-between">
              <Text size="xs" c="dimmed">Note:</Text>
              <Text size="xs" fw={500} truncate maw={150} ta="right">{t.description}</Text>
            </Flex>
          )}
        </Box>
      </Collapse>
    </Box>
  );
};

export default function TransactionSidePanel({ selectedDate, transactions, onToggleCompletion, onOpenAddModal, accountsList  }) {
  const dayTransactions = transactions.filter(t => formatDate(new Date(t.date)) === formatDate(selectedDate));
  
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const completed = [];
  const pending = [];
  const recurring = [];

  dayTransactions.forEach(t => {
    const txDate = new Date(t.date);
    txDate.setHours(0, 0, 0, 0);
    const isFuture = txDate > today;

    // RULE 1: Does it belong in the Completed section?
    // Yes, if the date is today/past, OR if it's a future date that was checked off.
    if (!isFuture || t.isCompleted) {
      completed.push(t);
    } 

    // RULE 2: Does it belong in the Pending or Recurring sections?
    // Yes, if it's a future date. (Even if it is completed, we want to keep it here so we can see it struck out).
    if (isFuture) {
      if (t.isRecurring) {
        recurring.push(t);
      } else {
        pending.push(t);
      }
    }
  });

  const formattedDate = selectedDate.toLocaleDateString('default', { weekday: 'long', month: 'long', day: 'numeric' });

  return (
    <aside className={classes.sidePanel}>
      <Box p="md" bg="primary.0" className={classes.header}>
        <Text fw={600} size="lg" c="primary.8">{formattedDate}</Text>
      </Box>

      <ScrollArea style={{ flex: 1 }} p="md">
        <Stack gap="xl">
          
          <Box>
            <Text size="sm" fw={600} c="dimmed" mb="sm">Completed</Text>
            <Stack gap="sm">
              {completed.length === 0 && <Text size="sm" c="dimmed">No completed transactions.</Text>}
              {completed.map(t => <TransactionCard key={`comp-${t.id}`} t={t} showCheckbox={false} onToggleCompletion={onToggleCompletion} accountsList={accountsList}/>)}
            </Stack>
          </Box>

          <Divider />

          <Box>
            <Text size="sm" fw={600} c="dimmed" mb="sm">Pending Reminders</Text>
            <Stack gap="sm">
              {pending.length === 0 && <Text size="sm" c="dimmed">No pending reminders.</Text>}
              {pending.map(t => <TransactionCard key={`pend-${t.id}`} t={t} showCheckbox={true} onToggleCompletion={onToggleCompletion} />)}
            </Stack>
          </Box>

          <Divider />

          <Box>
            <Text size="sm" fw={600} c="dimmed" mb="sm">Recurring</Text>
            <Stack gap="sm">
              {recurring.length === 0 && <Text size="sm" c="dimmed">No upcoming recurring bills.</Text>}
              {recurring.map(t => <TransactionCard key={`rec-${t.id}`} t={t} showCheckbox={true} onToggleCompletion={onToggleCompletion} />)}
            </Stack>
          </Box>
          
        </Stack>
      </ScrollArea>

      <Box p="md" className={classes.footer}>
        <Button fullWidth color="primary" leftSection={<IconPlus size={16} />} onClick={onOpenAddModal}>
          Add Transaction
        </Button>
      </Box>
    </aside>
  );
}