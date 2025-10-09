import React from 'react';
import { Stack, Center, Text } from '@mantine/core';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { SortableCreditItem } from '../../components/SortableCreditItem';

export function CreditList({ accounts, onEdit, onDelete, expandedAccountId, onToggleExpand }) {
  if (accounts.length === 0) {
    return (
      <Center p="xl" style={{ height: '300px' }}>
        <Text>No credit accounts found. Click "Add New" to get started!</Text>
      </Center>
    );
  }

  return (
    <SortableContext items={accounts.map(a => a.id)} strategy={verticalListSortingStrategy}>
      <Stack gap="md">
        {accounts.map((account) => (
          <SortableCreditItem
            key={account.id}
            id={account.id}
            account={account}
            onEdit={() => onEdit(account)}
            onDelete={() => onDelete(account.id)}
            isExpanded={expandedAccountId === account.id}
            onToggleExpand={() => onToggleExpand(account.id)}
          />
        ))}
      </Stack>
    </SortableContext>
  );
}