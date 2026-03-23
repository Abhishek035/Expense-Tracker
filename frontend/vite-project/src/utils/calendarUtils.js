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

// FIX: Format date strictly in LOCAL time to prevent timezone shifting
export const formatDate = (date) => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

export const isToday = (date) => {
  const today = new Date();
  return (
    date.getDate() === today.getDate() &&
    date.getMonth() === today.getMonth() &&
    date.getFullYear() === today.getFullYear()
  );
};