import React, { useState, useMemo, useEffect } from "react";
import {
  Container,
  Badge,
  ActionIcon,
  Menu,
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
  IconEye,
  IconDotsVertical,
  IconWallet,
  IconBuildingBank,
  IconFilter,
  IconChevronDown,
  IconEdit,
  IconTrash,
} from "@tabler/icons-react";

import { ListHeader } from "../../components/ListHeader";
import { ItemsList } from "../../components/ItemsList";
import { SortableItem } from "../../components/SortableItem";
import { AccountForm } from "../../forms/AccountForm";
import { ItemDetails } from "../../components/ItemDetails";
import { supabase } from "../../supabaseClient"; // <-- ADDED SUPABASE IMPORT

const getAccountIcon = (type) => {
  return type === "Bank Account" ? (
    <IconBuildingBank size={24} />
  ) : (
    <IconWallet size={24} />
  );
};

const accountTypeData = ["Bank Account", "Wallet"];
const archiveStatusData = [
  { value: "active", label: "Active" },
  { value: "archived", label: "Archived" },
];

export function AccountsPage() {
  // Removed mock data, initialized as empty array
  const [accounts, setAccounts] = useState([]);
  const [loading, setLoading] = useState(true); // <-- ADDED LOADING STATE
  const [expandedAccountId, setExpandedAccountId] = useState(null);
  const [opened, { open, close }] = useDisclosure(false);

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedAccountTypes, setSelectedAccountTypes] = useState([]);
  const [selectedArchiveStatus, setSelectedArchiveStatus] = useState(["active"]);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  // --- PHASE 3: FETCH ACCOUNTS FROM SUPABASE ---
  useEffect(() => {
    fetchAccounts();
  }, []);

  const fetchAccounts = async () => {
    try {
      const { data, error } = await supabase
        .from("accounts")
        .select("*")
        .neq("type", "credit") 
        .order("created_at", { ascending: false });

      if (error) throw error;

      // Map Supabase schema back to UI expectations
      const formattedAccounts = data.map((dbAcc) => ({
        id: dbAcc.id,
        nickname: dbAcc.name,
        type: dbAcc.type,
        balance: dbAcc.balance,
        status: dbAcc.params?.status || "active",
        ...dbAcc.params, // Spreads extra fields like bankName or provider from JSONB
      }));

      setAccounts(formattedAccounts);
    } catch (error) {
      console.error("Error fetching accounts:", error.message);
    } finally {
      setLoading(false);
    }
  };

  // --- PHASE 3: INSERT ACCOUNT INTO SUPABASE ---
  const handleAddAccount = async (newAccountData) => {
    try {
      // 1. Format the data for the database
      const accountToInsert = {
        name: newAccountData.nickname,
        type: newAccountData.type,
        
        balance: newAccountData.balance || 0, 
        
        params: { status: "active", bankName: newAccountData.bankName },
      };

      // 2. Insert and ask Supabase to return the new row
      const { data, error } = await supabase
        .from("accounts")
        .insert([accountToInsert])
        .select();

      if (error) throw error;

      const dbAcc = data[0];
      const newAccount = {
        id: dbAcc.id,
        nickname: dbAcc.name,
        type: dbAcc.type,
        balance: dbAcc.balance,
        status: dbAcc.params?.status || "active",
        ...dbAcc.params,
      };

      // 3. Update the UI instantly
      setAccounts((current) => [newAccount, ...current]);
      close();
    } catch (error) {
      console.error("Error adding account:", error.message);
    }
  };

  // --- NEW: DELETE ACCOUNT FROM SUPABASE ---
  const handleDeleteAccount = async (accountId) => {
    try {
      const { error } = await supabase
        .from("accounts")
        .delete()
        .eq("id", accountId);

      if (error) throw error;

      // Update UI by filtering out the deleted account
      setAccounts((prev) => prev.filter((acc) => acc.id !== accountId));
    } catch (error) {
      console.error("Error deleting account:", error.message);
    }
  };

  const { accountTypeData, archiveStatusData } = useMemo(() => {
    const types = new Set();
    const statuses = new Set();
    accounts.forEach(acc => {
      if (acc.type) types.add(acc.type);
      if (acc.status) statuses.add(acc.status);
    });
    return { accountTypeData: [...types], archiveStatusData: [...statuses] };
  }, [accounts]);

  const filteredAccounts = useMemo(() => {
    const query = searchQuery.toLowerCase().trim();
    return accounts.filter((account) => {
      const matchesSearch =
        !query ||
        (account.nickname || '').toLowerCase().includes(query) ||
        (account.type || '').toLowerCase().includes(query) ||
        (account.bankName || '').toLowerCase().includes(query) ||
        (account.provider || '').toLowerCase().includes(query);
        
      const matchesType = selectedAccountTypes.length === 0 || selectedAccountTypes.includes(account.type);
      const matchesStatus = selectedArchiveStatus.length === 0 || selectedArchiveStatus.includes(account.status);
      
      return matchesSearch && matchesType && matchesStatus;
    });
  }, [accounts, searchQuery, selectedAccountTypes, selectedArchiveStatus]);

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
            label="Archive status"
            data={archiveStatusData}
            value={selectedArchiveStatus}
            onChange={setSelectedArchiveStatus}
            placeholder="Filter by status"
            clearable
          />
        </Stack>
      </Menu.Dropdown>
    </Menu>
  );

  const handleToggleExpand = (accountId) => {
    setExpandedAccountId(expandedAccountId === accountId ? null : accountId);
  };

  const renderAccountItem = (account) => {
    const isArchived = account.status === "archived";
    const isExpanded = expandedAccountId === account.id;

    const handleEyeClick = (e) => {
      e.stopPropagation();
      handleToggleExpand(account.id);
    };

    return (
      <SortableItem
        key={account.id}
        id={account.id}
        isDimmed={isArchived}
        isExpanded={isExpanded}
        onToggleExpand={() => handleToggleExpand(account.id)}
        icon={getAccountIcon(account.type)}
        title={account.nickname}
        mainValue={`₹${account.balance.toLocaleString("en-IN")}`}
        badges={
          <>
            <Badge variant="light" size="sm" radius="sm" color="primary">
              {account.type}
            </Badge>
            {isArchived && (
              <Badge color="gray" variant="filled" size="sm" radius="sm">
                Archived
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
                >
                  Edit
                </Menu.Item>
                {/* UNCOMMENTED AND HOOKED UP DELETE */}
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
        title="All Accounts"
        onAddNew={open}
        onSearchChange={(e) => setSearchQuery(e.currentTarget.value)}
        filterControls={filterControls}
      />
      
      {/* SHOW LOADING SPINNER OR DRAG CONTEXT */}
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
            noItemsMessage='No accounts found. Click "Add New" to add an account!'
          />
        </DndContext>
      )}

      <AccountForm
        opened={opened}
        onClose={close}
        onAddAccount={handleAddAccount}
      />
    </Container>
  );
}