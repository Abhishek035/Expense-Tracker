import { Text } from '@mantine/core';
import ReminderRow from './ReminderRow';
import classes from '../RemindersPage.module.css';

export default function ReminderGroup({ title, icon: Icon, colorClass, stripeClass, reminders, onAction }) {
  if (!reminders || reminders.length === 0) return null;

  return (
    <div className={classes.floatingCard}>
      <div className={classes.groupHeader}>
        <Icon size={20} className={colorClass} stroke={2.5} />
        <Text fw={600} size="lg" className={colorClass}>{title}</Text>
      </div>
      {reminders.map(r => (
        <ReminderRow key={r.id} r={r} stripeClass={stripeClass} onAction={onAction} />
      ))}
    </div>
  );
}