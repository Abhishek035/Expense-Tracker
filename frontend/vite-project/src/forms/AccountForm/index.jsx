import React, { useState, useEffect } from 'react';
import { Modal, Select, TextInput, NumberInput, Button, Group, Stack } from '@mantine/core';
import { useForm } from '@mantine/form';
import classes from '../CreditAccountForm/index.module.css';

const accountTypes = ["Bank Account", "Wallet"];

export function AccountForm({ opened, onClose, onAddAccount }) {
  const [selectedType, setSelectedType] = useState(null);

  const form = useForm({
    initialValues: { type: '', nickname: '', bankName: '', provider: '' },
    validate: {
      type: (value) => !value,
      nickname: (value) => (value.trim().length < 2 ? 'Nickname is too short' : null),
      bankName: (value, values) => (values.type === 'Bank Account' && !value ? 'Bank name is required' : null),
      provider: (value, values) => (values.type === 'Wallet' && !value ? 'Service provider is required' : null),
    },
  });

  useEffect(() => {
    if (!opened) {
      setTimeout(() => {
        form.reset();
        setSelectedType(null);
      }, 200);
    }
  }, [opened]);

  const handleTypeChange = (value) => {
    form.setFieldValue('type', value);
    setSelectedType(value);
    form.setValues({ nickname: '', bankName: '', provider: '' });
  };

  const handleSubmit = (values) => {
    onAddAccount(values);
    onClose();
  };

  return (
    <Modal opened={opened} onClose={onClose} title="Add New Account" centered size="md">
      <form onSubmit={form.onSubmit(handleSubmit)}>
        <Stack gap="md">
          <Select
            label="Account Type"
            placeholder="Choose account type"
            data={accountTypes}
            required
            {...form.getInputProps('type')}
            onChange={handleTypeChange}
          />
          {selectedType && (
            <>
              <TextInput label="Nickname" placeholder="e.g., Salary Account" required {...form.getInputProps('nickname')} />
              {selectedType === 'Bank Account' && (
                <TextInput label="Bank Name" placeholder="e.g., HDFC Bank" required {...form.getInputProps('bankName')} />
              )}
              {selectedType === 'Wallet' && (
                <TextInput label="Service Provider" placeholder="e.g., Paytm, PhonePe" required {...form.getInputProps('provider')} />
              )}
            </>
          )}
          <Group justify="flex-end" mt="lg">
            <Button variant="default" onClick={onClose}>Cancel</Button>
            <Button type="submit" disabled={!selectedType}>Save Account</Button>
          </Group>
        </Stack>
      </form>
    </Modal>
  );
}