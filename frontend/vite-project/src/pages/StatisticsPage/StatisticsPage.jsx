import React, { useState } from 'react';
import { Box, Flex, Text, Title, Select, Grid, Group, ActionIcon, Progress, Badge } from '@mantine/core';
import { DonutChart, BarChart, AreaChart } from '@mantine/charts';
import { IconArrowUpRight, IconArrowDownRight, IconChevronRight } from '@tabler/icons-react';
import * as TablerIcons from '@tabler/icons-react';
import { 
  kpiData, expensesByCategory, incomeVsExpenses, wealthGrowth, 
  largestTransactions, budgetHealth, incomeBreakdown 
} from '../../data/mockStatsData';
import classes from './StatisticsPage.module.css';

// --- SUB-COMPONENTS ---

const KpiCard = ({ data }) => {
  const IconComponent = TablerIcons[data.icon] || TablerIcons.IconCurrencyDollar;
  const isPositiveTrend = data.isUp;
  const trendColor = isPositiveTrend ? 'teal.6' : 'red.6';
  const TrendIcon = isPositiveTrend ? IconArrowUpRight : IconArrowDownRight;

  return (
    <div className={classes.card}>
      <Flex gap="lg" align="flex-start">
        <div className={classes.kpiIconWrapper} style={{ backgroundColor: `var(--mantine-color-${data.color}-0)`, color: `var(--mantine-color-${data.color}-6)` }}>
          <IconComponent size={24} />
        </div>
        <Box>
          <Text size="sm" c="dimmed" fw={500}>{data.title}</Text>
          <Text size="2rem" fw={700} c={data.title.includes('Expenses') ? 'red.6' : data.title.includes('Rate') ? 'primary.7' : 'teal.6'}>
            {data.isPercent ? '' : '₹'}{data.value.toLocaleString()}{data.isPercent ? '%' : ''}
          </Text>
          <Flex className={classes.trendIndicator} c={trendColor} mt={4}>
            <TrendIcon size={14} stroke={3} />
            <Text size="xs">{data.trend}% <span style={{ color: 'var(--mantine-color-gray-5)', fontWeight: 400 }}>vs previous 3 months</span></Text>
          </Flex>
        </Box>
      </Flex>
    </div>
  );
};

const CustomLegend = ({ data }) => (
  <Box flex={1} ml="lg">
    {data.map(item => {
      // Extract color value to use in the dot
      const colorParts = item.color.split('.');
      const cssColor = `var(--mantine-color-${colorParts[0]}-${colorParts[1] || 6})`;
      
      return (
        <div key={item.name} className={classes.legendRow}>
          <Flex align="center">
            <div className={classes.legendDot} style={{ backgroundColor: cssColor }} />
            <Text size="sm" c="dimmed">{item.name}</Text>
          </Flex>
          <Text size="sm" fw={600}>₹{item.value.toLocaleString()}</Text>
        </div>
      );
    })}
  </Box>
);

const CardFooterLink = () => (
  <Flex justify="flex-end" mt="auto" pt="md">
    <Flex align="center" gap={4} className={classes.viewAllLink}>
      View full report <IconChevronRight size={14} />
    </Flex>
  </Flex>
);

// --- MAIN PAGE ---

