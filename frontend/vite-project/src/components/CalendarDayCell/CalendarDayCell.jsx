import { Flex, Text, Tooltip } from '@mantine/core';
import { IconCheck, IconClock, IconRepeat } from '@tabler/icons-react';
import { isToday } from '../../utils/calendarUtils';
import classes from './CalendarDayCell.module.css';

export default function CalendarDayCell({ dayInfo, isSelected, onSelect, data, viewOptions }) {
  const { 
    income = 0, expense = 0, net = 0, projected = 0, 
    completedCount = 0, pendingCount = 0, recurringCount = 0 
  } = data || {};
  
  const isTodayDate = isToday(dayInfo.date);

  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const cellDate = new Date(dayInfo.date);
  cellDate.setHours(0, 0, 0, 0);
  const isFutureDate = cellDate > today;

  let netClass = classes.rowNetNeutral;
  if (net > 0) netClass = classes.rowNetPositive;
  if (net < 0) netClass = classes.rowNetNegative;

  return (
    <div 
      className={`${classes.dayCell} ${isSelected ? classes.dayCellActive : ''} ${!dayInfo.isCurrentMonth ? classes.dayCellFaded : ''}`}
      onClick={() => onSelect(dayInfo.date)}
      role="button"
      tabIndex={0}
    >
      <div className={classes.dayHeader}>
        {/* LEFT SIDE: Status Icons */}
        <Flex gap={4} align="center">
          {completedCount > 0 && (
            <Tooltip label={`${completedCount} Completed`} withinPortal>
              <Flex align="center" gap={2} c="teal.6"><IconCheck size={14} stroke={3} /><Text size="xs" fw={700}>{completedCount}</Text></Flex>
            </Tooltip>
          )}
          {pendingCount > 0 && (
            <Tooltip label={`${pendingCount} Pending`} withinPortal>
              <Flex align="center" gap={2} c="orange.5"><IconClock size={14} stroke={2.5} /><Text size="xs" fw={700}>{pendingCount}</Text></Flex>
            </Tooltip>
          )}
          {recurringCount > 0 && (
            <Tooltip label={`${recurringCount} Recurring`} withinPortal>
              <Flex align="center" gap={2} c="blue.5"><IconRepeat size={14} stroke={2.5} /><Text size="xs" fw={700}>{recurringCount}</Text></Flex>
            </Tooltip>
          )}
        </Flex>

        {/* RIGHT SIDE: Today Dot & Date */}
        <div className={classes.dateWrapper}>
          {isTodayDate && <span className={classes.todayDot} title="Today" />}
          <Text className={classes.dayNumber}>{dayInfo.date.getDate()}</Text>
        </div>
      </div>
      
      <Flex direction="column" gap={2} mt="xs">
        {viewOptions.income && income > 0 && (
          <div className={`${classes.transactionRow} ${classes.rowIncome}`}>
            <span>Inc</span><span>+₹{income.toLocaleString()}</span>
          </div>
        )}
        {viewOptions.expense && expense > 0 && (
          <div className={`${classes.transactionRow} ${classes.rowExpense}`}>
            <span>Exp</span><span>-₹{expense.toLocaleString()}</span>
          </div>
        )}
        {viewOptions.net && (income > 0 || expense > 0) && (
          <div className={`${classes.transactionRow} ${netClass}`}>
            <span>Net</span>
            <span>{net > 0 ? '+' : ''}₹{net.toLocaleString()}</span>
          </div>
        )}
      </Flex>

      {isFutureDate && (
        <div className={`${classes.projectedBalance} ${projected < 0 ? classes.projectedBalanceNegative : ''}`}>
          Proj: ₹{projected.toLocaleString()}
        </div>
      )}
    </div>
  );
}