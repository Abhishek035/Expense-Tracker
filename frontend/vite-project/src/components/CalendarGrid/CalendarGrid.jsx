import { formatDate } from '../../utils/calendarUtils';
import CalendarDayCell from '../CalendarDayCell/CalendarDayCell';
import classes from './CalendarGrid.module.css';

const DAYS_OF_WEEK = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

export default function CalendarGrid({ daysInView, selectedDate, setSelectedDate, dailyData, viewOptions }) {
  return (
    <div className={classes.calendarWrapper}>
      <div className={classes.daysOfWeek}>
        {DAYS_OF_WEEK.map(day => (
          <div key={day} className={classes.dayOfWeek}>{day}</div>
        ))}
      </div>
      <div className={classes.grid}>
        {daysInView.map((day, idx) => {
          const dateStr = formatDate(day.date);
          return (
            <CalendarDayCell 
              key={idx} 
              dayInfo={day} 
              isSelected={dateStr === formatDate(selectedDate)}
              onSelect={setSelectedDate} 
              data={dailyData[dateStr]}
              viewOptions={viewOptions}
            />
          );
        })}
      </div>
    </div>
  );
}