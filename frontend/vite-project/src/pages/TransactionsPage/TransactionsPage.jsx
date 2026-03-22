import { useState, useMemo } from "react";
import { Table, Text } from "@mantine/core";

// Mock Data
import { dummyTransactions, mockCategories, mockAccounts } from "./dummyData";

// Components
import TransactionHeader from "../../components/TransactionHeader/TransactionHeader";
import TransactionItem from "../../components/TransactionItem/TransactionItem";
import TransactionFilter from "../../components/TransactionFilter/TransactionFilter";
import EditTransactionModal from "../../components/EditTransactionModal/EditTransactionModal";

export default function TransactionsPage() {
  const [transactions, setTransactions] = useState(dummyTransactions);
  
  // UI State
  const [currentMonth, setCurrentMonth] = useState(new Date("2023-10-01")); // Set to Oct 2023 to match dummy data
  const [searchQuery, setSearchQuery] = useState("");
  const[isFilterOpen, setIsFilterOpen] = useState(false);
  const [editingTransaction, setEditingTransaction] = useState(null);
  
  // Filter State
  const [filters, setFilters] = useState({
    type: null, category: null, accountId: null, minAmount: "", maxAmount: ""
  });

  // Core Filtering Logic
  const filteredTransactions = useMemo(() => {
    return transactions.filter(t => {
      const tDate = new Date(t.date);
      
      const isSameMonth = tDate.getMonth() === currentMonth.getMonth() && tDate.getFullYear() === currentMonth.getFullYear();
      if (!isSameMonth) return false;

      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        const matchDesc = (t.description || "").toLowerCase().includes(query);
        const matchCat = t.category.toLowerCase().includes(query);
        // Added account search to match placeholder
        const accountName = mockAccounts.find(a => a.value === t.accountId)?.label.toLowerCase() || "";
        const matchAcc = accountName.includes(query);
        
        if (!matchDesc && !matchCat && !matchAcc) return false;
      }

      if (filters.type && t.type !== filters.type) return false;
      if (filters.category && t.category !== filters.category) return false;
      if (filters.accountId && t.accountId !== filters.accountId) return false;
      if (filters.minAmount !== "" && t.amount < Number(filters.minAmount)) return false;
      if (filters.maxAmount !== "" && t.amount > Number(filters.maxAmount)) return false;

      return true;
    }).sort((a, b) => new Date(b.date) - new Date(a.date));
  }, [transactions, currentMonth, searchQuery, filters]);

  const handleSaveTransaction = (updatedTransaction) => {
    setTransactions(prev => prev.map(t => t.id === updatedTransaction.id ? updatedTransaction : t));
  };

  return (
    <div style={{ padding: '2rem', backgroundColor: 'var(--color-background1, #fafafa)', minHeight: '100vh' }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        
        <TransactionHeader 
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          onOpenFilter={() => setIsFilterOpen(true)}
          currentMonth={currentMonth}
          onMonthChange={setCurrentMonth}
        />

        <div style={{ backgroundColor: '#fff', borderRadius: '12px', border: '1px solid #f1f3f5', overflow: 'hidden' }}>
          <Table.ScrollContainer minWidth={900}>
            <Table verticalSpacing="md" horizontalSpacing="xl" highlightOnHover>
              <Table.Thead bg="gray.0">
                <Table.Tr>
                  <Table.Th fw={600} c="dark.5">Date</Table.Th>
                  <Table.Th fw={600} c="dark.5">Description</Table.Th>
                  <Table.Th fw={600} c="dark.5">Type</Table.Th>
                  <Table.Th fw={600} c="dark.5">Category</Table.Th>
                  <Table.Th fw={600} c="dark.5">Account</Table.Th>
                  <Table.Th fw={600} c="dark.5">Amount</Table.Th>
                  <Table.Th fw={600} c="dark.5">Recurring</Table.Th>
                  <Table.Th fw={600} c="dark.5"></Table.Th> {/* Empty header for Edit button */}
                </Table.Tr>
              </Table.Thead>
              <Table.Tbody>
                {filteredTransactions.length > 0 ? (
                  filteredTransactions.map(t => (
                    <TransactionItem 
                      key={t.id} 
                      transaction={t} 
                      accounts={mockAccounts} 
                      onEdit={setEditingTransaction} 
                    />
                  ))
                ) : (
                  <Table.Tr>
                    <Table.Td colSpan={8}>
                      <Text ta="center" py="xl" c="dimmed">No transactions found.</Text>
                    </Table.Td>
                  </Table.Tr>
                )}
              </Table.Tbody>
            </Table>
          </Table.ScrollContainer>
        </div>
      </div>

      <TransactionFilter 
        opened={isFilterOpen} onClose={() => setIsFilterOpen(false)}
        filters={filters} setFilters={setFilters}
        categories={mockCategories} accounts={mockAccounts}
      />

      <EditTransactionModal 
        opened={!!editingTransaction} onClose={() => setEditingTransaction(null)}
        transaction={editingTransaction} onSave={handleSaveTransaction}
        categories={mockCategories} accounts={mockAccounts}
      />
    </div>
  );
}