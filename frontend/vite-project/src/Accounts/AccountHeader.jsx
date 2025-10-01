import React from 'react';
import { Group, Title, Button, TextInput, Grid, Menu, rem, MultiSelect, Stack } from '@mantine/core';
import { IconPlus, IconSearch, IconFilter, IconChevronDown } from '@tabler/icons-react';
import classes from './AccountHeader.module.css';

// Data for the MultiSelect components
const accountTypeData = ["Bank Account", "Wallet"];
const archiveStatusData = [
  { value: 'active', label: 'Active' },
  { value: 'archived', label: 'Archived' },
];

export function AccountHeader({
  onAddNew,
  onSearchChange,
  selectedAccountTypes,
  onAccountTypesChange,
  selectedArchiveStatus,
  onArchiveStatusChange,
}) {
  return (
    <div className={classes.header}>
      <Grid align="flex-end" gutter="md">
        <Grid.Col span={{ base: 12, md: 6 }}>
          <Title order={2} className={classes.title}>
            All Accounts
          </Title>
        </Grid.Col>

        <Grid.Col span={{ base: 12, md: 6 }}>
          <Group justify="flex-end">
            <Menu shadow="md" width={250} closeOnItemClick={false} position="bottom-end">
              <Menu.Target>
                <Button
                  variant="default"
                  leftSection={<IconFilter size={16} />}
                  rightSection={<IconChevronDown size={16} />}
                >
                  Filter
                </Button>
              </Menu.Target>
              <Menu.Dropdown>
                <Stack p="xs" gap="xs">
                  <MultiSelect
                    label="Account type"
                    data={accountTypeData}
                    value={selectedAccountTypes}
                    onChange={onAccountTypesChange}
                    placeholder="Filter by type"
                    onClick={(e) => e.stopPropagation()} // Prevent menu close on click
                    clearable
                  />
                  <MultiSelect
                    label="Archive status"
                    data={archiveStatusData}
                    value={selectedArchiveStatus}
                    onChange={onArchiveStatusChange}
                    placeholder="Filter by status"
                    onClick={(e) => e.stopPropagation()} // Prevent menu close on click
                    clearable
                  />
                </Stack>
              </Menu.Dropdown>
            </Menu>
            <Button leftSection={<IconPlus size={18} />} onClick={onAddNew}>
              Add New
            </Button>
          </Group>
        </Grid.Col>

        <Grid.Col span={12} mt="md">
          <TextInput
            placeholder="Search by nickname, bank, or type..."
            leftSection={<IconSearch style={{ width: rem(16), height: rem(16) }} />}
            onChange={onSearchChange}
          />
        </Grid.Col>
      </Grid>
    </div>
  );
}