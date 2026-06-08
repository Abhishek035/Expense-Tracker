import React, { useState, useMemo, useEffect } from "react";
import {
  Container,
  Badge,
  ActionIcon,
  Menu,
  Popover,
  Button,
  MultiSelect,
  Stack,
  Loader,
  Flex,
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

import { ListHeader } from "../../components/ListHeader";
import { ItemsList } from "../../components/ItemsList";
import { SortableItem } from "../../components/SortableItem";
import { CreditAccountForm } from "../../forms/CreditAccountForm";
import { ItemDetails } from "../../components/ItemDetails";
import { supabase } from "../../supabaseClient"; // <-- ADDED SUPABASE IMPORT

export function CreditPage() {
  const [accounts, setAccounts] = useState([]);
  const [loading, setLoading] = useState(true); // <-- ADDED LOADING STATE
  const [expandedAccountId, setExpandedAccountId] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [isFilterOpen, setIsFilterOpen] = useState(false);

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

  // --- PHASE 3: FETCH CREDIT ACCOUNTS ---
  useEffect(() => {
    fetchCreditAccounts();
  }, []);

  const fetchCreditAccounts = async () => {
    try {
      const { data, error } = await supabase
        .from("accounts")
        .select("*")
        .eq("type", "credit") // Only fetch credit accounts
        .order("created_at", { ascending: false });

      if (error) throw error;

      // Map Supabase schema back to UI expectations
      const formattedAccounts = data.map((dbAcc) => ({
        id: dbAcc.id,
        nickname: dbAcc.name,
        amount: dbAcc.balance, // UI expects 'amount' instead of 'balance'
        ...dbAcc.params, // Spreads accountType, network, provider, etc.
      }));

      setAccounts(formattedAccounts);
    } catch (error) {
      console.error("Error fetching credit accounts:", error.message);
    } finally {
      setLoading(false);
    }
  };

  // --- PHASE 3: INSERT OR UPDATE ACCOUNT ---
  const handleFormSubmit = async (formData) => {
    try {
      // 1. Format the data for the database
      const payload = {
        name: formData.nickname,
        type: "credit",
        balance: formData.amount || 0,
        params: {
          accountType: formData.accountType,
          network: formData.network,
          provider: formData.provider,
          creditLimit: formData.creditLimit,
          billingDate: formData.billingDate,
          dueDate: formData.dueDate,
        },
      };

      if (formData.id) {
        // UPDATE EXISTING ACCOUNT
        payload.edited_at = new Date().toISOString();
        const { data, error } = await supabase
          .from("accounts")
          .update(payload)
          .eq("id", formData.id)
          .select();

        if (error) throw error;

        const dbAcc = data[0];
        const updatedAccount = {
          id: dbAcc.id,
          nickname: dbAcc.name,
          amount: dbAcc.balance,
          ...dbAcc.params,
        };

        setAccounts((current) =>
          current.map((acc) =>
            acc.id === updatedAccount.id ? updatedAccount : acc
          )
        );
      } else {
        // INSERT NEW ACCOUNT
        const { data, error } = await supabase
          .from("accounts")
          .insert([payload])
          .select();

        if (error) throw error;

        const dbAcc = data[0];
        const newAccount = {
          id: dbAcc.id,
          nickname: dbAcc.name,
          amount: dbAcc.balance,
          ...dbAcc.params,
        };

        setAccounts((current) => [newAccount, ...current]);
      }

      closeForm();
      setSelectedAccount(null);
    } catch (error) {
      console.error("Error saving credit account:", error.message);
    }
  };

  // --- PHASE 3: DELETE ACCOUNT ---
  const handleDeleteAccount = async (accountId) => {
    try {
      const { error } = await supabase
        .from("accounts")
        .delete()
        .eq("id", accountId);

      if (error) throw error;

      setAccounts((current) =>
        current.filter((account) => account.id !== accountId)
      );
    } catch (error) {
      console.error("Error deleting credit account:", error.message);
    }
  };

  const handleToggleExpand = (accountId) => {
    setExpandedAccountId(expandedAccountId === accountId ? null : accountId);
  };

  const openEditModal = (account) => {
    setSelectedAccount(account);
    openForm();
  };

  const openAddModal = () => {
    setSelectedAccount(null);
    openForm();
  };

  // Dynamically generate filter options from the available accounts
  const { accountTypeData, networkData, providerData } = useMemo(() => {
    const types = new Set();
    const networks = new Set();
    const providers = new Set();

    accounts.forEach((acc) => {
      if (acc.accountType) types.add(acc.accountType);
      if (acc.network) networks.add(acc.network);
      if (acc.provider) providers.add(acc.provider);
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
      // Safe, explicit search mapping
      const matchesSearch =
        !query ||
        (account.nickname || "").toLowerCase().includes(query) ||
        (account.accountType || "").toLowerCase().includes(query) ||
        (account.network || "").toLowerCase().includes(query) ||
        (account.provider || "").toLowerCase().includes(query);

      const matchesType =
        selectedAccountTypes.length === 0 ||
        selectedAccountTypes.includes(account.accountType);
      const matchesNetwork =
        selectedNetworks.length === 0 ||
        selectedNetworks.includes(account.network);
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

  const filterControls = (
    <Popover
      opened={isFilterOpen}      
      onChange={setIsFilterOpen}  
      shadow="md"
      width={250}
      position="bottom-end"
      withArrow
      trapFocus={false}      
    >
      <Popover.Target>
        <Button
          variant="default"
          leftSection={<IconFilter size={16} />}
          rightSection={<IconChevronDown size={16} />}
          onClick={() => setIsFilterOpen((o) => !o)}
        >
          Filter
        </Button>
      </Popover.Target>
      
      <Popover.Dropdown onClick={(e) => e.stopPropagation()}>
        <Stack p="xs" gap="xs">
          <MultiSelect
            label="Account type"
            data={accountTypeData}
            value={selectedAccountTypes}
            onChange={setSelectedAccountTypes}
            placeholder="Filter by type"
            clearable
            comboboxProps={{ withinPortal: false }}
          />
          <MultiSelect
            label="Card network"
            data={networkData}
            value={selectedNetworks}
            onChange={setSelectedNetworks}
            placeholder="Filter by network"
            clearable
            comboboxProps={{ withinPortal: false }}
          />
          <MultiSelect
            label="Provider / Bank"
            data={providerData}
            value={selectedProviders}
            onChange={setSelectedProviders}
            placeholder="Filter by provider"
            clearable
            comboboxProps={{ withinPortal: false }}
          />
        </Stack>
      </Popover.Dropdown>
    </Popover>
  );

  const renderAccountItem = (account) => {
    const isExpanded = expandedAccountId === account.id;

    const handleEyeClick = (e) => {
      e.stopPropagation();
      handleToggleExpand(account.id);
    };

    return (
      <SortableItem
        key={account.id}
        id={account.id}
        isExpanded={isExpanded}
        onToggleExpand={() => handleToggleExpand(account.id)}
        icon={<IconCreditCard size={24} />}
        title={account.nickname}
        mainValue={`₹${(account.amount || 0).toLocaleString("en-IN")}`}
        badges={
          <>
            <Badge variant="light" size="sm" radius="sm" color="primary">
              {account.accountType || "Credit"}
            </Badge>
            {account.network && (
              <Badge variant="light" size="sm" radius="sm" color="gray">
                {account.network}
              </Badge>
            )}
          </>
        }
        actions={
          <>
            <ActionIcon
              variant="subtle"
              color="gray"
              aria-label="View details"
              onClick={handleEyeClick}
            >
              <IconEye size={18} />
            </ActionIcon>
            <Menu shadow="md" width={200}>
              <Menu.Target>
                <ActionIcon
                  variant="subtle"
                  color="gray"
                  aria-label="More options"
                  onClick={(e) => e.stopPropagation()}
                >
                  <IconDotsVertical size={18} />
                </ActionIcon>
              </Menu.Target>
              <Menu.Dropdown>
                <Menu.Item
                  leftSection={<IconEdit size={14} />}
                  onClick={() => openEditModal(account)}
                >
                  Edit
                </Menu.Item>
                <Menu.Item
                  leftSection={<IconTrash size={14} />}
                  onClick={() => handleDeleteAccount(account.id)}
                  color="red"
                >
                  Delete
                </Menu.Item>
              </Menu.Dropdown>
            </Menu>
          </>
        }
        details={<ItemDetails account={account} />}
      />
    );
  };

  return (
    <Container my="md">
      <ListHeader
        title="All Credit Accounts"
        onAddNew={openAddModal}
        onSearchChange={(e) => setSearchQuery(e.currentTarget.value)}
        filterControls={filterControls}
      />

      {loading ? (
        <Flex justify="center" mt="xl">
          <Loader color="primary" />
        </Flex>
      ) : (
        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragEnd={handleDragEnd}
        >
          <ItemsList
            items={filteredAccounts}
            renderItem={renderAccountItem}
            noItemsMessage='No credit accounts found. Click "Add New" to get started!'
          />
        </DndContext>
      )}

      <CreditAccountForm
        opened={isFormOpen}
        onClose={closeForm}
        onSubmit={handleFormSubmit}
        account={selectedAccount}
      />
    </Container>
  );
}
