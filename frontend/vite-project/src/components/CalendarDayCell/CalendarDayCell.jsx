import { Flex, Text } from '@mantine/core';
import { isToday } from '../../utils/calendarUtils';
import classes from './CalendarDayCell.module.css';

export default function CalendarDayCell({ dayInfo, isSelected, onSelect, data, viewOptions }) {
  const { income = 0, expense = 0, net = 0, projected = 0 } = data || {};
  
  const isTodayDate = isToday(dayInfo.date);

  // Determine if date is in the future (to show projected balance)
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const cellDate = new Date(dayInfo.date);
  cellDate.setHours(0, 0, 0, 0);
  const isFutureDate = cellDate > today;

  // Determine Net color class
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
        {isTodayDate && <span className={classes.todayDot} title="Today" />}
        <Text className={classes.dayNumber}>{dayInfo.date.getDate()}</Text>
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

      {/* Show projected balance ONLY for future dates */}
      {isFutureDate && (
        <div className={`${classes.projectedBalance} ${projected < 0 ? classes.projectedBalanceNegative : ''}`}>
          Proj: ₹{projected.toLocaleString()}
        </div>
      )}
    </div>
  );
}