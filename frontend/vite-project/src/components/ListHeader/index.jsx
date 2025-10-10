import React from 'react';
import { Group, Title, Button, TextInput, Grid, rem } from '@mantine/core';
import { IconPlus, IconSearch } from '@tabler/icons-react';
import classes from './index.module.css';

export function ListHeader({ title, onAddNew, onSearchChange, filterControls }) {
  return (
    <header className={classes.header}>
      <Grid align="flex-end" gutter="md">
        <Grid.Col span={{ base: 12, md: 6 }}>
          <Title order={2} className={classes.title}>
            {title}
          </Title>
        </Grid.Col>

        <Grid.Col span={{ base: 12, md: 6 }}>
          <Group justify="flex-end">
            {filterControls}
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
    </header>
  );
}