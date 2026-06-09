// src/pages/CalendarPage/CalendarPage.jsx
import React, { useState, useMemo, useEffect } from 'react';
import { Box, Loader, Flex } from '@mantine/core';
import CalendarHeader from '../../components/CalendarHeader/CalendarHeader';
import CalendarSidebar from '../../components/CalendarSidebar/CalendarSidebar';
import CalendarGrid from '../../components/CalendarGrid/CalendarGrid';
import TransactionSidePanel from '../../components/TransactionSidePanel/TransactionSidePanel';
import TransactionForm from '../../AddTransaction/TransactionForm';
import { getDaysInMonthView, formatDate } from '../../utils/calendarUtils';
import { supabase } from '../../supabaseClient'; // <-- IMPORT SUPABASE
import classes from './CalendarPage.module.css';

export default function CalendarPage() {
  const today = new Date();
  const [currentDate, setCurrentDate] = useState(today); 
  const [selectedDate, setSelectedDate] = useState(today);
  const [viewOptions, setViewOptions] = useState({ income: true, expense: true, net: true });
  
  const [filters, setFilters] = useState({ account: [], category: [], type: [] });
  
  // LIVE DATABASE STATE
  const [transactions, setTransactions] = useState([]);
  const [accountsList, setAccountsList] = useState([]); // Used to dynamically populate filters
  const [initialBalance, setInitialBalance] = useState(0);
  const [loading, setLoading] = useState(true);

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  // --- 1. FETCH DATA FROM SUPABASE ---
  const fetchData = async () => {
    setLoading(true);
    try {
      // A. Fetch Accounts (For starting balance and filters)
      const { data: accData, error: accError } = await supabase.from('accounts').select('*');
      if (accError) throw accError;

      let baseBal = 0;
      const formattedAccs = [];
      if (accData) {
        accData.forEach(acc => {
          // Add to starting balance only if it's cash/debit
          if (acc.type !== 'credit') baseBal += Number(acc.balance || 0);
          formattedAccs.push({ value: acc.id, label: acc.name });
        });
      }
      setInitialBalance(baseBal);
      setAccountsList(formattedAccs);

      // B. Fetch Transactions
      const { data: txData, error: txError } = await supabase.from('transactions').select('*');
      if (txError) throw txError;

      // Map DB schema to UI expectations
      const formattedTx = txData.map(t => ({
        ...t,
        accountId: t.account_id,
        isCompleted: t.is_completed,
        isRecurring: t.params?.is_recurring || false,
      }));

      setTransactions(formattedTx);
    } catch (error) {
      console.error("Error fetching calendar data:", error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();

    // Listen for the global event fired by TransactionForm to refresh the calendar
    window.addEventListener('transaction-updated', fetchData);
    return () => window.removeEventListener('transaction-updated', fetchData);
  }, []);


  // --- 2. TOGGLE COMPLETION (SUPABASE UPDATE) ---
  const handleToggleCompletion = async (id) => {
    const tx = transactions.find(t => t.id === id);
    if (!tx) return;

    // Optimistic UI Update (Makes it feel instantly responsive)
    setTransactions(prev => prev.map(t => 
      t.id === id ? { ...t, isCompleted: !t.isCompleted } : t
    ));

    try {
      // Push the flip to Supabase. 
      // NOTE: Because of our Postgres Triggers, flipping this to TRUE 
      // will automatically deduct the amount from the account balance!
      const { error } = await supabase
        .from('transactions')
        .update({ is_completed: !tx.isCompleted })
        .eq('id', id);

      if (error) throw error;
      
      // Fire global event so Dashboard/Accounts pages know the balance changed
      window.dispatchEvent(new Event('transaction-updated'));
    } catch (err) {
      console.error("Error updating completion status:", err.message);
      fetchData(); // Revert on error
    }
  };

  // --- CORE MATH LOGIC (Remains the exact same) ---
  const daysInView = useMemo(() => getDaysInMonthView(currentDate.getFullYear(), currentDate.getMonth()), [currentDate]);

  const fullyFilteredTransactions = useMemo(() => {
    return transactions.filter(t => {
      const accountMatch = filters.account.length === 0 || filters.account.includes(t.accountId);
      const categoryMatch = filters.category.length === 0 || filters.category.includes(t.category);
      const typeMatch = filters.type.length === 0 || filters.type.includes(t.type);
      return accountMatch && categoryMatch && typeMatch;
    });
  }, [transactions, filters]);

  const accountFilteredTransactions = useMemo(() => {
    return transactions.filter(t => {
      return filters.account.length === 0 || filters.account.includes(t.accountId);
    });
  }, [transactions, filters.account]);

  const dailyData = useMemo(() => {
    const data = {};
    let runningBalance = initialBalance; // <-- Now uses dynamic total cash balance

    const todayAtMidnight = new Date();
    todayAtMidnight.setHours(0, 0, 0, 0);

    daysInView.forEach(day => {
      const dateStr = formatDate(day.date);
      const fullyFilteredForDay = fullyFilteredTransactions.filter(t => formatDate(new Date(t.date)) === dateStr);
      let cellIncome = 0; let cellExpense = 0;
      
      let completedCount = 0;
      let pendingCount = 0;
      let recurringCount = 0;
      
      fullyFilteredForDay.forEach(t => {
        if (t.type === 'income') cellIncome += t.amount;
        if (t.type === 'expense') cellExpense += t.amount;

        const txDate = new Date(t.date);
        txDate.setHours(0, 0, 0, 0);
        const isFuture = txDate > todayAtMidnight;

        if (!isFuture || t.isCompleted) completedCount++;
        else if (t.isRecurring) recurringCount++;
        else pendingCount++;
      });

      const accountFilteredForDay = accountFilteredTransactions.filter(t => formatDate(new Date(t.date)) === dateStr);
      let trueNet = 0;
      accountFilteredForDay.forEach(t => {
        if (t.type === 'income') trueNet += t.amount;
        if (t.type === 'expense') trueNet -= t.amount;
      });

      runningBalance += trueNet;

      data[dateStr] = { 
        income: cellIncome, 
        expense: cellExpense, 
        net: cellIncome - cellExpense,
        projected: runningBalance,
        completedCount,
        pendingCount,   
        recurringCount  
      };
    });
    
    return data;
  }, [daysInView, fullyFilteredTransactions, accountFilteredTransactions, initialBalance]);

  const summaries = useMemo(() => {
    let monthlyIncome = 0, monthlyExpense = 0;
    let weeklyIncome = 0, weeklyExpense = 0;
    const startOfWeek = new Date(selectedDate);
    startOfWeek.setDate(selectedDate.getDate() - selectedDate.getDay());
    const endOfWeek = new Date(startOfWeek);
    endOfWeek.setDate(startOfWeek.getDate() + 6);
    
    daysInView.forEach(day => {
      const dData = dailyData[formatDate(day.date)];
      if (!dData) return;
      if (day.isCurrentMonth) { monthlyIncome += dData.income; monthlyExpense += dData.expense; }
      const dayTime = day.date.getTime();
      if (dayTime >= startOfWeek.getTime() && dayTime <= endOfWeek.getTime()) {
        weeklyIncome += dData.income; weeklyExpense += dData.expense;
      }
    });
    return { monthlyIncome, monthlyExpense, weeklyIncome, weeklyExpense };
  }, [daysInView, dailyData, selectedDate]);

  if (loading && transactions.length === 0) {
    return <Flex justify="center" mt="20vh"><Loader color="primary" /></Flex>;
  }

  return (
    <Box p="md" style={{ backgroundColor: 'var(--color-background1)' }}>
      <CalendarHeader 
        currentDate={currentDate} 
        setCurrentDate={setCurrentDate} 
        viewOptions={viewOptions}
        setViewOptions={setViewOptions}
        filters={filters}
        setFilters={setFilters}
        accountsList={accountsList} // Pass the dynamic accounts down for the filter dropdown
      />

      <div className={classes.layout}>
        <CalendarSidebar summaries={summaries} />
        
        <CalendarGrid 
          daysInView={daysInView}
          selectedDate={selectedDate}
          setSelectedDate={setSelectedDate}
          dailyData={dailyData}
          viewOptions={viewOptions}
        />

        <TransactionSidePanel 
          selectedDate={selectedDate} 
          transactions={fullyFilteredTransactions} 
          onToggleCompletion={handleToggleCompletion}
          onOpenAddModal={() => setIsAddModalOpen(true)}
          accountsList={accountsList}
        />
      </div>

      <TransactionForm 
        opened={isAddModalOpen} 
        onClose={() => setIsAddModalOpen(false)} 
        initialDate={selectedDate}
      />
    </Box>
  );
}