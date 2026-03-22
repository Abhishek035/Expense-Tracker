import { useState, useEffect } from "react";
import {
  Modal,
  TextInput,
  NumberInput,
  Select,
  Button,
  Stack,
  Checkbox,
  Radio,
  Group,
} from "@mantine/core";

export default function EditTransactionModal({
  opened,
  onClose,
  transaction,
  onSave,
  categories,
  accounts,
}) {
  const [formData, setFormData] = useState({});

  useEffect(() => {
    if (transaction) {
      const dateStr = new Date(transaction.date).toISOString().slice(0, 16);
      setFormData({ ...transaction, date: dateStr });
    }
  }, [transaction]);

  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSave = () => {
    const updatedData = {
      ...formData,
      date: new Date(formData.date).toISOString(),
    };
    onSave(updatedData);
    onClose();
  };

  return (
    <Modal
      opened={opened}
      onClose={onClose}
      title="Edit Transaction"
      centered
      styles={{
        header: {
          backgroundColor: "#0090A0",
          color: "white", // Optional: makes the text white to match the dark background
        },
        close: {
          color: "white", // Optional: makes the close button white
        },
      }}
    >
      <Stack gap="md">
        <Radio.Group
          value={formData.type}
          onChange={(val) => handleChange("type", val)}
          label="Type"
        >
          <Group mt="xs">
            <Radio value="expense" label="Expense" color="primary" />
            <Radio value="income" label="Income" color="primary" />
            <Radio value="transfer" label="Transfer" color="primary" />
          </Group>
        </Radio.Group>

        <TextInput
          type="datetime-local"
          label="Date & Time"
          value={formData.date || ""}
          onChange={(e) => handleChange("date", e.currentTarget.value)}
        />
        <NumberInput
          label="Amount"
          prefix="$"
          decimalScale={2}
          value={formData.amount}
          onChange={(val) => handleChange("amount", val)}
        />
        <Select
          label="Category"
          data={categories}
          value={formData.category}
          onChange={(val) => handleChange("category", val)}
        />
        <Select
          label="Account"
          data={accounts}
          value={formData.accountId}
          onChange={(val) => handleChange("accountId", val)}
        />
        <TextInput
          label="Description"
          value={formData.description || ""}
          onChange={(e) => handleChange("description", e.currentTarget.value)}
        />

        <Checkbox
          label="Is Recurring?"
          color="primary"
          checked={formData.isRecurring}
          onChange={(e) => handleChange("isRecurring", e.currentTarget.checked)}
        />

        {formData.isRecurring && (
          <Select
            label="Frequency"
            data={["daily", "weekly", "monthly", "yearly"]}
            value={formData.recurringFrequency}
            onChange={(val) => handleChange("recurringFrequency", val)}
          />
        )}

        <Button fullWidth mt="md" color="primary" onClick={handleSave}>
          Save Changes
        </Button>
      </Stack>
    </Modal>
  );
}
