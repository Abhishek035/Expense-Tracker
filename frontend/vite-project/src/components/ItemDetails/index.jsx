import React from 'react';
import { Grid, Text, Paper } from '@mantine/core';

export function ItemDetails({ account }) {
  // Gracefully handle fields depending on whether it's a Bank Account or Credit Card
  const providerName = account.bankName || account.provider || 'N/A';
  const typeLabel = account.type || account.accountType || 'N/A';
  
  // Credit page uses 'amount', Accounts page uses 'balance'
  const displayBalance = account.balance !== undefined ? account.balance : account.amount;

  return (
    <Paper p="md" bg="var(--mantine-color-gray-0)" radius="md" mt="sm">
      <Grid>
        <Grid.Col span={{ base: 12, sm: 6 }}>
          <Text size="xs" c="dimmed" tt="uppercase" fw={600} mb={4}>Bank / Provider</Text>
          <Text size="sm" fw={500} c="dark.9">{providerName}</Text>
        </Grid.Col>
        
        <Grid.Col span={{ base: 12, sm: 6 }}>
          <Text size="xs" c="dimmed" tt="uppercase" fw={600} mb={4}>Account Type</Text>
          <Text size="sm" fw={500} c="dark.9" tt="capitalize">{typeLabel}</Text>
        </Grid.Col>
        
        <Grid.Col span={{ base: 12, sm: 6 }}>
          <Text size="xs" c="dimmed" tt="uppercase" fw={600} mb={4}>Current Balance / Outstanding</Text>
          <Text size="sm" fw={600} c="primary.7">₹{displayBalance?.toLocaleString('en-IN') || 0}</Text>
        </Grid.Col>
        
        <Grid.Col span={{ base: 12, sm: 6 }}>
          <Text size="xs" c="dimmed" tt="uppercase" fw={600} mb={4}>Status</Text>
          <Text size="sm" fw={500} c="dark.9" tt="capitalize">{account.status || 'Active'}</Text>
        </Grid.Col>

        {/* --- CREDIT CARD SPECIFIC FIELDS --- */}
        {account.creditLimit && (
          <Grid.Col span={{ base: 12, sm: 6 }}>
            <Text size="xs" c="dimmed" tt="uppercase" fw={600} mb={4}>Credit Limit</Text>
            <Text size="sm" fw={500} c="dark.9">₹{account.creditLimit?.toLocaleString('en-IN')}</Text>
          </Grid.Col>
        )}
        
        {account.dueDate && (
          <Grid.Col span={{ base: 12, sm: 6 }}>
            <Text size="xs" c="dimmed" tt="uppercase" fw={600} mb={4}>Due Date</Text>
            <Text size="sm" fw={500} c="dark.9">Day {account.dueDate} of the month</Text>
          </Grid.Col>
        )}

      </Grid>
    </Paper>
  );
}