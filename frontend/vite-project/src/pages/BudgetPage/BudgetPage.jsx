import React, { useState, useEffect, useMemo } from 'react';
import { Box, Flex, Text, Title, Button, Popover, UnstyledButton, ScrollArea, Divider, Title as MantineTitle, Group, Modal, TextInput, Select, NumberInput, Stack, Loader } from '@mantine/core';
import { DateInput } from '@mantine/dates';
import { IconChevronDown, IconPlus, IconRocket, IconTarget } from '@tabler/icons-react';
import BudgetRow from '../../components/BudgetRow/BudgetRow';
import { supabase } from '../../supabaseClient'; // <-- SUPABASE IMPORT
import classes from './BudgetPage.module.css';

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

export default function BudgetPage() {
  const [loading, setLoading] = useState(true);
  
  // DATE STATE
  const [currentDate, setCurrentDate] = useState(new Date()); 
  const [dateDropdownOpened, setDateDropdownOpened] = useState(false);
  
  // LIVE DATABASE STATE
  const [accountsList, setAccountsList] = useState([]);
  const [totalCash, setTotalCash] = useState(0);
  const [categories, setCategories] = useState([]);
  const [rawAssignments, setRawAssignments] = useState([]); // Flat array from DB
  const [rawTransactions, setRawTransactions] = useState([]); // Flat array from DB
  
  // MODAL STATES
  const [isAddBudgetOpen, setIsAddBudgetOpen] = useState(false);
  const [isCreateGoalOpen, setIsCreateGoalOpen] = useState(false);
  const [isLogExpenseOpen, setIsLogExpenseOpen] = useState(false);
  const [activeExpenseCategory, setActiveExpenseCategory] = useState(null);

  // FORM STATES
  const [budgetForm, setBudgetForm] = useState({ name: '', frequency: 'monthly', amount: 0 });
  const [goalForm, setGoalForm] = useState({ name: '', target: 0, date: null });
  const [expenseForm, setExpenseForm] = useState({ amount: 0, date: new Date(), account: '', description: '' });

  // --- 1. FETCH DATA FROM SUPABASE ---
  const fetchData = async () => {
    setLoading(true);
    try {
      // Fetch Accounts (For Total Cash & Expense Dropdown)
      const { data: accData } = await supabase.from('accounts').select('*');
      let cash = 0;
      const accList = [];
      if (accData) {
        accData.forEach(acc => {
          if (acc.type !== 'credit') cash += Number(acc.balance || 0);
          accList.push({ value: acc.id, label: acc.name });
        });
      }
      setTotalCash(cash);
      setAccountsList(accList);

      // Fetch Categories
      const { data: catData } = await supabase.from('categories').select('*');
      if (catData) setCategories(catData);

      // Fetch Assignments
      const { data: assignData } = await supabase.from('budget_assignments').select('*');
      if (assignData) setRawAssignments(assignData);

      // Fetch Transactions (Only completed expenses)
      const { data: txData } = await supabase.from('transactions').select('*').eq('type', 'expense').eq('is_completed', true);
      if (txData) setRawTransactions(txData);

    } catch (err) {
      console.error("Error fetching budget data:", err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // --- 2. DATE MATH ---
  const currentMonthIdx = currentDate.getMonth();
  const currentYear = currentDate.getFullYear();
  const monthName = currentDate.toLocaleString('default', { month: 'long', year: 'numeric' });
  const actualCurrentYear = new Date().getFullYear();
  const YEARS = Array.from({ length: 7 }, (_, i) => actualCurrentYear - 3 + i); 
  
  // Format: "2026-06"
  const monthKey = `${currentYear}-${String(currentMonthIdx + 1).padStart(2, '0')}`;

  // --- 3. DATA PROCESSING (Memos for performance) ---
  
  // How much is assigned THIS month per category?
  const currentAssigned = useMemo(() => {
    const assigned = {};
    rawAssignments.forEach(a => {
      if (a.month === monthKey) assigned[a.category_id] = Number(a.amount);
    });
    return assigned;
  }, [rawAssignments, monthKey]);

  // How much is spent THIS month per category?
  const currentSpent = useMemo(() => {
    const spent = {};
    rawTransactions.forEach(t => {
      const tMonth = `${new Date(t.date).getFullYear()}-${String(new Date(t.date).getMonth() + 1).padStart(2, '0')}`;
      if (tMonth === monthKey && t.category_id) {
        spent[t.category_id] = (spent[t.category_id] || 0) + Number(t.amount);
      }
    });
    return spent;
  }, [rawTransactions, monthKey]);

  // REAL ROLLOVER MATH! (Past Assigned - Past Spent)
  const rolloverData = useMemo(() => {
    const rollover = {};
    categories.forEach(cat => {
      let pastAssigned = 0;
      let pastSpent = 0;
      
      rawAssignments.forEach(a => {
        if (a.category_id === cat.id && a.month < monthKey) pastAssigned += Number(a.amount);
      });
      
      rawTransactions.forEach(t => {
        const tMonth = `${new Date(t.date).getFullYear()}-${String(new Date(t.date).getMonth() + 1).padStart(2, '0')}`;
        if (t.category_id === cat.id && tMonth < monthKey) pastSpent += Number(t.amount);
      });
      
      rollover[cat.id] = pastAssigned - pastSpent;
    });
    return rollover;
  }, [categories, rawAssignments, rawTransactions, monthKey]);

  // READY TO ASSIGN MATH
  const totalAssignedThisMonth = Object.values(currentAssigned).reduce((sum, val) => sum + val, 0);
  const readyToAssign = totalCash - totalAssignedThisMonth;

  // --- 4. SUPABASE CRUD HANDLERS ---

  const handleAssignChange = async (catId, amount) => {
    // Optimistic UI update
    const newAssignment = { category_id: catId, month: monthKey, amount };
    setRawAssignments(prev => {
      const filtered = prev.filter(a => !(a.category_id === catId && a.month === monthKey));
      return [...filtered, newAssignment];
    });

    // Supabase Upsert logic (Check if exists, update or insert)
    const { data } = await supabase.from('budget_assignments').select('id').eq('category_id', catId).eq('month', monthKey).single();
    if (data) {
      await supabase.from('budget_assignments').update({ amount }).eq('id', data.id);
    } else {
      await supabase.from('budget_assignments').insert([newAssignment]);
    }
  };

  const handleTargetChange = async (catId, amount) => {
    // Optimistic UI Update
    setCategories(prev => prev.map(c => c.id === catId ? { ...c, params: { ...c.params, target: amount } } : c));
    
    // DB Update
    const cat = categories.find(c => c.id === catId);
    const newParams = { ...(cat.params || {}), target: amount };
    await supabase.from('categories').update({ params: newParams }).eq('id', catId);
  };

  const handleDeleteCategory = async (catId) => {
    setCategories(prev => prev.filter(c => c.id !== catId));
    await supabase.from('categories').delete().eq('id', catId);
    fetchData(); // Refresh to clean up assignments
  };

  const submitAddBudget = async () => {
    const newCat = { name: budgetForm.name, group: budgetForm.frequency, icon: 'IconReceipt2', params: {} };
    
    const { data, error } = await supabase.from('categories').insert([newCat]).select();
    if (!error && data) {
      const catId = data[0].id;
      setCategories(prev => [...prev, data[0]]);
      
      // Auto-assign the initial amount
      if (budgetForm.amount > 0) {
        await handleAssignChange(catId, budgetForm.amount);
      }
    }
    
    setIsAddBudgetOpen(false);
    setBudgetForm({ name: '', frequency: 'monthly', amount: 0 });
  };

  const submitCreateGoal = async () => {
    let formattedDate = null;
    if (goalForm.date) {
      const d = new Date(goalForm.date);
      if (!isNaN(d)) formattedDate = `${d.toLocaleString('default', { month: 'short' })} ${d.getFullYear()}`;
    }
      
    const newCat = { 
      name: goalForm.name, 
      group: 'savings', 
      icon: 'IconTarget', 
      params: { target: goalForm.target, due_date: formattedDate } 
    };
    
    const { data, error } = await supabase.from('categories').insert([newCat]).select();
    if (!error && data) {
      setCategories(prev => [...prev, data[0]]);
      await handleAssignChange(data[0].id, 0); // Init assignment to 0
    }

    setIsCreateGoalOpen(false);
    setGoalForm({ name: '', target: 0, date: null });
  };

  const submitLogExpense = async () => {
    const payload = {
      account_id: expenseForm.account,
      date: expenseForm.date.toISOString(),
      amount: expenseForm.amount,
      type: 'expense',
      category: activeExpenseCategory.name,
      category_id: activeExpenseCategory.id,
      
      description: expenseForm.description ? expenseForm.description : activeExpenseCategory.name, 
      
      is_completed: true
    };

    await supabase.from('transactions').insert([payload]);
    
    setIsLogExpenseOpen(false);
    fetchData(); 
  };

  // --- RENDER ---
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
                category={{ ...cat, target: cat.params?.target, due: cat.params?.due_date }} 
                assigned={currentAssigned[cat.id] || 0} 
                spent={currentSpent[cat.id] || 0} 
                rollover={rolloverData[cat.id] || 0} 
                target={cat.params?.target || 0} 
                onAssignChange={handleAssignChange} 
                onTargetChange={handleTargetChange} 
                onLogExpense={() => { setActiveExpenseCategory(cat); setExpenseForm({ amount: 0, date: new Date(), account: '' }); setIsLogExpenseOpen(true); }} 
                onDelete={handleDeleteCategory}
              />
              {idx < cats.length - 1 && <Divider />}
            </React.Fragment>
          ))}
        </div>
      </Box>
    );
  };

  if (loading && categories.length === 0) return <Flex justify="center" mt="20vh"><Loader color="primary" /></Flex>;

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
          <Text size="2.5rem" fw={700} lh={1.1} c={readyToAssign < 0 ? 'red.6' : 'dark.9'}>₹{readyToAssign.toLocaleString('en-IN')}</Text>
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

      <Modal opened={isCreateGoalOpen} onClose={() => setIsCreateGoalOpen(false)} title="Create Savings Goal" centered>
        <Stack gap="md">
          <TextInput label="Goal Name" placeholder="e.g., New Laptop" required value={goalForm.name} onChange={(e) => setGoalForm({...goalForm, name: e.currentTarget.value})} />
          <NumberInput label="Target Amount" description="Setting a target does not cost money." prefix="₹" value={goalForm.target} onChange={(val) => setGoalForm({...goalForm, target: val})} />
          <DateInput label="Target Due Date (Optional)" placeholder="Select month/year" value={goalForm.date} onChange={(val) => setGoalForm({...goalForm, date: val})} />
          <Button fullWidth mt="md" onClick={submitCreateGoal} disabled={!goalForm.name}>Create Goal</Button>
        </Stack>
      </Modal>

      <Modal opened={isLogExpenseOpen} onClose={() => setIsLogExpenseOpen(false)} title={`Log Expense: ${activeExpenseCategory?.name}`} centered>
        <Stack gap="md">
          <NumberInput label="Amount" prefix="₹" required value={expenseForm.amount} onChange={(val) => setExpenseForm({...expenseForm, amount: val})} />
          
          <TextInput label="Description (Optional)" placeholder="What did you buy?" value={expenseForm.description} onChange={(e) => setExpenseForm({...expenseForm, description: e.currentTarget.value})} />
          
          <DateInput label="Date" required value={expenseForm.date} onChange={(val) => setExpenseForm({...expenseForm, date: val})} />
          <Select label="Payment Method" placeholder="Select account" data={accountsList} value={expenseForm.account} onChange={(val) => setExpenseForm({...expenseForm, account: val})} />
          <Button fullWidth mt="md" onClick={submitLogExpense} disabled={!expenseForm.amount || !expenseForm.account}>Log Transaction</Button>
        </Stack>
      </Modal>

    </Box>
  );
}