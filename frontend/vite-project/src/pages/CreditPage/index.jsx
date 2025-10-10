import React, { useState, useMemo } from "react";
import {
  Container,
  Badge,
  ActionIcon,
  Menu,
  Button,
  MultiSelect,
  Stack,
} from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import { arrayMove, sortableKeyboardCoordinates } from "@dnd-kit/sortable";
import {
  IconCreditCard,
  IconEye,
  IconDotsVertical,
  IconFilter,
  IconChevronDown,
  IconEdit,
  IconTrash,
} from "@tabler/icons-react";

import { initialCreditAccounts, mockTransactions } from "../../data/mockData";
import { ListHeader } from "../../components/ListHeader";
import { ItemsList } from "../../components/ItemsList";
import { SortableItem } from "../../components/SortableItem";
import { CreditAccountForm } from "../../forms/CreditAccountForm";

export function CreditPage() {
  const [accounts, setAccounts] = useState(initialCreditAccounts);
  const [searchQuery, setSearchQuery] = useState("");

  // State for the filters
  const [selectedAccountTypes, setSelectedAccountTypes] = useState([]);
  const [selectedNetworks, setSelectedNetworks] = useState([]);
  const [selectedProviders, setSelectedProviders] = useState([]);

  const [isFormOpen, { open: openForm, close: closeForm }] =
    useDisclosure(false);
  const [selectedAccount, setSelectedAccount] = useState(null);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  // Dynamically generate filter options from the available accounts
  const { accountTypeData, networkData, providerData } = useMemo(() => {
    const types = new Set();
    const networks = new Set();
    const providers = new Set();

    accounts.forEach((acc) => {
      types.add(acc.accountType);
      if (acc.network) networks.add(acc.network);
      providers.add(acc.provider);
    });

    return {
      accountTypeData: [...types],
      networkData: [...networks],
      providerData: [...providers],
    };
  }, [accounts]);

  const filteredAccounts = useMemo(() => {
    const query = searchQuery.toLowerCase().trim();
    return accounts.filter((account) => {
      // Search filter
      const matchesSearch =
        !query ||
        Object.values(account).some((value) =>
          String(value).toLowerCase().includes(query)
        );

      // Account Type filter
      const matchesType =
        selectedAccountTypes.length === 0 ||
        selectedAccountTypes.includes(account.accountType);

      // Network filter
      const matchesNetwork =
        selectedNetworks.length === 0 ||
        selectedNetworks.includes(account.network);

      // Provider filter
      const matchesProvider =
        selectedProviders.length === 0 ||
        selectedProviders.includes(account.provider);

      return matchesSearch && matchesType && matchesNetwork && matchesProvider;
    });
  }, [
    accounts,
    searchQuery,
    selectedAccountTypes,
    selectedNetworks,
    selectedProviders,
  ]);

  const handleFormSubmit = (formData) => {
    if (formData.id) {
      setAccounts((current) =>
        current.map((account) =>
          account.id === formData.id ? { ...account, ...formData } : account
        )
      );
    } else {
      const newAccount = {
        ...formData,
        id: Math.random(),
        creationDate: new Date().toISOString().split("T")[0],
        transactions: mockTransactions(new Date().toISOString().split("T")[0]),
      };
      setAccounts((current) => [newAccount, ...current]);
    }
    setSelectedAccount(null);
  };

  const handleDeleteAccount = (accountId) => {
    setAccounts((current) =>
      current.filter((account) => account.id !== accountId)
    );
  };

  const openEditModal = (account) => {
    setSelectedAccount(account);
    openForm();
  };

  const openAddModal = () => {
    setSelectedAccount(null);
    openForm();
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

  // --- Completed Filter Controls UI ---
  const filterControls = (
    <Menu
      shadow="md"
      width={250}
      closeOnItemClick={false}
      position="bottom-end"
    >
      <Menu.Target>
        <Button
          variant="default"
          leftSection={<IconFilter size={16} />}
          rightSection={<IconChevronDown size={16} />}
        >
          Filter
        </Button>
      </Menu.Target>
      <Menu.Dropdown>
        <Stack p="xs" gap="xs">
          <MultiSelect
            label="Account type"
            data={accountTypeData}
            value={selectedAccountTypes}
            onChange={setSelectedAccountTypes}
            placeholder="Filter by type"
            clearable
          />
          <MultiSelect
            label="Card network"
            data={networkData}
            value={selectedNetworks}
            onChange={setSelectedNetworks}
            placeholder="Filter by network"
            clearable
          />
          <MultiSelect
            label="Provider / Bank"
            data={providerData}
            value={selectedProviders}
            onChange={setSelectedProviders}
            placeholder="Filter by provider"
            clearable
          />
        </Stack>
      </Menu.Dropdown>
    </Menu>
  );

  const renderAccountItem = (account) => (
    <SortableItem
      key={account.id}
      id={account.id}
      icon={<IconCreditCard size={24} />}
      title={account.nickname}
      mainValue={`₹${account.amount.toLocaleString("en-IN")}`}
      badges={
        <>
          <Badge variant="light" size="sm" radius="sm">
            {account.accountType}
          </Badge>
          {account.network && (
            <Badge variant="light" size="sm" radius="sm">
              {account.network}
            </Badge>
          )}
        </>
      }
      actions={
         <Menu shadow="md" width={200}>
            <Menu.Target>
              <ActionIcon variant="subtle" color="gray" aria-label="More options" onClick={(e) => e.stopPropagation()}>
                <IconDotsVertical size={18} />
              </ActionIcon>
            </Menu.Target>
            <Menu.Dropdown>
              <Menu.Item leftSection={<IconEdit size={14} />} onClick={() => openEditModal(account)}>Edit</Menu.Item>
              <Menu.Item leftSection={<IconTrash size={14} />} onClick={() => handleDeleteAccount(account.id)} color="red">Delete</Menu.Item>
            </Menu.Dropdown>
          </Menu>
      }
    />
  );

  return (
    <Container my="md">
      <ListHeader
        title="All Credit Accounts"
        onAddNew={openAddModal}
        onSearchChange={(e) => setSearchQuery(e.currentTarget.value)}
        filterControls={filterControls}
      />
      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
      >
        <ItemsList
          items={filteredAccounts}
          renderItem={renderAccountItem}
          noItemsMessage='No accounts found. Click "Add New" to get started!'
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