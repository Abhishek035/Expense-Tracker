import React, { useState } from 'react';
import { Box, Flex, Text, Title, Button, Popover, UnstyledButton, ScrollArea, Divider, Title as MantineTitle, Group, Modal, TextInput, Select, NumberInput, Stack } from '@mantine/core';
import { DateInput } from '@mantine/dates';
import { IconChevronDown, IconPlus, IconRocket, IconTarget } from '@tabler/icons-react';
import BudgetRow from '../../components/BudgetRow/BudgetRow';
import { mockAccounts, mockBudgetCategories, mockBudgetAssignments, mockBudgetSpent, mockRollover } from '../../data/mockBudgetData';
import classes from './BudgetPage.module.css';

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

export default function BudgetPage() {
  const [currentDate, setCurrentDate] = useState(new Date(2026, 2, 1)); 
  const [dateDropdownOpened, setDateDropdownOpened] = useState(false);
  
  const [categories, setCategories] = useState(mockBudgetCategories);
  const [assignments, setAssignments] = useState(mockBudgetAssignments);
  const [spentData, setSpentData] = useState(mockBudgetSpent);
  
  const initialTargets = {};
  mockBudgetCategories.forEach(c => { if (c.target) initialTargets[c.id] = c.target; });
  const [targets, setTargets] = useState(initialTargets);

  const [isAddBudgetOpen, setIsAddBudgetOpen] = useState(false);
  const [isCreateGoalOpen, setIsCreateGoalOpen] = useState(false);
  const [isLogExpenseOpen, setIsLogExpenseOpen] = useState(false);
  const [activeExpenseCategory, setActiveExpenseCategory] = useState(null);

  const [budgetForm, setBudgetForm] = useState({ name: '', frequency: 'monthly', amount: 0 });
  const [goalForm, setGoalForm] = useState({ name: '', target: 0, date: null });
  const [expenseForm, setExpenseForm] = useState({ amount: 0, date: new Date(), account: '' });

  const currentMonthIdx = currentDate.getMonth();
  const currentYear = currentDate.getFullYear();
  const monthName = currentDate.toLocaleString('default', { month: 'long', year: 'numeric' });
  const actualCurrentYear = new Date().getFullYear();
  const YEARS = Array.from({ length: 7 }, (_, i) => actualCurrentYear - 3 + i); 
  const monthKey = `${currentYear}-${String(currentMonthIdx + 1).padStart(2, '0')}`;

  const currentAssigned = assignments[monthKey] || {};
  const currentSpent = spentData[monthKey] || {};

  // This handles BOTH regular assignments and Savings Goal funds being added/removed.
  // Because it updates `assignments[monthKey]`, it will automatically affect the `readyToAssign` math!
  const handleAssignChange = (catId, amount) => {
    setAssignments(prev => ({ 
      ...prev, 
      [monthKey]: { 
        ...(prev[monthKey] || {}), 
        [catId]: amount 
      } 
    }));
  };

  const handleTargetChange = (catId, amount) => {
    setTargets(prev => ({ ...prev, [catId]: amount }));
  };

  const handleLogExpenseClick = (category) => {
    setActiveExpenseCategory(category);
    setExpenseForm({ amount: 0, date: new Date(), account: '' });
    setIsLogExpenseOpen(true);
  };

  const handleDeleteCategory = (catId) => {
    // 1. Remove from the UI list
    setCategories(prev => prev.filter(c => c.id !== catId));

    // 2. Remove from assignments (This frees up the money and instantly refunds 'Ready to Assign')
    setAssignments(prev => {
      const updatedMonth = { ...(prev[monthKey] || {}) };
      delete updatedMonth[catId]; // Delete the assigned amount
      return { ...prev, [monthKey]: updatedMonth };
    });
  };

  const submitAddBudget = () => {
    const newId = 'cat_' + Date.now();
    const newCat = { id: newId, name: budgetForm.name, group: budgetForm.frequency, icon: 'IconReceipt2' };
    
    // Use functional update to ensure we don't have stale state
    setCategories(prev => [...prev, newCat]);
    
    // When creating a budget, immediately assign the requested amount.
    handleAssignChange(newId, budgetForm.amount);
    
    setIsAddBudgetOpen(false);
    setBudgetForm({ name: '', frequency: 'monthly', amount: 0 });
  };

  const submitCreateGoal = () => {
    const newId = 'cat_' + Date.now();
    
    // SAFE DATE HANDLING: Cast to a Date object first, and check if it's valid
    let formattedDate = null;
    if (goalForm.date) {
      const d = new Date(goalForm.date);
      if (!isNaN(d)) { // Ensures it didn't fail parsing
        formattedDate = `${d.toLocaleString('default', { month: 'short' })} ${d.getFullYear()}`;
      }
    }
      
    const newCat = { 
      id: newId, 
      name: goalForm.name, 
      group: 'savings', 
      icon: 'IconTarget', 
      target: goalForm.target, 
      due: formattedDate 
    };
    
    // Use functional update to ensure it instantly renders in the UI
    setCategories(prev => [...prev, newCat]);
    
    // Save the target purely as a tracking goal
    handleTargetChange(newId, goalForm.target);
    
    // Ensure it has an initial assigned state of 0 so the math doesn't break
    handleAssignChange(newId, 0);

    setIsCreateGoalOpen(false);
    setGoalForm({ name: '', target: 0, date: null });
  };

  const submitLogExpense = () => {
    const catId = activeExpenseCategory.id;
    setSpentData(prev => ({
      ...prev,
      [monthKey]: {
        ...(prev[monthKey] || {}),
        [catId]: (prev[monthKey]?.[catId] || 0) + expenseForm.amount
      }
    }));
    setIsLogExpenseOpen(false);
  };

  // READY TO ASSIGN MATH
  // This calculates perfectly. If the user adds funds to a savings goal, it increases `currentAssigned`, thereby lowering `readyToAssign`.
  const totalCash = mockAccounts.filter(a => a.type !== 'credit').reduce((sum, a) => sum + a.balance, 0);
  const totalAssignedThisMonth = Object.values(currentAssigned).reduce((sum, val) => sum + val, 0);
  const readyToAssign = totalCash - totalAssignedThisMonth;

  const renderSection = (title, categoryGroup, headers) => {
    const cats = categories.filter(c => c.group === categoryGroup);
    if (cats.length === 0) return null;

    return (
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
          {cats.map((cat, idx) => (
            <React.Fragment key={cat.id}>
              <BudgetRow 
                category={cat} 
                assigned={currentAssigned[cat.id] || 0} 
                spent={currentSpent[cat.id] || 0} 
                rollover={mockRollover[cat.id] || 0} 
                target={targets[cat.id] || 0} 
                onAssignChange={handleAssignChange} 
                onTargetChange={handleTargetChange} 
                onLogExpense={handleLogExpenseClick} 
                onDelete={handleDeleteCategory}
              />
              {idx < cats.length - 1 && <Divider />}
            </React.Fragment>
          ))}
        </div>
      </Box>
    );
  };

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

        <Group>
          <Button variant="outline" color="primary" leftSection={<IconTarget size={16} />} onClick={() => setIsCreateGoalOpen(true)}>
            Create Goal
          </Button>
          <Button variant="filled" color="primary" leftSection={<IconPlus size={16} />} onClick={() => setIsAddBudgetOpen(true)}>
            Add Budget
          </Button>
        </Group>
      </div>

      <div className={classes.readyBanner}>
        <div className={classes.readyBannerIcon}><IconRocket size={32} /></div>
        <Box>
          <Text size="sm" fw={600} c="dimmed" tt="uppercase" ls={1}>Ready to Assign</Text>
          <Text size="2.5rem" fw={700} lh={1.1} c={readyToAssign < 0 ? 'red.6' : 'dark.9'}>₹{readyToAssign.toLocaleString()}</Text>
        </Box>
      </div>

      {renderSection("Monthly Budget", "monthly", ["Category", "Assigned", "Spent", "Available"])}
      {renderSection("Yearly & Irregular Budget", "yearly", ["Category", "Assigned", "Spent", "Available"])}
      {renderSection("Savings Goals", "savings", ["Goal", "Target Amount", "Total Saved", ""])}

      {/* --- MODALS --- */}
      
      <Modal opened={isAddBudgetOpen} onClose={() => setIsAddBudgetOpen(false)} title="Add New Budget" centered>
        <Stack gap="md">
          <TextInput label="Category Name" placeholder="e.g., Pet Supplies" required value={budgetForm.name} onChange={(e) => setBudgetForm({...budgetForm, name: e.currentTarget.value})} />
          <Select label="Frequency" data={[{value: 'monthly', label: 'Monthly'}, {value: 'yearly', label: 'Yearly/Irregular'}]} value={budgetForm.frequency} onChange={(val) => setBudgetForm({...budgetForm, frequency: val})} />
          <NumberInput label="Assigned Amount" description="This will deduct from 'Ready to Assign'" prefix="₹" value={budgetForm.amount} onChange={(val) => setBudgetForm({...budgetForm, amount: val})} />
          <Button fullWidth mt="md" onClick={submitAddBudget} disabled={!budgetForm.name}>Save Budget</Button>
        </Stack>
      </Modal>

      {/* Savings Goal Modal */}
      <Modal opened={isCreateGoalOpen} onClose={() => setIsCreateGoalOpen(false)} title="Create Savings Goal" centered>
        <Stack gap="md">
          <TextInput label="Goal Name" placeholder="e.g., New Laptop" required value={goalForm.name} onChange={(e) => setGoalForm({...goalForm, name: e.currentTarget.value})} />
          {/* Target input purely creates a visual tracking number */}
          <NumberInput label="Target Amount" description="Setting a target does not cost money." prefix="₹" value={goalForm.target} onChange={(val) => setGoalForm({...goalForm, target: val})} />
          <DateInput label="Target Due Date (Optional)" placeholder="Select month/year" value={goalForm.date} onChange={(val) => setGoalForm({...goalForm, date: val})} />
          <Button fullWidth mt="md" onClick={submitCreateGoal} disabled={!goalForm.name}>Create Goal</Button>
        </Stack>
      </Modal>

      <Modal opened={isLogExpenseOpen} onClose={() => setIsLogExpenseOpen(false)} title={`Log Expense: ${activeExpenseCategory?.name}`} centered>
        <Stack gap="md">
          <NumberInput label="Amount" prefix="₹" required value={expenseForm.amount} onChange={(val) => setExpenseForm({...expenseForm, amount: val})} />
          <DateInput label="Date" required value={expenseForm.date} onChange={(val) => setExpenseForm({...expenseForm, date: val})} />
          <Select label="Payment Method" placeholder="Select account" data={mockAccounts.map(a => ({ value: a.id, label: a.id }))} value={expenseForm.account} onChange={(val) => setExpenseForm({...expenseForm, account: val})} />
          <Button fullWidth mt="md" onClick={submitLogExpense} disabled={!expenseForm.amount}>Log Transaction</Button>
        </Stack>
      </Modal>

    </Box>
  );
}