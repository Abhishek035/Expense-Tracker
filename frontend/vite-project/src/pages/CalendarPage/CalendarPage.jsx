import React, { useState, useMemo } from 'react';
import { Box } from '@mantine/core';
import CalendarHeader from '../../components/CalendarHeader/CalendarHeader';
import CalendarSidebar from '../../components/CalendarSidebar/CalendarSidebar';
import CalendarGrid from '../../components/CalendarGrid/CalendarGrid';
import TransactionSidePanel from '../../components/TransactionSidePanel/TransactionSidePanel';
import TransactionForm from '../../AddTransaction/TransactionForm';
import { getDaysInMonthView, formatDate } from '../../utils/calendarUtils';
import { generateMockTransactions } from '../../data/mockData';
import classes from './CalendarPage.module.css';

const INITIAL_BALANCE = 12000;

export default function CalendarPage() {
  const today = new Date();
  const [currentDate, setCurrentDate] = useState(today); 
  const [selectedDate, setSelectedDate] = useState(today);
  const [viewOptions, setViewOptions] = useState({ income: true, expense: true, net: true });
  
  const [filters, setFilters] = useState({ account: [], category: [], type: [] });
  
  // Update this to use setTransactions so we can modify the mock data
  const [transactions, setTransactions] = useState(generateMockTransactions());

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  const handleAddNewTransaction = (newTxData) => {
    // Map the form's data structure to the calendar's data structure
    const formattedTx = {
      id: "t_" + Math.random().toString(36).substr(2, 9), // Generate fake ID
      date: newTxData.date.toISOString(), // Standardize date string
      amount: Number(newTxData.amount),
      type: newTxData.type,
      category: newTxData.category,
      accountId: newTxData.paymentFrom || "acc_01", // Fallback if income
      description: newTxData.description,
      isRecurring: newTxData.recurring,
      isCompleted: false // Default to false, SidePanel logic will handle it based on date
    };

    setTransactions(prev => [...prev, formattedTx]);
  };

  // Function to handle checking/unchecking a future transaction
  const handleToggleCompletion = (id) => {
    setTransactions(prev => prev.map(t => 
      t.id === id ? { ...t, isCompleted: !t.isCompleted } : t
    ));
  };

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
    let runningBalance = INITIAL_BALANCE; 

    // Get today at midnight for accurate past/future comparison
    const todayAtMidnight = new Date();
    todayAtMidnight.setHours(0, 0, 0, 0);

    daysInView.forEach(day => {
      const dateStr = formatDate(day.date);
      
      const fullyFilteredForDay = fullyFilteredTransactions.filter(t => formatDate(new Date(t.date)) === dateStr);
      let cellIncome = 0; let cellExpense = 0;
      
      // NEW: Track counts for the cell icons
      let completedCount = 0;
      let pendingCount = 0;
      let recurringCount = 0;
      
      fullyFilteredForDay.forEach(t => {
        if (t.type === 'income') cellIncome += t.amount;
        if (t.type === 'expense') cellExpense += t.amount;

        // Calculate statuses
        const txDate = new Date(t.date);
        txDate.setHours(0, 0, 0, 0);
        const isFuture = txDate > todayAtMidnight;

        if (!isFuture || t.isCompleted) {
          completedCount++;
        } else if (t.isRecurring) {
          recurringCount++;
        } else {
          pendingCount++;
        }
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
        completedCount, // Passed to DayCell
        pendingCount,   // Passed to DayCell
        recurringCount  // Passed to DayCell
      };
    });
    
    return data;
  }, [daysInView, fullyFilteredTransactions, accountFilteredTransactions]);


  const summaries = useMemo(() => {
    // ... (Keep existing summaries logic exactly the same)
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

  return (
    <Box p="md" style={{ backgroundColor: 'var(--color-background1)' }}>
      <CalendarHeader 
        currentDate={currentDate} 
        setCurrentDate={setCurrentDate} 
        viewOptions={viewOptions}
        setViewOptions={setViewOptions}
        filters={filters}
        setFilters={setFilters}
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
          onOpenAddModal={() => setIsAddModalOpen(true)} // <-- Passed the function down
        />
      </div>

      {/* ADDED: The Modal Component rendered securely at the parent level */}
      <TransactionForm 
        opened={isAddModalOpen} 
        onClose={() => setIsAddModalOpen(false)} 
        initialDate={selectedDate} // Auto-fill the date!
        onSubmitTransaction={handleAddNewTransaction} // Handle the save!
      />
    </Box>
  );
}