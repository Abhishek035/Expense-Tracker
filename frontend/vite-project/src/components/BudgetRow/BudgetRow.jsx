// src/components/BudgetRow/BudgetRow.jsx
import React, { useState } from 'react';
import { Flex, Text, NumberInput, Badge, Button, Progress, Box, Popover, Stack, ActionIcon, Tooltip } from '@mantine/core';
import { IconPlus, IconWallet, IconTrash } from '@tabler/icons-react';
import * as TablerIcons from '@tabler/icons-react';
import classes from '../../pages/BudgetPage/BudgetPage.module.css';

export default function BudgetRow({ category, assigned, spent, rollover = 0, target, onAssignChange, onTargetChange, onLogExpense, onDelete }) {
  const isSavings = category.group === 'savings';
  const available = assigned + rollover - spent;
  
  const [fundsPopoverOpened, setFundsPopoverOpened] = useState(false);
  const [fundsInput, setFundsInput] = useState(0);
  
  let progressValue = 0;
  let progressColor = "primary";

  if (isSavings) {
    progressValue = target > 0 ? Math.min((available / target) * 100, 100) : 0;
    progressColor = progressValue >= 100 ? "teal" : "primary";
  } else {
    progressValue = assigned > 0 ? Math.min((spent / assigned) * 100, 100) : (spent > 0 ? 100 : 0);
    if (available < 0) progressColor = "red";
    else if (progressValue > 85) progressColor = "orange";
    else progressColor = "primary";
  }

  const IconComponent = TablerIcons[category.icon] || TablerIcons.IconReceipt2;

  const handleFundSubmit = () => {
    onAssignChange(category.id, assigned + fundsInput);
    setFundsInput(0);
    setFundsPopoverOpened(false);
  };

  return (
    <Box className={classes.rowGrid}>
      <Flex gap="md" align="center">
        <div className={classes.iconWrapper}>
          <IconComponent size={20} />
        </div>
        <Box flex={1}>
          <Text fw={600}>{category.name}</Text>
          {isSavings && category.due && <Text className={classes.savingsSubtext} mt={4}>Due: {category.due}</Text>}
          <Progress value={progressValue} color={progressColor} size="sm" mt={isSavings ? 4 : 8} radius="xl" bg="gray.2" />
        </Box>
      </Flex>

      <div className={classes.colRight}>
        {isSavings ? (
          <NumberInput value={target} onChange={(val) => onTargetChange(category.id, Number(val) || 0)} prefix="₹" hideControls size="sm" w={120} styles={{ input: { textAlign: 'right', fontWeight: 500 } }} />
        ) : (
          <NumberInput value={assigned} onChange={(val) => onAssignChange(category.id, Number(val) || 0)} prefix="₹" hideControls size="sm" w={120} styles={{ input: { textAlign: 'right', fontWeight: 500 } }} />
        )}
      </div>

      <div className={classes.colRight}>
        {isSavings ? (
          <Text size="md" fw={700} c={available >= target ? "teal.6" : "dark.9"}>₹{available.toLocaleString()}</Text>
        ) : (
          <Text c="dimmed" size="sm" fw={500}>₹{spent.toLocaleString()}</Text>
        )}
      </div>

      <div className={classes.colRight}>
        {!isSavings && (
          <Badge size="lg" radius="sm" color={available < 0 ? 'red' : available > 0 ? 'teal' : 'gray'} variant="light" styles={{ label: { fontSize: '14px', fontWeight: 600 } }}>
            {available < 0 ? '-' : ''}₹{Math.abs(available).toLocaleString()}
          </Badge>
        )}
      </div>

      <div className={classes.colRight}>
        <Flex gap="xs" align="center">
          {/* Main Action Button */}
          {isSavings ? (
            <Popover opened={fundsPopoverOpened} onChange={setFundsPopoverOpened} position="bottom-end" withArrow shadow="md">
              <Popover.Target>
                <Button variant="light" color="primary" size="sm" px="sm" leftSection={<IconWallet size={16} />} onClick={() => setFundsPopoverOpened((o) => !o)}>
                  Funds
                </Button>
              </Popover.Target>
              <Popover.Dropdown p="sm">
                <Stack gap="xs" w={220}>
                  <Text size="xs" fw={600} c="dimmed">Add or Remove Funds</Text>
                  <NumberInput value={fundsInput} onChange={(val) => setFundsInput(Number(val) || 0)} prefix="₹" placeholder="e.g. 500 or -200" size="sm" styles={{ input: { textAlign: 'right' } }} />
                  <Flex gap="xs">
                    <Button variant="default" size="xs" fullWidth onClick={() => setFundsPopoverOpened(false)}>Cancel</Button>
                    <Button color="primary" size="xs" fullWidth onClick={handleFundSubmit}>Save</Button>
                  </Flex>
                </Stack>
              </Popover.Dropdown>
            </Popover>
          ) : (
            <Button variant="light" color="primary" size="sm" px="sm" leftSection={<IconPlus size={16} />} onClick={() => onLogExpense(category)}>
              Log
            </Button>
          )}

          {/* NEW: Delete Button */}
          <Tooltip label="Delete" withArrow position="top">
            <ActionIcon variant="subtle" color="red" size="lg" onClick={() => onDelete(category.id)}>
              <IconTrash size={18} />
            </ActionIcon>
          </Tooltip>
        </Flex>
      </div>
    </Box>
  );
}