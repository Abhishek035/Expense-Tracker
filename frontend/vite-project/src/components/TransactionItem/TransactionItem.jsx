import { Table, Text, Badge, Group, ActionIcon, ThemeIcon } from "@mantine/core";
import { IconCheck, IconMinus, IconEdit, IconBuildingStore, IconToolsKitchen2, IconWallet, IconShoppingBag, IconBuildingBank, IconCashBanknote } from "@tabler/icons-react";

// Helper to pick icons based on category
const getCategoryIcon = (category) => {
  switch (category?.toLowerCase()) {
    case 'groceries': return <IconBuildingStore size={16} />;
    case 'dining': return <IconToolsKitchen2 size={16} />;
    case 'refund': return <IconWallet size={16} />;
    case 'shopping': return <IconShoppingBag size={16} />;
    case 'salary': return <IconCashBanknote size={16} />;
    default: return <IconBuildingBank size={16} />;
  }
};

export default function TransactionItem({ transaction, accounts, onEdit }) {
  const dateObj = new Date(transaction.date);
  const accountName = accounts.find(a => a.value === transaction.accountId)?.label || "Unknown";
  
  // Format currency dynamically based on amount
  const formattedAmount = new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: transaction.amount % 1 === 0 ? 0 : 2
  }).format(transaction.amount);

  // Styling maps for types
  const typeConfig = {
    expense: { color: "red", label: "Expense" },
    income: { color: "green", label: "Income" },
    transfer: { color: "blue", label: "Transfer" },
  };

  return (
    <Table.Tr>
      {/* Date Column */}
      <Table.Td>
        <Text fz="sm" fw={500} c="dark.7">
          {dateObj.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
        </Text>
        <Text fz="xs" c="dimmed">
          {dateObj.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })}
        </Text>
      </Table.Td>

      {/* Description Column */}
      <Table.Td>
        <Text fz="sm" fw={600} c="dark.8">{transaction.description}</Text>
        <Text fz="xs" c="dimmed">
          {dateObj.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })} {dateObj.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })}
        </Text>
      </Table.Td>

      {/* Type Column */}
      <Table.Td>
        <Badge variant="light" color={typeConfig[transaction.type].color} radius="sm">
          {typeConfig[transaction.type].label}
        </Badge>
      </Table.Td>

      {/* Category Column */}
      <Table.Td>
        <Group gap="xs" wrap="nowrap">
          <ThemeIcon variant="light" color="gray" size="sm">
            {getCategoryIcon(transaction.category)}
          </ThemeIcon>
          <Text fz="sm">{transaction.category}</Text>
        </Group>
      </Table.Td>

      {/* Account Column */}
      <Table.Td>
        <Group gap="xs" wrap="nowrap">
          <ThemeIcon variant="transparent" color="gray.6" size="sm">
            <IconBuildingBank size={16} />
          </ThemeIcon>
          <Text fz="sm">{accountName}</Text>
        </Group>
      </Table.Td>

      {/* Amount Column */}
      <Table.Td>
        <Text fz="sm" fw={600} c={transaction.type === 'expense' ? "dark.8" : "green.8"}>
          {formattedAmount}
        </Text>
      </Table.Td>

      {/* Recurring Column */}
      <Table.Td>
        {transaction.isRecurring ? (
          <IconCheck size={20} color="var(--mantine-color-primary-5)" stroke={3} />
        ) : (
          <IconMinus size={20} color="#ced4da" />
        )}
      </Table.Td>

      {/* Edit Action Column */}
      <Table.Td>
        <ActionIcon variant="subtle" color="gray" onClick={() => onEdit(transaction)}>
          <IconEdit size={18} />
        </ActionIcon>
      </Table.Td>
    </Table.Tr>
  );
}