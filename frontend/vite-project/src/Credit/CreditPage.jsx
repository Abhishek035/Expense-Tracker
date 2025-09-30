import React, { useState, useMemo } from 'react';
import { Container } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { CreditHeader } from './CreditHeader';
import { CreditList } from './CreditList';
import { AddCreditAccountForm } from './AddCreditAccountForm';

// Demo data
const initialCreditAccounts = [
  { id: 1, nickname: 'ICICI Amazon Pay', accountType: 'Credit Card', provider: 'ICICI Bank', last4: '2042', network: 'Visa' },
  { id: 2, nickname: 'HDFC Millennia', accountType: 'Credit Card', provider: 'HDFC Bank', last4: '9876', network: 'Mastercard' },
  { id: 3, nickname: 'Simpl Pay', accountType: 'Pay Later Service', provider: 'Simpl', last4: null, network: null },
  { id: 4, nickname: 'Flipkart Pay Later', accountType: 'Pay Later Service', provider: 'IDFC First Bank', last4: null, network: null },
];

export function CreditPage() {
  const [accounts, setAccounts] = useState(initialCreditAccounts);
  const [opened, { open, close }] = useDisclosure(false);
  const [searchQuery, setSearchQuery] = useState('');

  // Memoized filtering logic
  const filteredAccounts = useMemo(() => {
    const query = searchQuery.toLowerCase().trim();
    if (!query) return accounts;

    return accounts.filter((account) =>
      Object.values(account).some((value) =>
        String(value).toLowerCase().includes(query)
      )
    );
  }, [accounts, searchQuery]);

  // Handler to add a new account
  const handleAddAccount = (newAccountData) => {
    const newAccount = {
      ...newAccountData,
      id: Math.random(), // Use a proper UUID in a real app
    };
    setAccounts((current) => [newAccount, ...current]);
  };

  return (
    <Container my="md">
      <CreditHeader
        onAddNew={open}
        onSearchChange={(event) => setSearchQuery(event.currentTarget.value)}
      />

      <CreditList accounts={filteredAccounts} />

      <AddCreditAccountForm
        opened={opened}
        onClose={close}
        onAddAccount={handleAddAccount}
      />
    </Container>
  );
}