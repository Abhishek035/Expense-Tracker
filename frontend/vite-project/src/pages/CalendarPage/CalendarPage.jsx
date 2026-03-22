import React, { useState, useMemo } from 'react';
import { Box } from '@mantine/core';
import CalendarHeader from '../../components/CalendarHeader/CalendarHeader';
import CalendarSidebar from '../../components/CalendarSidebar/CalendarSidebar';
import CalendarGrid from '../../components/CalendarGrid/CalendarGrid';
import TransactionSidePanel from '../../components/TransactionSidePanel/TransactionSidePanel';
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
  const [transactions] = useState(generateMockTransactions());

  const daysInView = useMemo(() => getDaysInMonthView(currentDate.getFullYear(), currentDate.getMonth()), [currentDate]);

  // Apply ALL filters to determine what visually shows up in the day cell rows and side panel
  const fullyFilteredTransactions = useMemo(() => {
    return transactions.filter(t => {
      const accountMatch = filters.account.length === 0 || filters.account.includes(t.accountId);
      const categoryMatch = filters.category.length === 0 || filters.category.includes(t.category);
      const typeMatch = filters.type.length === 0 || filters.type.includes(t.type);
      return accountMatch && categoryMatch && typeMatch;
    });
  }, [transactions, filters]);

  // Apply ONLY ACCOUNT filters to determine the true projected balance
  const accountFilteredTransactions = useMemo(() => {
    return transactions.filter(t => {
      // Ignore category and type filters, only filter by the selected accounts
      return filters.account.length === 0 || filters.account.includes(t.accountId);
    });
  }, [transactions, filters.account]);

  // Calculate daily data
  const dailyData = useMemo(() => {
    const data = {};
    let runningBalance = INITIAL_BALANCE; 

    daysInView.forEach(day => {
      const dateStr = formatDate(day.date);
      
      // 1. Calculate the VISUAL Income/Expense/Net for the cell using FULLY filtered data
      const fullyFilteredForDay = fullyFilteredTransactions.filter(t => formatDate(new Date(t.date)) === dateStr);
      let cellIncome = 0; let cellExpense = 0;
      
      fullyFilteredForDay.forEach(t => {
        if (t.type === 'income') cellIncome += t.amount;
        if (t.type === 'expense') cellExpense += t.amount;
      });

      // 2. Calculate the TRUE net for the PROJECTED BALANCE using ONLY account-filtered data
      const accountFilteredForDay = accountFilteredTransactions.filter(t => formatDate(new Date(t.date)) === dateStr);
      let trueNet = 0;
      
      accountFilteredForDay.forEach(t => {
        if (t.type === 'income') trueNet += t.amount;
        if (t.type === 'expense') trueNet -= t.amount;
      });

      runningBalance += trueNet; // Updates balance accurately based on accounts alone

      data[dateStr] = { 
        income: cellIncome, 
        expense: cellExpense, 
        net: cellIncome - cellExpense, // Visual net for the cell
        projected: runningBalance      // True running balance
      };
    });
    
    return data;
  }, [daysInView, fullyFilteredTransactions, accountFilteredTransactions]);

  // Compute Summaries for the Sidebar (Based on fully filtered data so summaries match what the user sees)
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

      if (day.isCurrentMonth) {
        monthlyIncome += dData.income;
        monthlyExpense += dData.expense;
      }

      const dayTime = day.date.getTime();
      if (dayTime >= startOfWeek.getTime() && dayTime <= endOfWeek.getTime()) {
        weeklyIncome += dData.income;
        weeklyExpense += dData.expense;
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
        />
      </div>
    </Box>
  );
}