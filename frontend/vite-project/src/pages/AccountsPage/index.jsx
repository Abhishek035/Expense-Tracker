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
  IconEye,
  IconDotsVertical,
  IconWallet,
  IconBuildingBank,
  IconFilter,
  IconChevronDown,
  IconEdit,
  IconTrash,
} from "@tabler/icons-react";

import { initialAccounts } from "../../data/accountsData";
import { ListHeader } from "../../components/ListHeader";
import { ItemsList } from "../../components/ItemsList";
import { SortableItem } from "../../components/SortableItem";
import { AccountForm } from "../../forms/AccountForm";
import { ItemDetails } from "../../components/ItemDetails";

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
  const [accounts, setAccounts] = useState(initialAccounts);
  const [expandedAccountId, setExpandedAccountId] = useState(null);
  const [opened, { open, close }] = useDisclosure(false);

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedAccountTypes, setSelectedAccountTypes] = useState([]);
  const [selectedArchiveStatus, setSelectedArchiveStatus] = useState([
    "active",
  ]);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  const filteredAccounts = useMemo(() => {
    const query = searchQuery.toLowerCase().trim();
    return accounts.filter((account) => {
      const matchesSearch =
        !query ||
        account.nickname.toLowerCase().includes(query) ||
        account.type.toLowerCase().includes(query) ||
        account.bankName?.toLowerCase().includes(query) ||
        account.provider?.toLowerCase().includes(query);
      const matchesType =
        selectedAccountTypes.length === 0 ||
        selectedAccountTypes.includes(account.type);
      const matchesStatus =
        selectedArchiveStatus.length === 0 ||
        selectedArchiveStatus.includes(account.status);
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

  const handleAddAccount = (newAccountData) => {
    const newAccount = {
      ...newAccountData,
      id: Math.random(),
      balance: 0,
      status: "active",
    };
    setAccounts((current) => [newAccount, ...current]);
  };

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
            <Badge variant="light" size="sm" radius="sm">
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
                  // onClick={() => openEditModal(account)}
                >
                  Edit
                </Menu.Item>
                <Menu.Item
                  leftSection={<IconTrash size={14} />}
                  // onClick={() => handleDeleteAccount(account.id)}
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
      <AccountForm
        opened={opened}
        onClose={close}
        onAddAccount={handleAddAccount}
      />
    </Container>
  );
}
