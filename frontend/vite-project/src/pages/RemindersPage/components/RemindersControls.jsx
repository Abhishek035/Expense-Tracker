import { TextInput, Button, ActionIcon } from '@mantine/core';
import { IconSearch, IconFilter, IconPlus } from '@tabler/icons-react';
import classes from '../RemindersPage.module.css';

export default function RemindersControls({ search, setSearch }) {
  return (
    <div className={classes.controlsBar}>
      <TextInput 
        placeholder="Search by description, category, or account..." 
        leftSection={<IconSearch size={16} />}
        value={search}
        onChange={(e) => setSearch(e.currentTarget.value)}
        flex={1}
        size="md"
      />
      <ActionIcon variant="default" size="42px">
        <IconFilter size={20} />
      </ActionIcon>
      <Button color="primary" size="md" leftSection={<IconPlus size={16} />}>
        Add Reminder
      </Button>
    </div>
  );
}