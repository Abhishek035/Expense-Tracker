import { Box, Flex, Text, Badge, ActionIcon, Tooltip, Group } from '@mantine/core';
import { IconCheck, IconPlayerTrackNext, IconPencil, IconTrash, IconReceipt2, IconWallet } from '@tabler/icons-react';
import classes from '../RemindersPage.module.css';

export default function ReminderRow({ r, stripeClass, onAction }) {
  const d = new Date(r.date);
  const month = d.toLocaleString('default', { month: 'short' });
  const day = d.getDate();

  return (
    <div className={classes.rowContainer}>
      <div className={`${classes.rowStripe} ${stripeClass}`} />
      
      <div className={classes.dateBlock}>
        <Text className={classes.dateMonth}>{month}</Text>
        <Text className={classes.dateDay}>{day}</Text>
      </div>
      
      <div className={classes.rowGrid}>
        {/* Col 1: Description & Recurring Tag */}
        <Box>
          <Text fw={600} size="sm" c="dark.9" mb={2}>{r.description}</Text>
          {r.isRecurring && <Badge size="xs" variant="light" color="gray">Recurring</Badge>}
        </Box>

        {/* Col 2: Category (Unified Icon) */}
        <Flex align="center" gap="sm">
          <div className={classes.iconCircle}>
            <IconReceipt2 size={16} />
          </div>
          <Text size="sm" fw={500} c="dimmed">{r.category}</Text>
        </Flex>

        {/* Col 3: Account */}
        <Flex align="center" gap="sm">
          <ActionIcon variant="transparent" color="gray" size="sm"><IconWallet size={18} /></ActionIcon>
          <Text size="sm" fw={500} c="dimmed">{r.account}</Text>
        </Flex>

        {/* Col 4: Amount */}
        <Text fw={700} size="md" c={r.type === 'income' ? 'primary.7' : 'dark.9'} ta="right">
          {r.type === 'income' ? '+' : '-'}₹{r.amount.toLocaleString()}
        </Text>

        {/* Col 5: Actions (Cleaned up colors) */}
        <Group gap={4} justify="flex-end">
          <Tooltip label="Mark Complete" withArrow>
            <ActionIcon variant="light" color="primary" radius="md" onClick={() => onAction(r.id, 'complete')}>
              <IconCheck size={18} stroke={2.5} />
            </ActionIcon>
          </Tooltip>
          <Tooltip label="Skip Instance" withArrow>
            <ActionIcon variant="subtle" color="gray" radius="md" onClick={() => onAction(r.id, 'skip')}>
              <IconPlayerTrackNext size={18} />
            </ActionIcon>
          </Tooltip>
          <Tooltip label="Edit" withArrow>
            <ActionIcon variant="subtle" color="gray" radius="md" onClick={() => onAction(r.id, 'edit')}>
              <IconPencil size={18} />
            </ActionIcon>
          </Tooltip>
          <Tooltip label="Delete" withArrow>
            <ActionIcon variant="subtle" color="red" radius="md" onClick={() => onAction(r.id, 'delete')}>
              <IconTrash size={18} />
            </ActionIcon>
          </Tooltip>
        </Group>
      </div>
    </div>
  );
}