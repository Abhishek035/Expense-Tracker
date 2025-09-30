import React from "react";
import { Grid, Title, Button, TextInput, Group, rem } from "@mantine/core";
import { IconPlus, IconSearch, IconFilter, IconChevronDown } from "@tabler/icons-react";
import classes from "./CreditHeader.module.css";

export function CreditHeader({ onAddNew, onSearchChange }) {
  return (
    <header className={classes.header}>
      <Grid align="center" gutter="md">
        {/* Title */}
        <Grid.Col span={{ base: 12, sm: "auto" }}>
          <Title order={2} className={classes.title}>
            Credit Cards
          </Title>
        </Grid.Col>

        {/* Action Buttons */}
        <Grid.Col span={{ base: 12, sm: "auto" }} className={classes.actions}>
          <Group justify="flex-end">
            <Button
              variant="default"
              leftSection={<IconFilter size={16} />}
              rightSection={<IconChevronDown size={16} />}
            >
              Filter
            </Button>
            <Button
              className={classes.addButton}
              leftSection={
                <IconPlus style={{ width: rem(18), height: rem(18) }} />
              }
              onClick={onAddNew}
            >
              Add New
            </Button>
          </Group>
        </Grid.Col>

        {/* Search Bar */}
        <Grid.Col span={12} mt="md">
          <TextInput
            placeholder="Search by nickname, provider, or type..."
            leftSection={
              <IconSearch style={{ width: rem(16), height: rem(16) }} />
            }
            onChange={onSearchChange}
          />
        </Grid.Col>
      </Grid>
    </header>
  );
}
