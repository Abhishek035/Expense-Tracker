export const dummyTransactions =[
  {
    id: "t_101",
    date: "2023-10-27T14:30:00",
    amount: 45.50,
    type: "expense",
    category: "Groceries",
    accountId: "acc_01",
    description: "Walmart run",
    isRecurring: false,
    recurringFrequency: null
  },
  {
    id: "t_102",
    date: "2023-10-26T18:00:00",
    amount: 1200.00,
    type: "expense",
    category: "Dining",
    accountId: "acc_02",
    description: "Dinner out",
    isRecurring: false,
    recurringFrequency: null
  },
  {
    id: "t_103",
    date: "2023-10-25T19:30:00",
    amount: 1750.00,
    type: "income",
    category: "Refund",
    accountId: "acc_03",
    description: "Refund for cancelled ticket",
    isRecurring: false,
    recurringFrequency: null
  },
  {
    id: "t_104",
    date: "2023-10-20T14:00:00",
    amount: 950.00,
    type: "expense",
    category: "Shopping",
    accountId: "acc_04",
    description: "Flipkart order",
    isRecurring: false,
    recurringFrequency: null
  },
  {
    id: "t_105",
    date: "2023-10-19T09:00:00",
    amount: 5000.00,
    type: "transfer",
    category: "Transfer",
    accountId: "acc_05",
    description: "Transferred to savings",
    isRecurring: true,
    recurringFrequency: "monthly"
  },
  {
    id: "t_106",
    date: "2023-10-17T13:30:00",
    amount: 25000.00,
    type: "income",
    category: "Salary",
    accountId: "acc_05",
    description: "Monthly salary",
    isRecurring: true,
    recurringFrequency: "monthly"
  }
];

export const mockCategories =["Groceries", "Dining", "Refund", "Shopping", "Transfer", "Salary", "Entertainment", "Utilities"];
export const mockAccounts =[
  { value: "acc_01", label: "Simpl Pay" },
  { value: "acc_02", label: "ICICI Amazon Pay" },
  { value: "acc_03", label: "Paytm Wallet" },
  { value: "acc_04", label: "Flipkart Pay Later" },
  { value: "acc_05", label: "Salary Account" }
];