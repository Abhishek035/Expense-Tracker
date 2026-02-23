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

export const initialAccounts = [
  {
    id: 1,
    type: "Wallet",
    nickname: "Paytm Wallet",
    balance: 769.86,
    provider: "Paytm",
    status: "active",
    transactions: mockTransactions("2022-06-15"),
    creationDate: "2022-06-15",
  },
  {
    id: 2,
    type: "Bank Account",
    nickname: "Salary Account",
    balance: 15984.5,
    bankName: "HDFC Bank",
    status: "active",
    transactions: mockTransactions("2020-11-20"),
    creationDate: "2022-06-15",
  },
  {
    id: 3,
    type: "Bank Account",
    nickname: "Old Savings",
    balance: 1250.0,
    bankName: "ICICI Bank",
    status: "archived",
    transactions: mockTransactions("2023-01-10"),
    creationDate: "2022-06-15",
  },
  {
    id: 4,
    type: "Wallet",
    nickname: "GPay",
    balance: 2500.5,
    provider: "Google Pay",
    status: "active",
    transactions: mockTransactions("2021-08-01"),
    creationDate: "2022-06-15",
  },
  {
    id: 5,
    type: "Bank Account",
    nickname: "Emergency Fund",
    balance: 50000.0,
    bankName: "Kotak Mahindra Bank",
    status: "active",
    transactions: mockTransactions("2021-08-01"),
    creationDate: "2022-06-15",
  },
];
