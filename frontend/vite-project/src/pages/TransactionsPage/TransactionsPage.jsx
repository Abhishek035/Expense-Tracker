import { useState, useMemo, useEffect } from "react";
import { Table, Text, Loader, Flex } from "@mantine/core";
import TransactionHeader from "../../components/TransactionHeader/TransactionHeader";
import TransactionItem from "../../components/TransactionItem/TransactionItem";
import TransactionFilter from "../../components/TransactionFilter/TransactionFilter";
import EditTransactionModal from "../../components/EditTransactionModal/EditTransactionModal";
import { supabase } from "../../supabaseClient"; // <-- IMPORT SUPABASE

// Combined Categories for the Filter
const allCategories = [
  "Salary",
  "Freelance",
  "Investment",
  "Business",
  "Refund",
  "Food & Dining",
  "Utilities",
  "Transportation",
  "Entertainment",
  "Shopping",
  "Healthcare",
  "Education",
  "Groceries",
  "Other",
];

export default function TransactionsPage() {
  const [transactions, setTransactions] = useState([]);
  const [accountsList, setAccountsList] = useState([]); // Formatted for dropdowns
  const [loading, setLoading] = useState(true);

  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [searchQuery, setSearchQuery] = useState("");
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [editingTransaction, setEditingTransaction] = useState(null);
  const [filters, setFilters] = useState({
    type: null,
    category: null,
    accountId: null,
    minAmount: "",
    maxAmount: "",
  });

  // 1. Fetch Data
  const fetchData = async () => {
    setLoading(true);

    // Fetch Accounts for the dropdowns
    const { data: accData } = await supabase
      .from("accounts")
      .select("id, name");
    const formattedAccs = accData
      ? accData.map((a) => ({ value: a.id, label: a.name }))
      : [];
    setAccountsList(formattedAccs);

    // Fetch Transactions (Only completed ones)
    const { data: txData } = await supabase
      .from("transactions")
      .select("*")
      .eq("is_completed", true)
      .order("date", { ascending: false });

    if (txData) setTransactions(txData);
    setLoading(false);
  };

  useEffect(() => {
    fetchData();

    // Listen for the global event fired by TransactionForm
    window.addEventListener("transaction-updated", fetchData);
    return () => window.removeEventListener("transaction-updated", fetchData);
  }, []);

  // 2. Save Edits to Supabase
  const handleSaveTransaction = async (updatedTx) => {
    try {
      const payload = {
        date: updatedTx.date,
        amount: updatedTx.amount,
        type: updatedTx.type,
        category: updatedTx.category,
        account_id: updatedTx.account_id,
        description: updatedTx.description,
        params: updatedTx.params,
        edited_at: new Date().toISOString(),
      };

      const { error } = await supabase
        .from("transactions")
        .update(payload)
        .eq("id", updatedTx.id);
      if (error) throw error;

      fetchData(); // Refresh the list
    } catch (err) {
      console.error("Error updating:", err.message);
    }
  };

  // 3. Delete Transaction
  const handleDeleteTransaction = async (id) => {
    try {
      await supabase.from("transactions").delete().eq("id", id);
      fetchData();
    } catch (err) {
      console.error("Error deleting:", err.message);
    }
  };

  // 4. Filtering Logic
  const filteredTransactions = useMemo(() => {
    return transactions.filter((t) => {
      const tDate = new Date(t.date);
      const isSameMonth =
        tDate.getMonth() === currentMonth.getMonth() &&
        tDate.getFullYear() === currentMonth.getFullYear();
      if (!isSameMonth) return false;

      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        const matchDesc = (t.description || "").toLowerCase().includes(query);
        const matchCat = t.category.toLowerCase().includes(query);
        const accountName =
          accountsList
            .find((a) => a.value === t.account_id)
            ?.label.toLowerCase() || "";
        const matchAcc = accountName.includes(query);
        if (!matchDesc && !matchCat && !matchAcc) return false;
      }

      if (filters.type && t.type !== filters.type) return false;
      if (filters.category && t.category !== filters.category) return false;
      if (filters.accountId && t.account_id !== filters.accountId) return false;
      if (filters.minAmount !== "" && t.amount < Number(filters.minAmount))
        return false;
      if (filters.maxAmount !== "" && t.amount > Number(filters.maxAmount))
        return false;

      return true;
    });
  }, [transactions, currentMonth, searchQuery, filters, accountsList]);

  return (
    <div
      style={{
        padding: "2rem",
        backgroundColor: "var(--color-background1, #fafafa)",
        minHeight: "100vh",
      }}
    >
      <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
        <TransactionHeader
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          onOpenFilter={() => setIsFilterOpen(true)}
          currentMonth={currentMonth}
          onMonthChange={setCurrentMonth}
        />

        <div
          style={{
            backgroundColor: "#fff",
            borderRadius: "12px",
            border: "1px solid #f1f3f5",
            overflow: "hidden",
          }}
        >
          <Table.ScrollContainer minWidth={900}>
            <Table verticalSpacing="md" horizontalSpacing="xl" highlightOnHover>
              <Table.Thead bg="gray.0">
                <Table.Tr>
                  <Table.Th fw={600} c="dark.5">
                    Date
                  </Table.Th>
                  <Table.Th fw={600} c="dark.5">
                    Description
                  </Table.Th>
                  <Table.Th fw={600} c="dark.5">
                    Type
                  </Table.Th>
                  <Table.Th fw={600} c="dark.5">
                    Category
                  </Table.Th>
                  <Table.Th fw={600} c="dark.5">
                    Account
                  </Table.Th>
                  <Table.Th fw={600} c="dark.5" ta="right">
                    Amount
                  </Table.Th>
                  <Table.Th fw={600} c="dark.5">
                    Recurring
                  </Table.Th>
                  <Table.Th fw={600} c="dark.5"></Table.Th>
                </Table.Tr>
              </Table.Thead>
              <Table.Tbody>
                {loading ? (
                  <Table.Tr>
                    <Table.Td colSpan={8}>
                      <Flex justify="center" py="xl">
                        <Loader color="primary" />
                      </Flex>
                    </Table.Td>
                  </Table.Tr>
                ) : filteredTransactions.length > 0 ? (
                  filteredTransactions.map((t) => {
                    const accountLabel =
                      accountsList.find((a) => a.value === t.account_id)
                        ?.label || "Unknown";
                    const isRecurring = t.params?.is_recurring || false;
                    return (
                      <TransactionItem
                        key={t.id}
                        transaction={{
                          ...t,
                          accountId: accountLabel,
                          isRecurring: isRecurring, // <-- Pass this explicitly!
                        }}
                        accounts={accountsList}
                        onEdit={() => setEditingTransaction(t)}
                        onDelete={() => handleDeleteTransaction(t.id)}
                      />
                    );
                  })
                ) : (
                  <Table.Tr>
                    <Table.Td colSpan={8}>
                      <Text ta="center" py="xl" c="dimmed">
                        No transactions found for this month.
                      </Text>
                    </Table.Td>
                  </Table.Tr>
                )}
              </Table.Tbody>
            </Table>
          </Table.ScrollContainer>
        </div>
      </div>

      <TransactionFilter
        opened={isFilterOpen}
        onClose={() => setIsFilterOpen(false)}
        filters={filters}
        setFilters={setFilters}
        categories={allCategories}
        accounts={accountsList}
      />

      <EditTransactionModal
        opened={!!editingTransaction}
        onClose={() => setEditingTransaction(null)}
        transaction={editingTransaction}
        onSave={handleSaveTransaction}
        categories={allCategories}
        accounts={accountsList}
      />
    </div>
  );
}
