const getRelativeDate = (daysOffset) => {
  const d = new Date();
  d.setDate(d.getDate() + daysOffset);
  return d;
};

export const mockReminders = [
  // Overdue
  { id: 'r1', description: 'Electricity Bill', amount: 2000, type: 'expense', category: 'Utilities', account: 'HDFC Credit', date: getRelativeDate(-3), isRecurring: true, budgetLeft: '₹3k' },
  { id: 'r2', description: 'Car Loan EMI', amount: 15000, type: 'expense', category: 'Loan', account: 'SBI Loan', date: getRelativeDate(-1), isRecurring: true, budgetLeft: '₹3k' },
  // Next 7 Days
  { id: 'r3', description: 'House Rent', amount: 12000, type: 'expense', category: 'Housing', account: 'Salary Account', date: getRelativeDate(3), isRecurring: true, budgetLeft: '₹12k' },
  { id: 'r4', description: 'Credit Card Bill', amount: 5500, type: 'expense', category: 'Credit', account: 'HDFC Credit', date: getRelativeDate(4), isRecurring: true, budgetLeft: '₹10k' },
  // Later this Month
  { id: 'r5', description: 'Internet Bill', amount: 899, type: 'expense', category: 'Utilities', account: 'Salary Account', date: getRelativeDate(11), isRecurring: true, budgetLeft: '₹2.5k' },
];