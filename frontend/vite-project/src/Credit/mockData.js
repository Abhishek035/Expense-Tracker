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
