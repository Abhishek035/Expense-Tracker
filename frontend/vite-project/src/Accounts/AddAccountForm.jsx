import React, { useState, useEffect } from 'react';
import { Modal, Select, TextInput, NumberInput, Button, Group, Stack } from '@mantine/core';
import { useForm } from '@mantine/form';
import classes from './AddAccountForm.module.css';

const accountTypes = ["Bank Account", "Debit Card", "E-Wallet"];
const cardNetworks = ["Visa", "Mastercard", "RuPay", "American Express"];

export function AddAccountForm({ opened, onClose, onAddAccount }) {
  const [selectedType, setSelectedType] = useState(null);

  const form = useForm({
    initialValues: {
      accountType: '',
      nickname: '',
      last4: '',
      bankName: '',
      serviceProvider: '',
    },
    validate: {
      accountType: (value) => !value,
      nickname: (value) => (value.trim().length < 2 ? 'Nickname is too short' : null),
      last4: (value, values) =>
        values.accountType === 'Debit Card' && !/^\d{4}$/.test(value)
          ? 'Must be 4 digits'
          : null,
      bankName: (value, values) =>
        (values.accountType === 'Debit Card' || values.accountType === 'Bank Account') && !value
          ? 'Bank name is required'
          : null,
      serviceProvider: (value, values) =>
        values.accountType === 'E-Wallet' && !value
          ? 'Service provider is required'
          : null,
    },
  });

  useEffect(() => {
    // Reset fields when modal is opened or type changes
    if (!opened) {
       setTimeout(() => {
         form.reset();
         setSelectedType(null);
       }, 200); // Reset after modal close animation
    }
  }, [opened]);

  const handleTypeChange = (value) => {
    form.setFieldValue('accountType', value);
    setSelectedType(value);
    // Reset dependent fields on type change
    form.setValues({ last4: '', bankName: '', serviceProvider: '' });
  };

  const handleSubmit = (values) => {
    onAddAccount(values);
    onClose();
  };

  return (
    <Modal opened={opened} onClose={onClose} title="Add New Account" centered size="md" classNames={{ header: classes.modalHeader, title: classes.modalTitle }}>
      <form onSubmit={form.onSubmit(handleSubmit)}>
        <Stack gap="md">
          <Select
            label="Account Type"
            placeholder="Choose account type"
            data={accountTypes}
            required
            {...form.getInputProps('accountType')}
            onChange={handleTypeChange}
          />

          {selectedType && (
            <>
              <TextInput label="Nickname" placeholder="e.g., Salary Account" required {...form.getInputProps('nickname')} />

              {selectedType === 'Debit Card' && (
                <>
                  <TextInput label="Bank Name" placeholder="e.g., State Bank of India" required {...form.getInputProps('bankName')} />
                  <NumberInput label="Last 4 Digits" placeholder="1234" maxLength={4} hideControls required {...form.getInputProps('last4')} />
                  <Select label="Card Network" placeholder="Select network" data={cardNetworks} {...form.getInputProps('cardNetwork')} />
                </>
              )}

              {selectedType === 'Bank Account' && (
                <TextInput label="Bank Name" placeholder="e.g., HDFC Bank" required {...form.getInputProps('bankName')} />
              )}

              {selectedType === 'E-Wallet' && (
                <TextInput label="Service Provider" placeholder="e.g., Paytm, PhonePe" required {...form.getInputProps('serviceProvider')} />
              )}
            </>
          )}

          <Group justify="flex-end" mt="lg">
            <Button variant="default" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" disabled={!selectedType}>Save Account</Button>
          </Group>
        </Stack>
      </form>
    </Modal>
  );
}