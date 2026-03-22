// A simple function to generate mock data
export const mockTransactions = (creationDate) => {
  const data = [];
  const startDate = new Date(creationDate);
  const endDate = new Date();
  let lastAmount = Math.random() * 2000 + 500;

  // Calculate the number of days between creation and now
  const daysSinceCreation = Math.floor(
    (endDate - startDate) / (1000 * 60 * 60 * 24)
  );

  for (let i = daysSinceCreation; i > 0; i--) {
    const date = new Date();
    date.setDate(date.getDate() - i);
    lastAmount += (Math.random() - 0.5) * 500; // Fluctuate the amount
    data.push({
      date: date.toISOString().split("T")[0], // Store date in YYYY-MM-DD format
      amount: Math.max(0, Math.round(lastAmount)), // Ensure amount is not negative
    });
  }
  return data;
};

export const initialCreditAccounts = [
  {
    id: 1,
    nickname: "ICICI Amazon Pay",
    accountType: "Credit Card",
    provider: "ICICI Bank",
    last4: "2042",
    network: "Visa",
    amount: "5000",
    creationDate: "2022-06-15",
    transactions: mockTransactions("2022-06-15"),
  },
  {
    id: 2,
    nickname: "HDFC Millennia",
    accountType: "Credit Card",
    provider: "HDFC Bank",
    last4: "9876",
    network: "Mastercard",
    amount: "12000",
    creationDate: "2020-11-20",
    transactions: mockTransactions("2020-11-20"),
  },
  {
    id: 3,
    nickname: "Simpl Pay",
    accountType: "Pay Later Service",
    provider: "Simpl",
    last4: null,
    network: null,
    amount: "800",
    creationDate: "2023-01-10",
    transactions: mockTransactions("2023-01-10"),
  },
  {
    id: 4,
    nickname: "Flipkart Pay Later",
    accountType: "Pay Later Service",
    provider: "IDFC First Bank",
    last4: null,
    network: null,
    amount: "2500",
    creationDate: "2021-08-01",
    transactions: mockTransactions("2021-08-01"),
  },
];


// This one below is for the calendar page. 
export const mockCategories = ["Groceries", "Dining", "Refund", "Shopping", "Transfer", "Salary", "Entertainment", "Utilities"];

export const mockAccounts = [
  { value: "acc_01", label: "Simpl Pay" },
  { value: "acc_02", label: "ICICI Amazon Pay" },
  { value: "acc_03", label: "Paytm Wallet" },
  { value: "acc_04", label: "Flipkart Pay Later" },
  { value: "acc_05", label: "Salary Account" }
];

// Helper to generate dates relative to today
const getRelativeDate = (daysOffset, hour = 10) => {
  const date = new Date();
  date.setDate(date.getDate() + daysOffset);
  date.setHours(hour, 0, 0, 0);
  return date.toISOString();
};

export const generateMockTransactions = () => [
  { id: "t_101", date: getRelativeDate(-5, 14), amount: 45.50, type: "expense", category: "Groceries", accountId: "acc_01", description: "Walmart run", isRecurring: false },
  { id: "t_102", date: getRelativeDate(-2, 18), amount: 1200.00, type: "expense", category: "Dining", accountId: "acc_02", description: "Dinner out", isRecurring: false },
  { id: "t_103", date: getRelativeDate(-1, 19), amount: 1750.00, type: "income", category: "Refund", accountId: "acc_03", description: "Refund for cancelled ticket", isRecurring: false },
  { id: "t_104", date: getRelativeDate(0, 14), amount: 950.00, type: "expense", category: "Shopping", accountId: "acc_04", description: "Flipkart order", isRecurring: false },
  { id: "t_105", date: getRelativeDate(2, 9), amount: 5000.00, type: "transfer", category: "Transfer", accountId: "acc_05", description: "Transferred to savings", isRecurring: true },
  { id: "t_106", date: getRelativeDate(5, 13), amount: 25000.00, type: "income", category: "Salary", accountId: "acc_05", description: "Monthly salary", isRecurring: true },
  { id: "t_107", date: getRelativeDate(8, 10), amount: 120.00, type: "expense", category: "Utilities", accountId: "acc_02", description: "Electricity Bill", isRecurring: true, isPending: true },
  { id: "t_108", date: getRelativeDate(12, 20), amount: 350.00, type: "expense", category: "Entertainment", accountId: "acc_01", description: "Movie Tickets", isRecurring: false },
];