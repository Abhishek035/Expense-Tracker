import React, { useState, useEffect } from 'react';
import { Box, Text, Title, Button, Grid, Avatar, Loader, Flex } from '@mantine/core';
import { 
  IconSparkles, IconWallet, IconBell, IconCalendarEvent, IconClock, 
  IconChevronRight, IconAlertTriangle, IconCheck, IconCoffee, 
  IconShoppingCart, IconGasStation, IconBriefcase, IconReceipt2, IconHome, IconBolt
} from '@tabler/icons-react';
import { supabase } from '../../supabaseClient'; // <-- IMPORT SUPABASE
import { mockAlerts } from '../../data/mockDashboardData'; // We'll keep alerts mocked until we build the AI/CRON jobs
import classes from './Dashboard.module.css';

// --- HELPER COMPONENT ---
const DashboardCard = ({ icon: Icon, title, children }) => (
  <div className={classes.card}>
    <div className={classes.cardHeader}>
      <div className={classes.cardTitleArea}>
        <Icon size={20} color="var(--mantine-color-primary-6)" />
        <Text fw={600} size="md" c="dark.9">{title}</Text>
      </div>
      <div className={classes.viewAllLink}>
        View all <IconChevronRight size={14} />
      </div>
    </div>
    <div className={classes.cardBody}>
      {children}
    </div>
  </div>
);

// --- DYNAMIC ICONS ---
const getCategoryIcon = (category) => {
  const c = category?.toLowerCase() || '';
  if (c.includes('food') || c.includes('dining') || c.includes('coffee')) return <IconCoffee size={20} />;
  if (c.includes('groceries') || c.includes('shopping')) return <IconShoppingCart size={20} />;
  if (c.includes('transport')) return <IconGasStation size={20} />;
  if (c.includes('salary') || c.includes('freelance') || c.includes('income')) return <IconBriefcase size={20} />;
  if (c.includes('utilit') || c.includes('electric')) return <IconBolt size={20} />;
  if (c.includes('rent') || c.includes('hous')) return <IconHome size={20} />;
  return <IconReceipt2 size={20} />;
};

