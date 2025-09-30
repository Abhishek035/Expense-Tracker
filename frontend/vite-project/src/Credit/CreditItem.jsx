import React from 'react';
import { Card, Text, Group, Badge, ActionIcon } from '@mantine/core';
import { IconCreditCard, IconDotsVertical, IconEye } from '@tabler/icons-react';
import classes from './CreditItem.module.css';

export function CreditItem({ account }) {
  return (
    <Card withBorder radius="md" className={classes.card}>
      <Group justify="space-between">
        <Group align="flex-start">
          <div className={classes.iconWrapper}>
            <IconCreditCard size={28} />
          </div>
          <div>
            <Text fz="lg" fw={600} className={classes.nickname}>
              {account.nickname}
            </Text>
            <Text fz="sm" c="dimmed">
              {account.provider} {account.last4 ? `• • • • ${account.last4}` : ''}
            </Text>
            <Group gap="xs" mt="sm">
              <Badge variant="light" color="primary" size="sm" radius="sm">
                {account.accountType}
              </Badge>
              {account.network && (
                <Badge variant="light" color="gray" size="sm" radius="sm">
                  {account.network}
                </Badge>
              )}
            </Group>
          </div>
        </Group>

        <Group gap="xs">
          <ActionIcon variant="subtle" color="gray" aria-label="View Details">
            <IconEye size={18} />
          </ActionIcon>
          <ActionIcon variant="subtle" color="gray" aria-label="More options">
            <IconDotsVertical size={18} />
          </ActionIcon>
        </Group>
      </Group>
    </Card>
  );
}