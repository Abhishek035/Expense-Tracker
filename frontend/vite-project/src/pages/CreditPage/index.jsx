import React, { useState, useMemo } from 'react';
import { Container } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors } from '@dnd-kit/core';
import { arrayMove, sortableKeyboardCoordinates } from '@dnd-kit/sortable';

import { initialCreditAccounts, mockTransactions } from '../../data/mockData';
import { CreditHeader } from '../../components/CreditHeader';
import { CreditList } from '../../components/CreditList';
import { CreditAccountForm } from '../../forms/CreditAccountForm';

export function CreditPage() {
  const [accounts, setAccounts] = useState(initialCreditAccounts);
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedAccountId, setExpandedAccountId] = useState(null);
  
  const [isFormOpen, { open: openForm, close: closeForm }] = useDisclosure(false);
  const [selectedAccount, setSelectedAccount] = useState(null);

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

  const handleFormSubmit = (formData) => {
    if (formData.id) { // Editing existing account
      setAccounts((current) =>
        current.map((account) =>
          account.id === formData.id ? { ...account, ...formData } : account
        )
      );
    } else { // Adding new account
      const newAccount = { 
        ...formData, 
        id: Math.random(), 
        creationDate: new Date().toISOString().split('T')[0], 
        transactions: mockTransactions(new Date().toISOString().split('T')[0]) 
      };
      setAccounts((current) => [newAccount, ...current]);
    }
    setSelectedAccount(null);
  };

  const handleDeleteAccount = (accountId) => {
    setAccounts((current) => current.filter((account) => account.id !== accountId));
  };
  
  const openEditModal = (account) => {
    setSelectedAccount(account);
    openForm();
  };
  
  const openAddModal = () => {
      setSelectedAccount(null);
      openForm();
  }

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
      <CreditHeader onAddNew={openAddModal} onSearchChange={(e) => setSearchQuery(e.currentTarget.value)} />
      <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
        <CreditList
          accounts={filteredAccounts}
          onEdit={openEditModal}
          onDelete={handleDeleteAccount}
          expandedAccountId={expandedAccountId}
          onToggleExpand={handleToggleExpand}
        />
      </DndContext>
      <CreditAccountForm
        opened={isFormOpen}
        onClose={closeForm}
        onSubmit={handleFormSubmit}
        account={selectedAccount}
      />
    </Container>
  );
}