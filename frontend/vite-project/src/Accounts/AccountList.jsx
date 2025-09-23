import React from 'react';
import { Stack, Text, Center } from '@mantine/core';
import { AccountItem } from './AccountItem';

export function AccountList({ accounts }) {
  if (accounts.length === 0) {
    return (
      <Center p="xl">
        <Text>No accounts found. Click "Add New" to get started!</Text>
      </Center>
    );
  }

  return (
    <Stack gap="md">
      {accounts.map((account) => (
        <AccountItem key={account.id} account={account} />
      ))}
    </Stack>
  );
}