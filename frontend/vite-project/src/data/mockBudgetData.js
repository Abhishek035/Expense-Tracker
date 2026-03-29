export const mockAccounts = [
  { id: "acc_01", type: "debit", balance: 45000.00 },
  { id: "acc_02", type: "cash", balance: 5000.00 }
];

export const mockBudgetCategories = [
  // Monthly
  { id: 'cat_1', name: 'Groceries', group: 'monthly', icon: 'IconShoppingCart' },
  { id: 'cat_2', name: 'Dining Out', group: 'monthly', icon: 'IconToolsKitchen2' },
  { id: 'cat_3', name: 'Entertainment', group: 'monthly', icon: 'IconDeviceGamepad2' },
  { id: 'cat_4', name: 'Gas & Fuel', group: 'monthly', icon: 'IconGasStation' },
  // Yearly / Irregular
  { id: 'cat_5', name: 'Car Insurance', group: 'yearly', icon: 'IconCar' },
  { id: 'cat_6', name: 'Vacation', group: 'yearly', icon: 'IconPlaneDeparture' },
  // Savings Goals
  { id: 'cat_7', name: 'Guitar Fund', group: 'savings', icon: 'IconGuitar', target: 50000, due: '2026-12' },
  { id: 'cat_8', name: 'Emergency Fund', group: 'savings', icon: 'IconShieldHeart', target: 100000, due: null },
];

export const mockBudgetAssignments = {
  "2026-03": {
    "cat_1": 10000, "cat_2": 1500, "cat_3": 1000, "cat_4": 2000,
    "cat_5": 24500, "cat_6": 20000,
    "cat_7": 10000, "cat_8": 5000
  }
};

export const mockBudgetSpent = {
  "2026-03": {
    "cat_1": 6200, "cat_2": 1200, "cat_3": 350, "cat_4": 2150,
    "cat_5": 24500, "cat_6": 0,
    "cat_7": 0, "cat_8": 0
  }
};

// Mock rollover data (money saved from previous months)
export const mockRollover = {
  "cat_7": 30000, // Had 30k saved previously for guitar
  "cat_8": 45000  // Had 45k saved previously for emergency
};