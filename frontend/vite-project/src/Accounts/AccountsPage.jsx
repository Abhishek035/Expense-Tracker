import React, { useState, useMemo } from "react";
import { Container } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { AccountHeader } from "./AccountHeader";
import { AccountList } from "./AccountList";
import { AddAccountForm } from "./AddAccountForm";

// Placeholder data with lowercase status for easier filtering
const initialAccounts = [
    { id: 1, type: "Wallet", nickname: "Paytm Wallet", balance: 769.86, provider: "Paytm", status: "active" },
    { id: 2, type: "Bank Account", nickname: "Salary Account", balance: 15984.5, bankName: "HDFC Bank", status: "active" },
    { id: 3, type: "Bank Account", nickname: "Old Savings", balance: 1250.0, bankName: "ICICI Bank", status: "archived" },
    { id: 4, type: "Wallet", nickname: "GPay", balance: 2500.5, provider: "Google Pay", status: "active" },
    { id: 5, type: "Bank Account", nickname: "Emergency Fund", balance: 50000.0, bankName: "Kotak Mahindra Bank", status: "active" },
];

export function AccountsPage() {
  const [accounts, setAccounts] = useState(initialAccounts);
  const [opened, { open, close }] = useDisclosure(false);

  // State for search and multi-select filters
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedAccountTypes, setSelectedAccountTypes] = useState([]);
  const [selectedArchiveStatus, setSelectedArchiveStatus] = useState(['active']); // Default to show active

  const filteredAccounts = useMemo(() => {
    const query = searchQuery.toLowerCase().trim();

    return accounts.filter((account) => {
      // Search filter logic
      const matchesSearch =
        !query ||
        account.nickname.toLowerCase().includes(query) ||
        account.type.toLowerCase().includes(query) ||
        account.bankName?.toLowerCase().includes(query) ||
        account.provider?.toLowerCase().includes(query);

      // Account Type filter logic (if empty, show all)
      const matchesType =
        selectedAccountTypes.length === 0 ||
        selectedAccountTypes.includes(account.type);

      // Archive Status filter logic (if empty, show all)
      const matchesStatus =
        selectedArchiveStatus.length === 0 ||
        selectedArchiveStatus.includes(account.status);

      return matchesSearch && matchesType && matchesStatus;
    });
  }, [accounts, searchQuery, selectedAccountTypes, selectedArchiveStatus]);

  const handleAddAccount = (newAccountData) => {
    const newAccount = {
      ...newAccountData,
      id: Math.random(),
      balance: 0,
      status: "active",
    };
    setAccounts((currentAccounts) => [newAccount, ...currentAccounts]);
  };

  return (
    <Container my="md">
      <AccountHeader
        onAddNew={open}
        onSearchChange={(event) => setSearchQuery(event.currentTarget.value)}
        selectedAccountTypes={selectedAccountTypes}
        onAccountTypesChange={setSelectedAccountTypes}
        selectedArchiveStatus={selectedArchiveStatus}
        onArchiveStatusChange={setSelectedArchiveStatus}
      />
      <AccountList accounts={filteredAccounts} />
      <AddAccountForm
        opened={opened}
        onClose={close}
        onAddAccount={handleAddAccount}
      />
    </Container>
  );
}