export default function StatisticsPage() {
  const [timeframe, setTimeframe] = useState('Last 3 Months');
  const [accountFilter, setAccountFilter] = useState('All Accounts');

  return (
    <Box p="lg" className={classes.pageWrapper}>
      
      {/* 1. PAGE HEADER */}
      <div className={classes.header}>
        <Box>
          <Title order={2} fw={700} c="dark.9">Statistics & Analytics</Title>
          <Text c="dimmed" size="sm" mt={4}>Track your financial performance and discover insights.</Text>
        </Box>
        <Group>
          <Select 
            data={['This Month', 'Last 3 Months', 'Year to Date', 'Last 12 Months']} 
            value={timeframe} onChange={setTimeframe} 
            leftSection={<TablerIcons.IconCalendar size={16} />}
            bg="white" radius="md"
          />
          <Select 
            data={['All Accounts', 'Checking Account', 'Credit Card']} 
            value={accountFilter} onChange={setAccountFilter} 
            leftSection={<TablerIcons.IconWallet size={16} />}
            bg="white" radius="md"
          />
        </Group>
      </div>

      {/* 2. KPI CARDS ROW */}
      <Grid mb="xl">
        {kpiData.map((kpi, idx) => (
          <Grid.Col span={{ base: 12, sm: 6, lg: 3 }} key={idx}>
            <KpiCard data={kpi} />
          </Grid.Col>
        ))}
      </Grid>

      {/* 3. MIDDLE CHARTS ROW */}
      <Grid mb="xl">
        {/* Donut Chart: Expenses by Category */}
        <Grid.Col span={{ base: 12, lg: 5 }}>
          <div className={classes.card}>
            <Title order={5} fw={600} mb="xl">Expenses by Category</Title>
            <Flex align="center">
              <Box pos="relative">
                <DonutChart data={expensesByCategory} size={200} thickness={30} withTooltip={false} />
                <div className={classes.donutCenterText}>
                  <Text size="lg" fw={700}>₹13,280.50</Text>
                  <Text size="xs" c="dimmed">Total Expenses</Text>
                </div>
              </Box>
              <CustomLegend data={expensesByCategory} />
            </Flex>
            <CardFooterLink />
          </div>
        </Grid.Col>

        {/* Bar Chart: Income vs Expenses */}
        <Grid.Col span={{ base: 12, lg: 7 }}>
          <div className={classes.card}>
            <Title order={5} fw={600} mb="xl">Income vs Expenses</Title>
            <Box flex={1}>
              <BarChart
                h={220}
                data={incomeVsExpenses}
                dataKey="month"
                withLegend
                legendProps={{ verticalAlign: 'top', align: 'left', iconType: 'circle', wrapperStyle: { paddingBottom: '20px' } }}
                series={[
                  { name: 'Income', color: 'primary.6' },
                  { name: 'Expenses', color: 'red.5' },
                ]}
                tickLine="y"
                gridAxis="y"
              />
            </Box>
            <CardFooterLink />
          </div>
        </Grid.Col>
      </Grid>

      {/* 4. FULL WIDTH LINE CHART */}
      <Grid mb="xl">
        <Grid.Col span={12}>
          <div className={classes.card}>
            <Flex justify="space-between" align="center" mb="xl">
              <Title order={5} fw={600}>Wealth Growth</Title>
              <Select data={['Line Chart', 'Bar Chart']} defaultValue="Line Chart" size="xs" radius="md" w={120} leftSection={<TablerIcons.IconTrendingUp size={14}/>} />
            </Flex>
            <AreaChart
              h={250}
              data={wealthGrowth}
              dataKey="date"
              series={[{ name: 'Wealth', color: 'primary.6' }]}
              curveType="monotone"
              type="gradient"
              withDots={true}
              dotProps={{ r: 4, strokeWidth: 2 }}
              gridAxis="y"
            />
          </div>
        </Grid.Col>
      </Grid>

      {/* 5. BOTTOM INSIGHTS LISTS */}
      <Grid>
        {/* Largest Transactions */}
        <Grid.Col span={{ base: 12, lg: 4 }}>
          <div className={classes.card}>
            <div className={classes.cardHeader}>
              <Title order={5} fw={600}>Largest Transactions</Title>
              <Text className={classes.viewAllLink}>View all</Text>
            </div>
            {largestTransactions.map(t => {
              const Icon = TablerIcons[t.icon] || TablerIcons.IconReceipt2;
              return (
                <div key={t.id} className={classes.listRow}>
                  <div className={classes.listIcon}><Icon size={20} /></div>
                  <Box flex={1}>
                    <Text size="sm" fw={600}>{t.name}</Text>
                    <Text size="xs" c="dimmed">{t.date} • {t.account}</Text>
                  </Box>
                  <Text size="sm" fw={600} c="red.6">-₹{t.amount.toLocaleString()}</Text>
                </div>
              );
            })}
          </div>
        </Grid.Col>

        {/* Budget Health */}
        <Grid.Col span={{ base: 12, lg: 4 }}>
          <div className={classes.card}>
            <div className={classes.cardHeader}>
              <Title order={5} fw={600}>Budget Health</Title>
              <Text className={classes.viewAllLink}>View all</Text>
            </div>
            {budgetHealth.map((b, idx) => {
              const Icon = TablerIcons[b.icon];
              return (
                <div key={idx} className={classes.listRow}>
                  <div className={classes.listIcon}><Icon size={20} /></div>
                  <Box flex={1}>
                    <Flex justify="space-between" mb={4}>
                      <Text size="sm" fw={600}>{b.category}</Text>
                      <Text size="xs" c="dimmed">₹{b.spent.toLocaleString()} of ₹{b.total.toLocaleString()}</Text>
                    </Flex>
                    <Progress value={b.percent} color={b.isOver ? 'red.5' : 'primary.5'} size="sm" radius="xl" />
                  </Box>
                  <Group gap={8} w={60} justify="flex-end">
                    <Text size="sm" fw={600}>{b.percent}%</Text>
                    <Badge color={b.isOver ? 'red' : 'teal'} variant="dot" size="sm">{b.isOver ? 'Over' : 'Under'}</Badge>
                  </Group>
                </div>
              );
            })}
          </div>
        </Grid.Col>

        {/* Income Breakdown */}
        <Grid.Col span={{ base: 12, lg: 4 }}>
          <div className={classes.card}>
            <div className={classes.cardHeader}>
              <Title order={5} fw={600}>Income Breakdown</Title>
              <Text className={classes.viewAllLink}>View all</Text>
            </div>
            <Flex align="center" mt="md">
              <Box pos="relative">
                <DonutChart data={incomeBreakdown} size={150} thickness={20} withTooltip={false} />
                <div className={classes.donutCenterText}>
                  <Text size="sm" fw={700}>₹24,750</Text>
                </div>
              </Box>
              <CustomLegend data={incomeBreakdown} />
            </Flex>
            <CardFooterLink />
          </div>
        </Grid.Col>
      </Grid>

    </Box>
  );
}