export const getDaysInMonthView = (year, month) => {
  const startDate = new Date(year, month, 1);
  const endDate = new Date(year, month + 1, 0);
  
  const days = [];
  // Pad beginning of calendar grid
  for (let i = 0; i < startDate.getDay(); i++) {
    const d = new Date(year, month, -startDate.getDay() + i + 1);
    days.push({ date: d, isCurrentMonth: false });
  }
  // Current month days
  for (let i = 1; i <= endDate.getDate(); i++) {
    days.push({ date: new Date(year, month, i), isCurrentMonth: true });
  }
  // Pad end of calendar grid to ensure 6 rows (42 cells total)
  const remainingCells = 42 - days.length; 
  for (let i = 1; i <= remainingCells; i++) {
    days.push({ date: new Date(year, month + 1, i), isCurrentMonth: false });
  }
  return days;
};

export const isToday = (date) => {
  const today = new Date();
  return (
    date.getDate() === today.getDate() &&
    date.getMonth() === today.getMonth() &&
    date.getFullYear() === today.getFullYear()
  );
};

export const formatDate = (date) => date.toISOString().split('T')[0];