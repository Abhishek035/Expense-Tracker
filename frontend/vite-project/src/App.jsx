import React from "react";
import { useDisclosure } from "@mantine/hooks";
import "@mantine/core/styles.css";
// ‼️ import carousel styles after core package styles
import "@mantine/carousel/styles.css";
import "@mantine/charts/styles.css";

import Dashboard from "./DashBoard";
import "./index.css"; // Your CSS file
import Navbar from "./Navbar";
import TransactionForm from "./AddTransaction/TransactionForm";
import { AccountsPage } from "./pages/AccountsPage";
import { CreditPage } from "./pages/CreditPage";
import TransactionsPage from "./pages/TransactionsPage/TransactionsPage.jsx";
import CalendarPage from "./pages/CalendarPage/CalendarPage";
import BudgetPage from "./pages/BudgetPage/BudgetPage"; // <-- IMPORT BUDGET PAGE
import { Route, Routes } from "react-router-dom";

const App = () => {
  const [modalOpened, { open: openModal, close: closeModal }] =
    useDisclosure(false);

  return (
    <>
      <div className="md:grid md:grid-cols-[16rem_1fr] min-h-screen font-poppins">
        {/* Column 1: Sidebar */}
        <Navbar onAddTransactionClick={openModal} />

        {/* Column 2: Main Content */}
        <div className="p-6">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/accounts" element={<AccountsPage />} />
            <Route path="/credit-cards" element={<CreditPage />} />
            <Route path="/transactions" element={<TransactionsPage />} />
            <Route path="/calendar" element={<CalendarPage />} />
            <Route path="/budget" element={<BudgetPage />} /> {/* <-- ADDED ROUTE HERE */}
          </Routes>
          <TransactionForm opened={modalOpened} onClose={closeModal} />
        </div>
      </div>
    </>
  );
};

export default App;