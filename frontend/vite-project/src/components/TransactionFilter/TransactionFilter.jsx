import { Stack, Select, NumberInput, Button, Drawer } from "@mantine/core";

export default function TransactionFilter({ opened, onClose, filters, setFilters, categories, accounts }) {
  const handleClear = () => {
    setFilters({ type: null, category: null, accountId: null, minAmount: "", maxAmount: "" });
  };

  return (
    <Drawer opened={opened} onClose={onClose} title="Filter Transactions" position="right">
      <Stack gap="md">
        <Select 
          label="Transaction Type" placeholder="All" clearable
          data={[{value: 'expense', label: 'Expense'}, {value: 'income', label: 'Income'}, {value: 'transfer', label: 'Transfer'}]}
          value={filters.type} onChange={(v) => setFilters({...filters, type: v})} 
        />
        <Select 
          label="Category" placeholder="All" clearable data={categories}
          value={filters.category} onChange={(v) => setFilters({...filters, category: v})} 
        />
        <Select 
          label="Account" placeholder="All" clearable data={accounts}
          value={filters.accountId} onChange={(v) => setFilters({...filters, accountId: v})} 
        />
        
        <NumberInput 
          label="Min Amount" placeholder="0.00" min={0}
          value={filters.minAmount} onChange={(v) => setFilters({...filters, minAmount: v})} 
        />
        <NumberInput 
          label="Max Amount" placeholder="Any" min={0}
          value={filters.maxAmount} onChange={(v) => setFilters({...filters, maxAmount: v})} 
        />

        <Button mt="md" color="primary" onClick={onClose}>Apply Filters</Button>
        <Button variant="subtle" color="red" onClick={handleClear}>Clear All</Button>
      </Stack>
    </Drawer>
  );
}