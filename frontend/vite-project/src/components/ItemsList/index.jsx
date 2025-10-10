import React from 'react';
import { Stack, Text, Center } from '@mantine/core';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';

export function ItemsList({ items, renderItem, noItemsMessage }) {
  if (!items || items.length === 0) {
    return (
      <Center p="xl" style={{ height: '200px' }}>
        <Text>{noItemsMessage}</Text>
      </Center>
    );
  }

  return (
    <SortableContext items={items.map((item) => item.id)} strategy={verticalListSortingStrategy}>
      <Stack gap="md">
        {items.map((item) => renderItem(item))}
      </Stack>
    </SortableContext>
  );
}