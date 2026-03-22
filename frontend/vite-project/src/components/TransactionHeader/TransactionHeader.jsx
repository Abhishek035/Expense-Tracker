import { Group, Title, TextInput, Button, ActionIcon } from "@mantine/core";
import { IconSearch, IconFilter, IconPlus, IconChevronDown, IconChevronLeft, IconChevronRight } from "@tabler/icons-react";

export default function TransactionHeader({ searchQuery, onSearchChange, onOpenFilter, currentMonth, onMonthChange }) {
  
  // Handlers for month toggling (since your requirements asked for it)
  const handlePrev = () => {
    const d = new Date(currentMonth);
    d.setMonth(d.getMonth() - 1);
    onMonthChange(d);
  };
  
  const handleNext = () => {
    const d = new Date(currentMonth);
    d.setMonth(d.getMonth() + 1);
    onMonthChange(d);
  };

  return (
    <div style={{ marginBottom: '1.5rem' }}>
      <Group justify="space-between" align="center" mb="md">
        <Group align="center">
          <Title order={2} fw={700}>Transactions</Title>
        </Group>

        <Group gap="sm">
          <Button 
            variant="default" 
            leftSection={<IconFilter size={16} />} 
            rightSection={<IconChevronDown size={16} />}
            onClick={onOpenFilter}
            radius="md"
          >
            Filter
          </Button>
          <Button 
            color="primary" 
            leftSection={<IconPlus size={16} />} 
            radius="md"
          >
            Add New
          </Button>
        </Group>
      </Group>

      {/* Full width search bar */}
      <TextInput
        placeholder="Search by description, category, or account..."
        leftSection={<IconSearch size={18} color="gray" />}
        value={searchQuery}
        onChange={(e) => onSearchChange(e.currentTarget.value)}
        size="md"
        radius="md"
        styles={{
          input: { backgroundColor: '#fff', border: '1px solid #e9ecef' }
        }}
      />
    </div>
  );
}