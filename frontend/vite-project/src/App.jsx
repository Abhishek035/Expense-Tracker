import React, { useState, useEffect } from "react";
import { useDisclosure } from "@mantine/hooks";
import "@mantine/core/styles.css";
import "@mantine/carousel/styles.css";
import "@mantine/charts/styles.css";
import "@mantine/dates/styles.css";

// Your Pages & Components
import Dashboard from "./pages/Dashboard/Dashboard"; // Ensure this path is correct
import "./index.css"; 
import Navbar from "./Navbar";
import TransactionForm from "./AddTransaction/TransactionForm";
import { AccountsPage } from "./pages/AccountsPage";
import { CreditPage } from "./pages/CreditPage";
import TransactionsPage from "./pages/TransactionsPage/TransactionsPage.jsx";
import CalendarPage from "./pages/CalendarPage/CalendarPage";
import BudgetPage from "./pages/BudgetPage/BudgetPage"; 
import RemindersPage from "./pages/RemindersPage/RemindersPage"; 
import StatisticsPage from "./pages/StatisticsPage/StatisticsPage";
import LoginPage from "./pages/Auth/LoginPage"; // <-- IMPORT LOGIN PAGE

import { Route, Routes } from "react-router-dom";
import { supabase } from "./supabaseClient"; // <-- IMPORT SUPABASE

const App = () => {
  const [modalOpened, { open: openModal, close: closeModal }] = useDisclosure(false);
  
  // AUTH STATE
  const [session, setSession] = useState(null);
  const [isInitializing, setIsInitializing] = useState(true);

  useEffect(() => {
    // 1. Get the current session on load
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setIsInitializing(false);
    });

    // 2. Listen for login/logout events automatically
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => subscription.unsubscribe();
  }, []);

  // Show a blank screen or a loading spinner while Supabase checks if you are logged in
  if (isInitializing) return null; 

  // If no session exists, ONLY show the login page
  if (!session) {
    return <LoginPage />;
  }

  // If session exists, show the main app!
  return (
    <div className="md:grid md:grid-cols-[16rem_1fr] min-h-screen font-poppins">
      <Navbar onAddTransactionClick={openModal} />

      <div className="p-6" style={{ backgroundColor: 'var(--mantine-color-gray-0)' }}>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/accounts" element={<AccountsPage />} />
          <Route path="/credit-cards" element={<CreditPage />} />
          <Route path="/transactions" element={<TransactionsPage />} />
          <Route path="/calendar" element={<CalendarPage />} />
          <Route path="/budget" element={<BudgetPage />} /> 
          <Route path="/reminders" element={<RemindersPage />} />
          <Route path="/statistics" element={<StatisticsPage />} />
        </Routes>
        <TransactionForm opened={modalOpened} onClose={closeModal} />
      </div>
    </div>
  );
};

export default App;