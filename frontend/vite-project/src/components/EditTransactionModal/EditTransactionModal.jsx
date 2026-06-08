import { useState, useEffect } from "react";
import { Modal, TextInput, NumberInput, Select, Button, Stack, Checkbox, Radio, Group, Grid, Box } from "@mantine/core";
import { DateTimePicker } from "@mantine/dates";

export default function EditTransactionModal({ opened, onClose, transaction, onSave, categories, accounts }) {
  const [formData, setFormData] = useState({});

  useEffect(() => {
    if (transaction) {
      const dateObj = transaction.date ? new Date(transaction.date) : new Date();
      setFormData({ 
        ...transaction, 
        date: dateObj,
        isRecurring: transaction.params?.is_recurring || false,
        recurringFrequency: transaction.params?.frequency || "",
      });
    }
  }, [transaction]);

  const handleChange = (field, value) => setFormData((prev) => ({ ...prev, [field]: value }));

  const handleSave = () => {
    const updatedData = {
      ...formData,
      date: formData.date ? formData.date.toISOString() : new Date().toISOString(),
      // Pack params back up
      params: formData.isRecurring ? { is_recurring: true, frequency: formData.recurringFrequency } : {}
    };
    onSave(updatedData);
    onClose();
  };

  return (
    <Modal opened={opened} onClose={onClose} title="Edit Transaction" centered styles={{ header: { backgroundColor: "var(--mantine-color-primary-6)" }, title: { color: "white", fontWeight: 600 }, close: { color: "white" } }}>
      <Stack gap="md">
        <Radio.Group value={formData.type} onChange={(val) => handleChange("type", val)} label="Transaction Type">
          <Group mt="xs">
            <Radio value="expense" label="Expense" color="red.6" />
            <Radio value="income" label="Income" color="teal.6" />
          </Group>
        </Radio.Group>

        <Grid>
          <Grid.Col span={6}>
            <NumberInput label="Amount" prefix="₹" decimalScale={2} fixedDecimalScale hideControls value={formData.amount} onChange={(val) => handleChange("amount", Number(val) || 0)} />
          </Grid.Col>
          <Grid.Col span={6}>
            <DateTimePicker label="Date & Time" value={formData.date} onChange={(val) => handleChange("date", val)} clearable={false} />
          </Grid.Col>
        </Grid>

        <Select label="Category" data={categories} value={formData.category} onChange={(val) => handleChange("category", val)} searchable />
        <Select label={formData.type === "income" ? "Deposited To" : "Paid From"} data={accounts} value={formData.account_id} onChange={(val) => handleChange("account_id", val)} />

        <TextInput label="Description" value={formData.description || ""} onChange={(e) => handleChange("description", e.currentTarget.value)} />

        <Box bg="gray.0" p="sm" style={{ borderRadius: '8px', border: '1px solid var(--mantine-color-gray-2)' }}>
          <Checkbox label="This is a recurring transaction" color="primary" checked={formData.isRecurring} onChange={(e) => handleChange("isRecurring", e.currentTarget.checked)} />
          {formData.isRecurring && (
            <Select label="Frequency" data={["daily", "weekly", "monthly", "yearly"]} value={formData.recurringFrequency} onChange={(val) => handleChange("recurringFrequency", val)} mt="sm" />
          )}
        </Box>

        <Button fullWidth mt="md" color="primary" onClick={handleSave}>Save Changes</Button>
      </Stack>
    </Modal>
  );
}