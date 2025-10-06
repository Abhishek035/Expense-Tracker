import React, { useState, useMemo } from 'react';
import { Container } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors } from '@dnd-kit/core';
import { arrayMove, sortableKeyboardCoordinates } from '@dnd-kit/sortable';
import { CreditHeader } from './CreditHeader';
import { CreditList } from './CreditList';
import { AddCreditAccountForm } from './AddCreditAccountForm';
import { EditCreditAccountForm } from './EditCreditAccountForm';
import { mockTransactions } from './mockData';

// Demo data with creationDate
const initialCreditAccounts = [
  { id: 1, nickname: 'ICICI Amazon Pay', accountType: 'Credit Card', provider: 'ICICI Bank', last4: '2042', network: 'Visa', amount: '5000', creationDate: '2022-06-15', transactions: mockTransactions('2022-06-15') },
  { id: 2, nickname: 'HDFC Millennia', accountType: 'Credit Card', provider: 'HDFC Bank', last4: '9876', network: 'Mastercard', amount: '12000', creationDate: '2020-11-20', transactions: mockTransactions('2020-11-20') },
  { id: 3, nickname: 'Simpl Pay', accountType: 'Pay Later Service', provider: 'Simpl', last4: null, network: null, amount: '800', creationDate: '2023-01-10', transactions: mockTransactions('2023-01-10') },
  { id: 4, nickname: 'Flipkart Pay Later', accountType: 'Pay Later Service', provider: 'IDFC First Bank', last4: null, network: null, amount: '2500', creationDate: '2021-08-01', transactions: mockTransactions('2021-08-01') },
];

export function CreditPage() {
  const [accounts, setAccounts] = useState(initialCreditAccounts);
  const [opened, { open, close }] = useDisclosure(false);
  const [editOpened, { open: openEdit, close: closeEdit }] = useDisclosure(false);
  const [selectedAccount, setSelectedAccount] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedAccountId, setExpandedAccountId] = useState(null);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  const filteredAccounts = useMemo(() => {
    const query = searchQuery.toLowerCase().trim();
    if (!query) return accounts;
    return accounts.filter((account) =>
      Object.values(account).some((value) => String(value).toLowerCase().includes(query))
    );
  }, [accounts, searchQuery]);

  const handleAddAccount = (newAccountData) => {
    const newAccount = { ...newAccountData, id: Math.random(), creationDate: new Date().toISOString().split('T')[0], transactions: mockTransactions(new Date().toISOString().split('T')[0]) };
    setAccounts((current) => [newAccount, ...current]);
  };

  const handleEditAccount = (updatedAccountData) => {
    setAccounts((current) =>
      current.map((account) =>
        account.id === updatedAccountData.id ? { ...account, ...updatedAccountData } : account
      )
    );
    setSelectedAccount(null);
  };

  const handleDeleteAccount = (accountId) => {
    setAccounts((current) => current.filter((account) => account.id !== accountId));
  };

  const openEditModal = (account) => {
    setSelectedAccount(account);
    openEdit();
  };

  const handleToggleExpand = (accountId) => {
    setExpandedAccountId(expandedAccountId === accountId ? null : accountId);
  };

  function handleDragEnd(event) {
    const { active, over } = event;
    if (active.id !== over.id) {
      setAccounts((items) => {
        const oldIndex = items.findIndex((item) => item.id === active.id);
        const newIndex = items.findIndex((item) => item.id === over.id);
        return arrayMove(items, oldIndex, newIndex);
      });
    }
  }

  return (
    <Container my="md">
      <CreditHeader onAddNew={open} onSearchChange={(e) => setSearchQuery(e.currentTarget.value)} />
      <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
        <CreditList
          accounts={filteredAccounts}
          onEdit={openEditModal}
          onDelete={handleDeleteAccount}
          expandedAccountId={expandedAccountId}
          onToggleExpand={handleToggleExpand}
        />
      </DndContext>
      <AddCreditAccountForm opened={opened} onClose={close} onAddAccount={handleAddAccount} />
      {selectedAccount && (
        <EditCreditAccountForm
          opened={editOpened}
          onClose={closeEdit}
          onEditAccount={handleEditAccount}
          account={selectedAccount}
        />
      )}
    </Container>
  );
}