// --- MAIN DASHBOARD PAGE ---
export default function Dashboard() {
  const [stats, setStats] = useState({ cash: 0, credit: 0 });
  const [recentActivity, setRecentActivity] = useState([]);
  const [upcomingBills, setUpcomingBills] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    setLoading(true);
    try {
      // 1. Fetch Balances
      const { data: accounts } = await supabase.from('accounts').select('type, balance');
      let cash = 0, credit = 0;
      if (accounts) {
        accounts.forEach(acc => {
          if (acc.type === 'credit') credit += Number(acc.balance || 0);
          else cash += Number(acc.balance || 0);
        });
      }
      setStats({ cash, credit });

      // 2. Fetch Recent Activity (Completed Transactions)
      const { data: recent } = await supabase
        .from('transactions')
        .select('*')
        .eq('is_completed', true)
        .order('date', { ascending: false })
        .limit(4);
      if (recent) setRecentActivity(recent);

      // 3. Fetch Upcoming Bills (Reminders / Future transactions)
      const { data: upcoming } = await supabase
        .from('transactions')
        .select('*')
        .eq('is_completed', false)
        .order('date', { ascending: true }) // Ascending so the soonest comes first
        .limit(4);
      if (upcoming) setUpcomingBills(upcoming);

    } catch (err) {
      console.error("Dashboard Fetch Error:", err.message);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateStr) => {
    const d = new Date(dateStr);
    return `${d.toLocaleString('default', { month: 'short' })} ${d.getDate()}, ${d.getFullYear()}`;
  };

  if (loading) return <Flex justify="center" mt="10vh"><Loader color="primary" /></Flex>;

  return (
    <Box p="lg" className={classes.pageWrapper}>
      
      <div className={classes.header}>
        <Box>
          <Title order={2} fw={700} c="dark.9">Good Morning <span role="img" aria-label="wave">👋</span></Title>
          <Text c="dimmed" size="sm" mt={4}>Here is your snapshot for today.</Text>
        </Box>
        <Button color="primary" radius="md" size="md" leftSection={<IconSparkles size={16} />} style={{ boxShadow: '0 4px 14px rgba(0, 144, 160, 0.2)' }}>
          Ask AI Advisor
        </Button>
      </div>

      <Grid gutter="xl">
        
        {/* QUICK WALLET */}
        <Grid.Col span={{ base: 12, lg: 6 }}>
          <DashboardCard icon={IconWallet} title="Quick Wallet">
            <div className={classes.walletContainer}>
              <Box flex={1} ta="center">
                <Text size="sm" c="dimmed" fw={500} mb={8}>Total Available Cash</Text>
                <Text size="2.5rem" fw={700} c="primary.6" lh={1}>₹{stats.cash.toLocaleString('en-IN')}</Text>
              </Box>
              <div className={classes.walletDivider} />
              <Box flex={1} ta="center">
                <Text size="sm" c="dimmed" fw={500} mb={8}>Credit Card Debt</Text>
                <Text size="2.5rem" fw={700} c="red.6" lh={1}>₹{stats.credit.toLocaleString('en-IN')}</Text>
              </Box>
            </div>
          </DashboardCard>
        </Grid.Col>

        {/* ALERTS (Kept static for now) */}
        <Grid.Col span={{ base: 12, lg: 6 }}>
          <DashboardCard icon={IconBell} title="Smart Alerts & Notifications">
            {mockAlerts.map(alert => (
              <div key={alert.id} className={classes.listRow}>
                <div className={classes.listIconWrapper} style={{ backgroundColor: `var(--mantine-color-${alert.color}-6)`, color: 'white' }}>
                  <IconAlertTriangle size={20} />
                </div>
                <Box flex={1} ml="md">
                  <Text size="sm" fw={500} c="dark.9">{alert.message}</Text>
                </Box>
                <Text size="xs" c="dimmed">{alert.time}</Text>
              </div>
            ))}
          </DashboardCard>
        </Grid.Col>

        {/* UPCOMING BILLS */}
        <Grid.Col span={{ base: 12, lg: 6 }}>
          <DashboardCard icon={IconCalendarEvent} title="Upcoming Bills">
            {upcomingBills.length === 0 ? (
              <Text c="dimmed" ta="center" mt="xl">No upcoming bills found.</Text>
            ) : upcomingBills.map(bill => (
              <div key={bill.id} className={classes.listRow}>
                <Avatar color="primary" radius="xl" size="md">{bill.description?.charAt(0) || bill.category?.charAt(0) || 'B'}</Avatar>
                <Box flex={1} ml="md">
                  <Text size="sm" fw={600} c="dark.9">{bill.description || bill.category}</Text>
                  <Text size="xs" c="dimmed" mt={2}>{formatDate(bill.date)}</Text>
                </Box>
                <Text size="sm" fw={600} c="dark.9">₹{Number(bill.amount).toLocaleString('en-IN')}</Text>
              </div>
            ))}
          </DashboardCard>
        </Grid.Col>

        {/* RECENT ACTIVITY */}
        <Grid.Col span={{ base: 12, lg: 6 }}>
          <DashboardCard icon={IconClock} title="Recent Activity">
            {recentActivity.length === 0 ? (
               <Text c="dimmed" ta="center" mt="xl">No recent transactions.</Text>
            ) : recentActivity.map(activity => (
              <div key={activity.id} className={classes.listRow}>
                <div className={classes.listIconWrapper} style={{ backgroundColor: 'var(--mantine-color-gray-1)', color: 'var(--mantine-color-dark-4)' }}>
                  {getCategoryIcon(activity.category)}
                </div>
                <Box flex={1} ml="md">
                  <Text size="sm" fw={600} c="dark.9" truncate maw={180}>{activity.description || activity.category}</Text>
                  <Text size="xs" c="dimmed" mt={2}>{formatDate(activity.date)} • {activity.category}</Text>
                </Box>
                <Text size="sm" fw={700} c={activity.type === 'income' ? 'teal.6' : 'dark.9'}>
                  {activity.type === 'income' ? '+' : '-'}₹{Number(activity.amount).toLocaleString('en-IN')}
                </Text>
              </div>
            ))}
          </DashboardCard>
        </Grid.Col>

      </Grid>
    </Box>
  );
}