import React from 'react';
import { Stack, Center, Text } from '@mantine/core';
import { CreditItem } from './CreditItem';

export function CreditList({ accounts }) {
  if (accounts.length === 0) {
    return (
      <Center p="xl" style={{ height: '300px' }}>
        <Text>No credit accounts found. Click "Add New" to get started!</Text>
      </Center>
    );
  }

  return (
    <Stack gap="md">
      {accounts.map((account) => (
        <CreditItem key={account.id} account={account} />
      ))}
    </Stack>
  );
}