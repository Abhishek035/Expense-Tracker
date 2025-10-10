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
