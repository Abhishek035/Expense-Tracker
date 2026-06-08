import React, { useState, useMemo } from 'react';
import { Box } from '@mantine/core';
import { IconAlertCircle, IconClock, IconCalendarEvent } from '@tabler/icons-react';

import RemindersSummary from './components/RemindersSummary';
import RemindersControls from './components/RemindersControls';
import ReminderGroup from './components/ReminderGroup';

import { mockReminders } from '../../data/mockReminders';
import classes from './RemindersPage.module.css';

export default function RemindersPage() {
  const [reminders, setReminders] = useState(mockReminders);
  const [search, setSearch] = useState('');
  const [timeframe, setTimeframe] = useState('14');

  // --- Logic Helpers ---
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const getDaysDiff = (dateObj) => {
    const d = new Date(dateObj);
    d.setHours(0, 0, 0, 0);
    return Math.round((d - today) / (1000 * 60 * 60 * 24));
  };

  // --- Filtering & Grouping ---
  const filteredReminders = useMemo(() => {
    return reminders.filter(r => 
      r.description.toLowerCase().includes(search.toLowerCase()) ||
      r.category.toLowerCase().includes(search.toLowerCase()) ||
      r.account.toLowerCase().includes(search.toLowerCase())
    );
  }, [reminders, search]);

  const groups = useMemo(() => {
    const g = { overdue: [], next7: [], laterThisMonth: [], future: [] };
    filteredReminders.forEach(r => {
      const diff = getDaysDiff(r.date);
      if (diff < 0) g.overdue.push(r);
      else if (diff <= 7) g.next7.push(r);
      else if (diff <= 30) g.laterThisMonth.push(r);
      else g.future.push(r);
    });

    Object.keys(g).forEach(key => g[key].sort((a, b) => new Date(a.date) - new Date(b.date)));
    return g;
  }, [filteredReminders]);

  const summary = useMemo(() => {
    let income = 50000; // Static mock
    let bills = 0;
    const daysLimit = parseInt(timeframe, 10);

    reminders.forEach(r => {
      const diff = getDaysDiff(r.date);
      if (diff >= 0 && diff <= daysLimit) {
        if (r.type === 'expense') bills += r.amount;
      }
    });
    return { income, bills };
  }, [reminders, timeframe]);

  // --- Handlers ---
  const handleAction = (id, actionType) => {
    // Basic mock handling: remove item on complete, skip, or delete
    if (actionType !== 'edit') {
      setReminders(prev => prev.filter(r => r.id !== id));
    }
  };

  return (
    <Box p="md" className={classes.pageWrapper}>
      
      <RemindersSummary 
        summary={summary} 
        timeframe={timeframe} 
        setTimeframe={setTimeframe} 
      />

      <RemindersControls 
        search={search} 
        setSearch={setSearch} 
      />

      <ReminderGroup 
        title="Overdue" 
        icon={IconAlertCircle} 
        colorClass="text-red-600" /* Utilizing standard Mantine/Tailwind color concepts */
        stripeClass={classes.stripeRed}
        reminders={groups.overdue}
        onAction={handleAction}
      />

      <ReminderGroup 
        title="Due in 7 Days" 
        icon={IconClock} 
        style={{ color: 'var(--mantine-color-primary-6)' }}
        stripeClass={classes.stripePrimary}
        reminders={groups.next7}
        onAction={handleAction}
      />

      <ReminderGroup 
        title="Later this Month" 
        icon={IconCalendarEvent} 
        style={{ color: 'var(--mantine-color-dark-4)' }}
        stripeClass={classes.stripeGray}
        reminders={groups.laterThisMonth}
        onAction={handleAction}
      />

    </Box>
  );
}