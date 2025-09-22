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

const App = () => {
  const [modalOpened, { open: openModal, close: closeModal }] =
    useDisclosure(false);

  return (
    <>
      {/* On small screens (mobile-first), it's a single column (default).
          On 'md' screens and larger, we switch to a 2-column grid. */}
      <div className="md:grid md:grid-cols-[16rem_1fr] min-h-screen font-poppins">
        {/* 
          Column 1: Sidebar.
          - Has a fixed width of 280px on medium screens and up. This provides consistency.
          - The '1fr' in the grid-cols definition for the main content means it will take up the rest of the available space.
          - This approach is superior to col-span for a primary sidebar because the sidebar's width remains predictable and ideal for its content, while the main content area is fluid.
        */}

        <Navbar onAddTransactionClick={openModal} />

        {/* 
          Column 2: Main Content.
          - This will automatically take up the remaining space because of the '1fr' unit.
          - When you zoom, the browser recalculates the available space, and this column will reflow naturally.
        */}
        <div className="p-6">
          {/* A button or mobile menu would go here for small screens */}
          <Dashboard />
          <TransactionForm opened={modalOpened} onClose={closeModal} />
        </div>
      </div>
    </>
  );
};

export default App;
