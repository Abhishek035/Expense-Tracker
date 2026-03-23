import React, { useState, useEffect } from "react";
import {
  Modal, Tabs, NumberInput, Select, Textarea, Checkbox, Button, Group, Stack, FileInput, TagsInput, Grid, Box,
} from "@mantine/core";
import { IconPlus, IconMinus, IconCalendar, IconUpload } from "@tabler/icons-react";
import { useForm } from "@mantine/form";
import { DateInput } from "@mantine/dates";
import classes from "./TransactionForm.module.css";

// ADDED: initialDate and onSubmitTransaction props
const TransactionForm = ({ opened, onClose, initialDate, onSubmitTransaction }) => {
  const [transactionType, setTransactionType] = useState("expense");
  const [isRecurring, setIsRecurring] = useState(false);

  const form = useForm({
    initialValues: {
      amount: "",
      date: initialDate || new Date(), 
      category: "",
      description: "",
      paymentFrom: "",
      frequency: "",
      endDate: null,
      approvalStatus: "approved",
      tags: [],
      receipt: null,
    },
    validate: {
      amount: (value) => (value <= 0 ? "Amount must be greater than 0" : null),
      date: (value) => (!value ? "Date is required" : null),
      category: (value) => (!value ? "Category is required" : null),
      paymentFrom: (value) => transactionType === "expense" && !value ? "Payment source is required" : null,
      frequency: (value) => isRecurring && !value ? "Frequency is required when recurring" : null,
      approvalStatus: (value) => isRecurring && !value ? "Approval status is required" : null,
    },
  });

  // ADDED: Whenever the modal opens, update the form's date to match the calendar's selected date
  useEffect(() => {
    if (opened) {
      form.reset();
      form.setFieldValue("date", initialDate || new Date());
      setTransactionType("expense");
      setIsRecurring(false);
    }
  }, [opened, initialDate]);

  const categoryOptions = {
    income: ["Salary", "Freelance", "Investment", "Business", "Other", "Refund"],
    expense: ["Food & Dining", "Utilities", "Transportation", "Entertainment", "Shopping", "Healthcare", "Education", "Other", "Groceries", "Dining"],
  };

  const paymentSources = ["Wallet", "Bank Account", "Credit Card", "Debit Card", "acc_01", "acc_02"];
  const frequencies = ["Daily", "Weekly", "Monthly", "Yearly"];
  const approvalStatusOptions = ["Approved", "Pending"];

  const handleSubmit = (values) => {
    const transactionData = {
      ...values,
      type: transactionType,
      recurring: isRecurring,
    };
    if (!isRecurring) {
      delete transactionData.approvalStatus;
      delete transactionData.frequency;
      delete transactionData.endDate;
    }
    
    // ADDED: Pass data back to parent component so it shows up in the calendar!
    if (onSubmitTransaction) {
      onSubmitTransaction(transactionData);
    }
    
    onClose(); 
  };

  const handleClose = () => {
    onClose();
    setTimeout(() => {
      form.reset();
      setIsRecurring(false);
      setTransactionType("expense");
    }, 200);
  };

  return (
    <Modal opened={opened} onClose={handleClose} title="Add Transaction" size="lg" centered overlayProps={{ backgroundOpacity: 0.55, blur: 3 }}>
      <form onSubmit={form.onSubmit(handleSubmit)}>
        <Stack gap="md">
          <Tabs value={transactionType} onChange={setTransactionType}>
            <Tabs.List grow>
              <Tabs.Tab value="expense" color="red" leftSection={<IconMinus size={16} />}>Expense</Tabs.Tab>
              <Tabs.Tab value="income" color="green" leftSection={<IconPlus size={16} />}>Income</Tabs.Tab>
            </Tabs.List>
          </Tabs>

          <Grid>
            <Grid.Col span={{ base: 12, md: 6 }}>
              <NumberInput label="Amount" placeholder="0.00" required min={0.01} step={0.01} decimalScale={2} fixedDecimalScale prefix="₹" {...form.getInputProps("amount")} />
            </Grid.Col>
            <Grid.Col span={{ base: 12, md: 6 }}>
              <DateInput label="Date" placeholder="Select date" required rightSection={<IconCalendar size={18} />} {...form.getInputProps("date")} />
            </Grid.Col>
          </Grid>

          <Grid>
            <Grid.Col span={{ base: 12, md: transactionType === "expense" ? 6 : 12 }}>
              <Select label="Category" placeholder="Select a category" required data={categoryOptions[transactionType]} searchable {...form.getInputProps("category")} />
            </Grid.Col>
            {transactionType === "expense" && (
              <Grid.Col span={{ base: 12, md: 6 }}>
                <Select label="Payment Method" placeholder="Select a source" required data={paymentSources} {...form.getInputProps("paymentFrom")} />
              </Grid.Col>
            )}
          </Grid>

          <Textarea label="Description" placeholder="Add a short note" minRows={2} {...form.getInputProps("description")} />

          <Box className={classes.advancedOptionsBox}>
            <Checkbox label="This is a recurring transaction" checked={isRecurring} onChange={(event) => setIsRecurring(event.currentTarget.checked)} />
            {isRecurring && (
              <Grid mt="md">
                <Grid.Col span={{ base: 12, sm: 6 }}><Select label="Frequency" placeholder="Select frequency" required={isRecurring} data={frequencies} {...form.getInputProps("frequency")} /></Grid.Col>
                <Grid.Col span={{ base: 12, sm: 6 }}><Select label="Approval Status" placeholder="Set approval status" required={isRecurring} data={approvalStatusOptions} {...form.getInputProps("approvalStatus")} /></Grid.Col>
                <Grid.Col span={12}><DateInput label="End Date (Optional)" placeholder="Leave blank to repeat indefinitely" {...form.getInputProps("endDate")} /></Grid.Col>
              </Grid>
            )}
          </Box>

          <Group justify="flex-end" mt="lg">
            <Button variant="default" onClick={handleClose}>Cancel</Button>
            <Button type="submit">Add Transaction</Button>
          </Group>
        </Stack>
      </form>
    </Modal>
  );
};

export default TransactionForm;