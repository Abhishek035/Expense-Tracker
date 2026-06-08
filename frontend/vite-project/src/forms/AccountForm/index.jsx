// src/forms/AccountForm.jsx
import React from 'react';
import { Modal, TextInput, Select, NumberInput, Button, Stack, Group } from '@mantine/core';
import { useForm } from '@mantine/form';

export function AccountForm({ opened, onClose, onAddAccount }) {
  const form = useForm({
    initialValues: {
      type: 'Bank Account',
      bankName: '',
      nickname: '',
      balance: 0, // <-- Added balance field
    },
    validate: {
      nickname: (value) => (value.trim().length === 0 ? 'Nickname is required' : null),
    },
  });

  const handleSubmit = (values) => {
    onAddAccount(values);
    form.reset();
  };

  const handleClose = () => {
    form.reset();
    onClose();
  };

  return (
    <Modal opened={opened} onClose={handleClose} title="Add New Account" centered shadow="md">
      <form onSubmit={form.onSubmit(handleSubmit)}>
        <Stack gap="md">
          <Select
            label="Account Type"
            data={['Bank Account', 'Wallet']}
            {...form.getInputProps('type')}
          />
          <TextInput
            label="Bank Name / Provider"
            placeholder="e.g., HDFC, Paytm"
            {...form.getInputProps('bankName')}
          />
          <TextInput
            label="Nickname"
            placeholder="e.g., Salary Account"
            withAsterisk
            {...form.getInputProps('nickname')}
          />
          
          {/* NEW: Balance Input Field */}
          <NumberInput
            label="Initial Balance"
            placeholder="0.00"
            prefix="₹"
            decimalScale={2}
            fixedDecimalScale
            hideControls
            {...form.getInputProps('balance')}
          />
          
          <Group justify="flex-end" mt="md">
            <Button variant="default" onClick={handleClose}>Cancel</Button>
            <Button type="submit" color="primary">Save Account</Button>
          </Group>
        </Stack>
      </form>
    </Modal>
  );
}