import React from 'react';
import { Modal, TextInput, Select, Group, Button, Stack, NumberInput } from '@mantine/core';
import { useForm } from '@mantine/form';
import classes from './AddCreditAccountForm.module.css';

export function AddCreditAccountForm({ opened, onClose, onAddAccount }) {
  const form = useForm({
    initialValues: {
      nickname: '',
      accountType: 'Credit Card',
      last4: '',
      provider: '',
      network: '',
    },
    validate: {
      nickname: (value) => (value.trim().length > 0 ? null : 'Nickname is required'),
      provider: (value) => (value.trim().length > 0 ? null : 'Provider is required'),
      accountType: (value) => (value ? null : 'Account type is required'),
    },
  });

  const handleSubmit = (values) => {
    onAddAccount(values);
    form.reset();
    onClose();
  };

  return (
    <Modal opened={opened} onClose={onClose} title="Add Credit Account" centered>
      <form onSubmit={form.onSubmit(handleSubmit)}>
        <Stack gap="md">
          <TextInput
            withAsterisk
            label="Nickname"
            placeholder="e.g., ICICI Amazon Pay"
            {...form.getInputProps('nickname')}
          />
          <Select
            withAsterisk
            label="Account Type"
            placeholder="Select account type"
            data={['Credit Card', 'Pay Later Service', 'Store Card']}
            {...form.getInputProps('accountType')}
          />
          <TextInput
            label="Issuing Bank / Provider"
            placeholder="e.g., HDFC Bank, Simpl"
            withAsterisk
            {...form.getInputProps('provider')}
          />
          {form.values.accountType === 'Credit Card' && (
            <Select
              label="Card Network"
              placeholder="e.g., Visa"
              data={['Visa', 'Mastercard', 'RuPay', 'American Express']}
              {...form.getInputProps('network')}
            />
          )}
          <NumberInput
            label="Last 4 Digits (Optional)"
            placeholder="1234"
            maxLength={4}
            allowDecimal={false}
            allowNegative={false}
            {...form.getInputProps('last4')}
          />
          <Group justify="flex-end" mt="md">
            <Button variant="default" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" className={classes.submitButton}>
              Add Account
            </Button>
          </Group>
        </Stack>
      </form>
    </Modal>
  );
}