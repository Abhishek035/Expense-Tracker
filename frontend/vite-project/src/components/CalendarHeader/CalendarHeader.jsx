import React, { useState } from 'react';
import { Flex, Title, Switch, Popover, Button, Stack, Text, MultiSelect, UnstyledButton, ScrollArea, Divider, Box, Group, Checkbox } from '@mantine/core';
import { IconFilter, IconChevronDown } from '@tabler/icons-react';
import { mockAccounts, mockCategories } from '../../data/mockData';
import classes from './CalendarHeader.module.css';

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

export default function CalendarHeader({ currentDate, setCurrentDate, viewOptions, setViewOptions, filters, setFilters }) {
  const [dateDropdownOpened, setDateDropdownOpened] = useState(false);

  // Filter Dropdown State
  const [filterOpened, setFilterOpened] = useState(false);
  const [draftFilters, setDraftFilters] = useState({ account: [], category: [], type: [] });

  const currentMonthIdx = currentDate.getMonth();
  const currentYear = currentDate.getFullYear();
  const monthName = currentDate.toLocaleString('default', { month: 'long', year: 'numeric' });

  const actualCurrentYear = new Date().getFullYear();
  const YEARS = Array.from({ length: 21 }, (_, i) => actualCurrentYear - 10 + i);

  const handleToggle = (field) => (e) => {
    const isChecked = e.currentTarget.checked;
    setViewOptions(prev => ({ ...prev, [field]: isChecked }));
  };

  // Open filter popover and sync draft with current active filters
  const handleOpenFilter = () => {
    setDraftFilters(filters);
    setFilterOpened((o) => !o);
  };

  // Apply filters and close popover
  const handleApplyFilter = () => {
    setFilters(draftFilters);
    setFilterOpened(false);
  };

  const handleClearFilter = () => {
    const emptyFilters = { account: [], category: [], type: [] };
    setDraftFilters(emptyFilters);
    setFilters(emptyFilters);
    setFilterOpened(false);
  };

  // Custom render function to add Checkboxes inside the Dropdown options
  const renderCheckboxOption = ({ option, checked }) => (
    <Flex align="center" gap="sm">
      <Checkbox 
        checked={checked} 
        onChange={() => {}} // Controlled purely by the MultiSelect click
        tabIndex={-1} 
        style={{ pointerEvents: 'none' }} // Ensures clicking the row toggles it, not just the tiny box
        color="primary"
        size="sm"
      />
      <Text size="sm">{option.label}</Text>
    </Flex>
  );

  return (
    <div className={classes.headerWrapper}>
      {/* Date Navigation Popover */}
      <Popover opened={dateDropdownOpened} onChange={setDateDropdownOpened} position="bottom-start" withArrow shadow="md">
        <Popover.Target>
          <UnstyledButton className={classes.dateSelector} onClick={() => setDateDropdownOpened((o) => !o)}>
            <Title order={2} fw={600}>{monthName}</Title>
            <IconChevronDown size={24} stroke={2.5} />
          </UnstyledButton>
        </Popover.Target>
        
        <Popover.Dropdown p="md">
          <Flex gap="md" align="stretch">
            <Box w={90}>
              <Text className={classes.pickerColumnTitle} size="sm">Month</Text>
              <ScrollArea h={220} scrollbarSize={6}>
                {MONTHS.map((month, idx) => (
                  <div key={month} 
                    className={`${classes.pickerItem} ${idx === currentMonthIdx ? classes.pickerItemSelected : ''}`}
                    onClick={() => {
                      setCurrentDate(new Date(currentYear, idx, 1));
                      setDateDropdownOpened(false);
                    }}
                  >
                    {month}
                  </div>
                ))}
              </ScrollArea>
            </Box>
            <Divider orientation="vertical" />
            <Box w={90}>
              <Text className={classes.pickerColumnTitle} size="sm">Year</Text>
              <ScrollArea h={220} scrollbarSize={6}>
                {YEARS.map((year) => (
                  <div key={year} 
                    className={`${classes.pickerItem} ${year === currentYear ? classes.pickerItemSelected : ''}`}
                    onClick={() => {
                      setCurrentDate(new Date(year, currentMonthIdx, 1));
                      setDateDropdownOpened(false);
                    }}
                  >
                    {year}
                  </div>
                ))}
              </ScrollArea>
            </Box>
          </Flex>
        </Popover.Dropdown>
      </Popover>

      {/* Toggles & Filter Popover */}
      <Flex align="center" gap="lg" wrap="wrap">
        <Flex gap="md">
          <Switch label="Income" color="teal.6" checked={viewOptions.income} onChange={handleToggle("income")} />
          <Switch label="Expense" color="red.6" checked={viewOptions.expense} onChange={handleToggle("expense")} />
          <Switch label="Net" color="gray.6" checked={viewOptions.net} onChange={handleToggle("net")} />
        </Flex>

        <Popover opened={filterOpened} onChange={setFilterOpened} position="bottom-end" withArrow shadow="md">
          <Popover.Target>
            <Button variant="outline" color="primary" onClick={handleOpenFilter} leftSection={<IconFilter size={16} />}>
              Filter
            </Button>
          </Popover.Target>
          
          <Popover.Dropdown p="md">
            <Stack gap="md" w={300}>
              <Text size="sm" fw={600}>Filter Transactions</Text>
              
              <MultiSelect 
                label="Accounts" 
                placeholder="Select accounts" 
                data={mockAccounts} 
                value={draftFilters.account} 
                onChange={(val) => setDraftFilters(p => ({ ...p, account: val }))} 
                clearable 
                searchable
                renderOption={renderCheckboxOption}
                hidePickedOptions={false} // Keeps checked items in the dropdown list
                comboboxProps={{ withinPortal: false }} // PREVENTS POPOVER FROM CLOSING ON CLICK
                maxDropdownHeight={150} 
              />
              
              <MultiSelect 
                label="Categories" 
                placeholder="Select categories" 
                data={mockCategories} 
                value={draftFilters.category} 
                onChange={(val) => setDraftFilters(p => ({ ...p, category: val }))} 
                clearable 
                searchable
                renderOption={renderCheckboxOption}
                hidePickedOptions={false}
                comboboxProps={{ withinPortal: false }} 
                maxDropdownHeight={150}
              />
              
              <MultiSelect 
                label="Types" 
                placeholder="Select types" 
                data={[
                  { value: 'income', label: 'Income' }, 
                  { value: 'expense', label: 'Expense' }, 
                  { value: 'transfer', label: 'Transfer' }
                ]} 
                value={draftFilters.type} 
                onChange={(val) => setDraftFilters(p => ({ ...p, type: val }))} 
                clearable
                renderOption={renderCheckboxOption}
                hidePickedOptions={false}
                comboboxProps={{ withinPortal: false }} 
              />

              <Divider mt="xs" />

              <Group grow mt="xs">
                <Button variant="light" color="gray" onClick={handleClearFilter}>
                  Clear
                </Button>
                <Button color="primary" onClick={handleApplyFilter}>
                  Apply
                </Button>
              </Group>
            </Stack>
          </Popover.Dropdown>
        </Popover>
      </Flex>
    </div>
  );
}