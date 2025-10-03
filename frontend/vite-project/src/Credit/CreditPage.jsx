import React, { useState, useMemo } from 'react';
import { Container } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors } from '@dnd-kit/core';
import { arrayMove, sortableKeyboardCoordinates } from '@dnd-kit/sortable';
import { CreditHeader } from './CreditHeader';
import { CreditList } from './CreditList';
import { AddCreditAccountForm } from './AddCreditAccountForm';
import { EditCreditAccountForm } from './EditCreditAccountForm';

// Demo data
const initialCreditAccounts = [
  { id: 1, nickname: 'ICICI Amazon Pay', accountType: 'Credit Card', provider: 'ICICI Bank', last4: '2042', network: 'Visa', amount: '5000' },
  { id: 2, nickname: 'HDFC Millennia', accountType: 'Credit Card', provider: 'HDFC Bank', last4: '9876', network: 'Mastercard', amount: '12000' },
  { id: 3, nickname: 'Simpl Pay', accountType: 'Pay Later Service', provider: 'Simpl', last4: null, network: null, amount: '800' },
  { id: 4, nickname: 'Flipkart Pay Later', accountType: 'Pay Later Service', provider: 'IDFC First Bank', last4: null, network: null, amount: '2500' },
];

export function CreditPage() {
  const [accounts, setAccounts] = useState(initialCreditAccounts);
  const [opened, { open, close }] = useDisclosure(false);
  const [editOpened, { open: openEdit, close: closeEdit }] = useDisclosure(false);
  const [selectedAccount, setSelectedAccount] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

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
    const newAccount = { ...newAccountData, id: Math.random() };
    setAccounts((current) => [newAccount, ...current]);
  };

  // Handler to edit an account
  const handleEditAccount = (updatedAccountData) => {
    setAccounts((current) =>
      current.map((account) =>
        account.id === updatedAccountData.id ? updatedAccountData : account
      )
    );
    setSelectedAccount(null);
  };

  // Handler to delete an account
  const handleDeleteAccount = (accountId) => {
    setAccounts((current) => current.filter((account) => account.id !== accountId));
  };

  const openEditModal = (account) => {
    setSelectedAccount(account);
    openEdit();
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
      <CreditHeader
        onAddNew={open}
        onSearchChange={(event) => setSearchQuery(event.currentTarget.value)}
      />

      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
      >
        <CreditList
          accounts={filteredAccounts}
          onEdit={openEditModal}
          onDelete={handleDeleteAccount}
        />
      </DndContext>

      <AddCreditAccountForm
        opened={opened}
        onClose={close}
        onAddAccount={handleAddAccount}
      />

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