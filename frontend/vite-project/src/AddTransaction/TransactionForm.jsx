import React, { useState, useEffect } from "react";
import { Modal, Tabs, NumberInput, Select, Textarea, Checkbox, Button, Group, Stack, Grid, Box } from "@mantine/core";
import { IconPlus, IconMinus, IconCalendar } from "@tabler/icons-react";
import { useForm } from "@mantine/form";
import { DateTimePicker } from "@mantine/dates";
import classes from "./TransactionForm.module.css";
import { supabase } from "../supabaseClient"; // <-- IMPORT SUPABASE

const TransactionForm = ({ opened, onClose, initialDate, onSubmitTransaction }) => {
  const [transactionType, setTransactionType] = useState("expense");
  const [isRecurring, setIsRecurring] = useState(false);
  const [accounts, setAccounts] = useState([]); // <-- State to hold fetched accounts
  const [loading, setLoading] = useState(false);

  const form = useForm({
    initialValues: {
      amount: "", date: initialDate || new Date(), category: "", description: "", paymentFrom: "", frequency: "", endDate: null,
    },
    validate: {
      amount: (value) => (value <= 0 ? "Amount must be greater than 0" : null),
      date: (value) => (!value ? "Date is required" : null),
      category: (value) => (!value ? "Category is required" : null),
      paymentFrom: (value) => (!value ? "Account is required" : null),
      frequency: (value) => isRecurring && !value ? "Frequency is required when recurring" : null,
    },
  });

  // Fetch accounts when the modal opens
  useEffect(() => {
    if (opened) {
      form.reset();
      form.setFieldValue("date", initialDate || new Date());
      setTransactionType("expense");
      setIsRecurring(false);
      fetchAccounts();
    }
  }, [opened, initialDate]);

  const fetchAccounts = async () => {
    const { data, error } = await supabase.from('accounts').select('id, name');
    if (!error && data) {
      setAccounts(data.map(acc => ({ value: acc.id, label: acc.name })));
    }
  };

  const categoryOptions = {
    income: ["Salary", "Freelance", "Investment", "Business", "Other", "Refund"],
    expense: ["Food & Dining", "Utilities", "Transportation", "Entertainment", "Shopping", "Healthcare", "Education", "Groceries", "Other"],
  };

  const frequencies = ["daily", "weekly", "monthly", "yearly"];

  const handleSubmit = async (values) => {
    setLoading(true);
    try {
      // Is it completed? (If the date is in the future, it's a reminder, so is_completed = false)
      const isCompleted = values.date <= new Date();

      const payload = {
        account_id: values.paymentFrom,
        date: values.date.toISOString(),
        amount: values.amount,
        type: transactionType,
        category: values.category,
        description: values.description,
        is_completed: isCompleted,
        params: isRecurring ? { is_recurring: true, frequency: values.frequency } : {}
      };

      const { error } = await supabase.from('transactions').insert([payload]);
      if (error) throw error;

      // Tell any open pages to refresh their data!
      window.dispatchEvent(new Event('transaction-updated'));
      onClose();

    } catch (error) {
      console.error("Error saving transaction:", error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal opened={opened} onClose={onClose} title="Add Transaction" size="lg" centered>
      <form onSubmit={form.onSubmit(handleSubmit)}>
        <Stack gap="md">
          <Tabs value={transactionType} onChange={setTransactionType}>
            <Tabs.List grow>
              <Tabs.Tab value="expense" color="red" leftSection={<IconMinus size={16} />}>Expense</Tabs.Tab>
              <Tabs.Tab value="income" color="teal" leftSection={<IconPlus size={16} />}>Income</Tabs.Tab>
            </Tabs.List>
          </Tabs>

          <Grid>
            <Grid.Col span={{ base: 12, md: 6 }}>
              <NumberInput label="Amount" placeholder="0.00" required min={0.01} step={0.01} decimalScale={2} fixedDecimalScale hideControls prefix="₹" {...form.getInputProps("amount")} />
            </Grid.Col>
            <Grid.Col span={{ base: 12, md: 6 }}>
              <DateTimePicker label="Date & Time" required clearable={false} maxDate={new Date()} leftSection={<IconCalendar size={16} />} {...form.getInputProps("date")} />
            </Grid.Col>
          </Grid>

          <Grid>
            <Grid.Col span={{ base: 12, md: 6 }}>
              <Select label="Category" placeholder="Select a category" required data={categoryOptions[transactionType]} searchable {...form.getInputProps("category")} />
            </Grid.Col>
            <Grid.Col span={{ base: 12, md: 6 }}>
              <Select label={transactionType === "income" ? "Deposited To" : "Paid From"} placeholder="Select an account" required data={accounts} {...form.getInputProps("paymentFrom")} />
            </Grid.Col>
          </Grid>

          <Textarea label="Description" placeholder="Add a short note" minRows={2} {...form.getInputProps("description")} />

          <Box bg="gray.0" p="sm" style={{ borderRadius: '8px', border: '1px solid var(--mantine-color-gray-2)' }}>
            <Checkbox label="This is a recurring transaction" checked={isRecurring} onChange={(event) => setIsRecurring(event.currentTarget.checked)} color="primary" />
            {isRecurring && (
              <Select label="Frequency" placeholder="Select frequency" required={isRecurring} data={frequencies} mt="md" {...form.getInputProps("frequency")} />
            )}
          </Box>

          <Group justify="flex-end" mt="lg">
            <Button variant="default" onClick={onClose}>Cancel</Button>
            <Button type="submit" color="primary" loading={loading}>Add Transaction</Button>
          </Group>
        </Stack>
      </form>
    </Modal>
  );
};

export default TransactionForm;