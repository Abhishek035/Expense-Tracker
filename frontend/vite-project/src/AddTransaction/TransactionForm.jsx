import React, { useState } from "react";
import {
  Modal,
  Tabs,
  TextInput,
  NumberInput,
  Select,
  Textarea,
  Checkbox,
  Button,
  Group,
  Stack,
  FileInput,
  TagsInput,
  Grid,
  Box,
} from "@mantine/core";
import {
  IconPlus,
  IconMinus,
  IconCalendar,
  IconUpload,
} from "@tabler/icons-react";
import { useForm } from "@mantine/form";
import { DateInput } from "@mantine/dates";
// Import the updated CSS module
import classes from "./TransactionForm.module.css";

const TransactionForm = ({ opened, onClose }) => {
  const [transactionType, setTransactionType] = useState("expense");
  const [isRecurring, setIsRecurring] = useState(false);

  const form = useForm({
    initialValues: {
      amount: "",
      date: new Date(), // It's good practice to default to today
      category: "",
      description: "",
      paymentFrom: "",
      frequency: "",
      endDate: null,
      status: "cleared", // Default to cleared for faster entry
      tags: [],
      receipt: null,
    },
    validate: {
      amount: (value) => (value <= 0 ? "Amount must be greater than 0" : null),
      date: (value) => (!value ? "Date is required" : null),
      category: (value) => (!value ? "Category is required" : null),
      paymentFrom: (value) =>
        transactionType === "expense" && !value
          ? "Payment source is required"
          : null,
      frequency: (value) =>
        isRecurring && !value ? "Frequency is required when recurring" : null,
    },
  });

  // Simplified category options
  const categoryOptions = {
    income: ["Salary", "Freelance", "Investment", "Business", "Other"],
    expense: [
      "Food & Dining",
      "Utilities",
      "Transportation",
      "Entertainment",
      "Shopping",
      "Healthcare",
      "Education",
      "Other",
    ],
  };

  const paymentSources = ["Wallet", "Bank Account", "Credit Card", "Debit Card"];
  const frequencies = ["Daily", "Weekly", "Monthly", "Yearly"];
  const statusOptions = ["Cleared", "Pending"];

  const handleSubmit = (values) => {
    const transactionData = {
      ...values,
      type: transactionType,
      recurring: isRecurring,
    };
    console.log("Transaction Data:", transactionData);
    onClose(); // Close the modal on submission
  };

  // When closing, reset the form and local state
  const handleClose = () => {
    onClose();
    // Use a timeout to reset the form after the closing animation finishes
    setTimeout(() => {
      form.reset();
      setIsRecurring(false);
      setTransactionType("expense");
    }, 200);
  };

  return (
    <Modal
      opened={opened}
      onClose={handleClose}
      title="Add Transaction"
      size="lg"
      centered
      classNames={{
        header: classes.modalHeader,
        title: classes.modalTitle,
        body: classes.modalBody,
      }}
      overlayProps={{
        backgroundOpacity: 0.55,
        blur: 3,
      }}
    >
      <form onSubmit={form.onSubmit(handleSubmit)}>
        <Stack gap="md">
          {/* Transaction Type Tabs */}
          <Tabs
            value={transactionType}
            onChange={setTransactionType}
            classNames={{ list: classes.tabsList, tab: classes.tab }}
          >
            <Tabs.List grow>
              <Tabs.Tab
                value="expense"
                color="red" // Use Mantine's color prop
                leftSection={<IconMinus size={16} />}
              >
                Expense
              </Tabs.Tab>
              <Tabs.Tab
                value="income"
                color="green" // Use Mantine's color prop
                leftSection={<IconPlus size={16} />}
              >
                Income
              </Tabs.Tab>
            </Tabs.List>
          </Tabs>

          {/* Main Form Fields */}
          <Grid>
            <Grid.Col span={{ base: 12, md: 6 }}>
              <NumberInput
                label="Amount"
                placeholder="0.00"
                required
                min={0.01}
                step={0.01}
                decimalScale={2}
                fixedDecimalScale
                prefix="₹"
                {...form.getInputProps("amount")}
              />
            </Grid.Col>
            <Grid.Col span={{ base: 12, md: 6 }}>
              <DateInput
                label="Date"
                placeholder="Select date"
                required
                rightSection={<IconCalendar size={18} />}
                {...form.getInputProps("date")}
              />
            </Grid.Col>
          </Grid>

          <Grid>
            <Grid.Col span={{ base: 12, md: transactionType === 'expense' ? 6 : 12 }}>
              <Select
                label="Category"
                placeholder="Select a category"
                required
                data={categoryOptions[transactionType]}
                searchable
                {...form.getInputProps("category")}
              />
            </Grid.Col>
            {transactionType === "expense" && (
              <Grid.Col span={{ base: 12, md: 6 }}>
                <Select
                  label="Payment From"
                  placeholder="Select a source"
                  required
                  data={paymentSources}
                  {...form.getInputProps("paymentFrom")}
                />
              </Grid.Col>
            )}
          </Grid>

          <Textarea
            label="Description"
            placeholder="Add a note (e.g., coffee with a client)"
            minRows={2}
            {...form.getInputProps("description")}
          />

          {/* Advanced & Recurring Options */}
          <Box className={classes.advancedOptionsBox}>
            <Checkbox
              label="This is a recurring transaction"
              checked={isRecurring}
              onChange={(event) => setIsRecurring(event.currentTarget.checked)}
            />
            {isRecurring && (
              <Grid mt="md">
                <Grid.Col span={{ base: 12, sm: 6 }}>
                  <Select
                    label="Frequency"
                    placeholder="Select frequency"
                    required={isRecurring}
                    data={frequencies}
                    {...form.getInputProps("frequency")}
                  />
                </Grid.Col>
                <Grid.Col span={{ base: 12, sm: 6 }}>
                  <DateInput
                    label="End Date (Optional)"
                    placeholder="Leave blank for never"
                    {...form.getInputProps("endDate")}
                  />
                </Grid.Col>
              </Grid>
            )}
          </Box>
          
          <Grid>
             <Grid.Col span={{ base: 12, md: 6 }}>
              <TagsInput
                label="Tags (Optional)"
                placeholder="Press Enter to add a tag"
                {...form.getInputProps("tags")}
              />
            </Grid.Col>
            <Grid.Col span={{ base: 12, md: 6 }}>
              <FileInput
                label="Receipt (Optional)"
                placeholder="Upload a file"
                accept="image/*,application/pdf"
                leftSection={<IconUpload size={18} />}
                {...form.getInputProps("receipt")}
              />
            </Grid.Col>
          </Grid>

          {/* Form Actions */}
          <Group justify="flex-end" mt="lg">
            <Button variant="default" onClick={handleClose}>
              Cancel
            </Button>
            <Button type="submit">Add Transaction</Button>
          </Group>
        </Stack>
      </form>
    </Modal>
  );
};

export default TransactionForm;