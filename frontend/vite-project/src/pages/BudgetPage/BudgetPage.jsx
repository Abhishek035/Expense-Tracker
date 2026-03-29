import React, { useState, useMemo } from 'react';
import { Box, Flex, Text, Title, Button, Popover, UnstyledButton, ScrollArea, Divider, Title as MantineTitle } from '@mantine/core';
import { IconChevronDown, IconPlus, IconRocket } from '@tabler/icons-react';
import BudgetRow from '../../components/BudgetRow/BudgetRow';
import { mockAccounts, mockBudgetCategories, mockBudgetAssignments, mockBudgetSpent, mockRollover } from '../../data/mockBudgetData';
import classes from './BudgetPage.module.css';

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

export default function BudgetPage() {
  const [currentDate, setCurrentDate] = useState(new Date(2026, 2, 1)); 
  const [dateDropdownOpened, setDateDropdownOpened] = useState(false);
  
  const [assignments, setAssignments] = useState(mockBudgetAssignments);
  
  // NEW: State to hold editable targets for Savings Goals
  const initialTargets = {};
  mockBudgetCategories.forEach(c => { if (c.target) initialTargets[c.id] = c.target; });
  const [targets, setTargets] = useState(initialTargets);

  const currentMonthIdx = currentDate.getMonth();
  const currentYear = currentDate.getFullYear();
  const monthName = currentDate.toLocaleString('default', { month: 'long', year: 'numeric' });
  const actualCurrentYear = new Date().getFullYear();
  const YEARS = Array.from({ length: 7 }, (_, i) => actualCurrentYear - 3 + i); 

  const monthKey = `${currentYear}-${String(currentMonthIdx + 1).padStart(2, '0')}`;
  const currentAssigned = assignments[monthKey] || {};
  const currentSpent = mockBudgetSpent[monthKey] || {};

  const handleAssignChange = (catId, amount) => {
    setAssignments(prev => ({
      ...prev,
      [monthKey]: {
        ...(prev[monthKey] || {}),
        [catId]: amount
      }
    }));
  };

  // NEW: Handler for changing target amounts
  const handleTargetChange = (catId, amount) => {
    setTargets(prev => ({ ...prev, [catId]: amount }));
  };

  const totalCash = mockAccounts.filter(a => a.type !== 'credit').reduce((sum, a) => sum + a.balance, 0);
  const totalAssignedThisMonth = Object.values(currentAssigned).reduce((sum, val) => sum + val, 0);
  const readyToAssign = totalCash - totalAssignedThisMonth;

  const monthlyCats = mockBudgetCategories.filter(c => c.group === 'monthly');
  const yearlyCats = mockBudgetCategories.filter(c => c.group === 'yearly');
  const savingCats = mockBudgetCategories.filter(c => c.group === 'savings');

  // UPDATED: Accept custom headers for different section types
  const renderSection = (title, categories, headers) => (
    <Box mb={40}>
      <MantineTitle order={4} mb="md" fw={600}>{title}</MantineTitle>
      <div className={classes.sectionCard}>
        <div className={classes.headerRow}>
          <Text size="sm" fw={600} c="dimmed">{headers[0]}</Text>
          <Text size="sm" fw={600} c="dimmed" ta="right">{headers[1]}</Text>
          <Text size="sm" fw={600} c="dimmed" ta="right">{headers[2]}</Text>
          <Text size="sm" fw={600} c="dimmed" ta="right">{headers[3]}</Text>
          <div /> 
        </div>
        
        {categories.map((cat, idx) => (
          <React.Fragment key={cat.id}>
            <BudgetRow 
              category={cat}
              assigned={currentAssigned[cat.id] || 0}
              spent={currentSpent[cat.id] || 0}
              rollover={mockRollover[cat.id] || 0}
              target={targets[cat.id] || 0}
              onAssignChange={handleAssignChange}
              onTargetChange={handleTargetChange}
            />
            {idx < categories.length - 1 && <Divider />}
          </React.Fragment>
        ))}
      </div>
    </Box>
  );

  return (
    <Box p="md" className={classes.pageWrapper}>
      <div className={classes.headerWrapper}>
        <Popover opened={dateDropdownOpened} onChange={setDateDropdownOpened} position="bottom-start" withArrow shadow="md">
          <Popover.Target>
            <UnstyledButton className={classes.dateSelector} onClick={() => setDateDropdownOpened((o) => !o)}>
              <Title order={2} fw={600}>{monthName}</Title>
              <IconChevronDown size={24} stroke={2.5} />
            </UnstyledButton>
          </Popover.Target>
          <Popover.Dropdown p="md">
            <Flex gap="md" align="stretch">
              <Box w={90}>
                <Text className={classes.pickerColumnTitle} size="sm">Month</Text>
                <ScrollArea h={220} scrollbarSize={6}>
                  {MONTHS.map((month, idx) => (
                    <div key={month} className={`${classes.pickerItem} ${idx === currentMonthIdx ? classes.pickerItemSelected : ''}`} onClick={() => { setCurrentDate(new Date(currentYear, idx, 1)); setDateDropdownOpened(false); }}>{month}</div>
                  ))}
                </ScrollArea>
              </Box>
              <Divider orientation="vertical" />
              <Box w={90}>
                <Text className={classes.pickerColumnTitle} size="sm">Year</Text>
                <ScrollArea h={220} scrollbarSize={6}>
                  {YEARS.map((year) => (
                    <div key={year} className={`${classes.pickerItem} ${year === currentYear ? classes.pickerItemSelected : ''}`} onClick={() => { setCurrentDate(new Date(year, currentMonthIdx, 1)); setDateDropdownOpened(false); }}>{year}</div>
                  ))}
                </ScrollArea>
              </Box>
            </Flex>
          </Popover.Dropdown>
        </Popover>

        <Button variant="outline" color="gray" leftSection={<IconPlus size={16} />} disabled>Add Budget</Button>
      </div>

      <div className={classes.readyBanner}>
        <div className={classes.readyBannerIcon}><IconRocket size={32} /></div>
        <Box>
          <Text size="sm" fw={600} c="dimmed" tt="uppercase" ls={1}>Ready to Assign</Text>
          <Text size="2.5rem" fw={700} lh={1.1} c={readyToAssign < 0 ? 'red.6' : 'dark.9'}>₹{readyToAssign.toLocaleString()}</Text>
        </Box>
      </div>

      {/* UPDATED: Passing custom headers */}
      {renderSection("Monthly Budget", monthlyCats, ["Category", "Assigned", "Spent", "Available"])}
      {renderSection("Yearly & Irregular Budget", yearlyCats, ["Category", "Assigned", "Spent", "Available"])}
      
      {/* SAVINGS GOALS: Target, Total Saved, empty 4th column, Button */}
      {renderSection("Savings Goals", savingCats, ["Goal", "Target Amount", "Total Saved", ""])}
    </Box>
  );
}