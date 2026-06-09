// src/App.jsx
import React, { useState, useEffect } from "react";
import { useDisclosure } from "@mantine/hooks";
import { AppShell, Burger, Group, Text, Flex } from "@mantine/core"; // <-- NEW IMPORTS
import { IconChartLine } from "@tabler/icons-react"; // <-- NEW IMPORT
import { Route, Routes } from "react-router-dom";

import "@mantine/core/styles.css";
import "@mantine/carousel/styles.css";
import "@mantine/charts/styles.css";
import "@mantine/dates/styles.css";

import Dashboard from "./pages/Dashboard/Dashboard";
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
import LoginPage from "./pages/Auth/LoginPage";

import { supabase } from "./supabaseClient"; 

const App = () => {
  const [modalOpened, { open: openModal, close: closeModal }] = useDisclosure(false);
  // NEW: State to control the mobile hamburger menu!
  const [mobileOpened, { toggle: toggleMobile, close: closeMobile }] = useDisclosure(false);
  
  const [session, setSession] = useState(null);
  const [isInitializing, setIsInitializing] = useState(true);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setIsInitializing(false);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => subscription.unsubscribe();
  }, []);

  if (isInitializing) return null; 

  if (!session) {
    return <LoginPage />;
  }

  return (
    <AppShell
      // Only show the top header on mobile (height 0 on desktop)
      header={{ height: { base: 60, md: 0 } }}
      // Define the Sidebar behavior
      navbar={{
        width: 256,
        breakpoint: 'md',
        collapsed: { mobile: !mobileOpened },
      }}
      padding={0} // Padding is handled individually by the page components
    >
      {/* 1. MOBILE ONLY HEADER */}
      <AppShell.Header hiddenFrom="md">
        <Group h="100%" px="md">
          <Burger opened={mobileOpened} onClick={toggleMobile} hiddenFrom="md" size="sm" />
          <Flex align="center" gap="sm">
            <div style={{ backgroundColor: 'var(--mantine-color-primary-6)', color: 'white', width: 32, height: 32, borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <IconChartLine size={20} stroke={2.5} />
            </div>
            <Text fw={700} size="lg" c="dark.9">Tracker</Text>
          </Flex>
        </Group>
      </AppShell.Header>

      {/* 2. RESPONSIVE SIDEBAR */}
      <AppShell.Navbar>
        <Navbar 
          onAddTransactionClick={openModal} 
          onLinkClick={closeMobile} // Closes the mobile menu when a link is clicked
        />
      </AppShell.Navbar>

      {/* 3. MAIN CONTENT AREA */}
      <AppShell.Main bg="var(--mantine-color-gray-0)">
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
      </AppShell.Main>
    </AppShell>
  );
};

export default App;