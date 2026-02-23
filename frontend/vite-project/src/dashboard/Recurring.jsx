import React from "react";

const Recurring = () => {
  // Sample recurring transactions data
  const recurringTransactions = [
    {
      id: 1,
      icon: "fa-brands fa-spotify",
      name: "Spotify Premium",
      type: "expense",
      approval: "Pending",
      duration: "Monthly",
      amount: -9.99,
      date: "15th sept",
      color: "#1DB954"
    },
    {
      id: 2,
      icon: "fa-brands fa-netflix",
      name: "Netflix Subscription",
      type: "expense", 
      approval: "Pending",
      duration: "Monthly",
      amount: -15.99,
      date: "22nd sept",
      color: "#E50914"
    },
    {
      id: 3,
      icon: "fa-solid fa-building",
      name: "Salary Payment",
      type: "income",
      approval: "Confirmed",
      duration: "Monthly", 
      amount: 4500.00,
      date: "1st sept",
      color: "#10B981"
    },
    {
      id: 4,
      icon: "fa-brands fa-aws",
      name: "AWS Services",
      type: "expense",
      approval: "Pending",
      duration: "Monthly",
      amount: -89.50,
      date: "5th sept",
      color: "#FF9900"
    },
  ];

  const formatAmount = (amount) => {
    const formatted = Math.abs(amount).toFixed(2);
    return amount >= 0 ? `+$${formatted}` : `-$${formatted}`;
  };

  const getApprovalBadge = (approval) => {
    const baseClasses = "px-2 py-1 rounded-full text-xs font-medium";
    if (approval === "Pending") {
      return `${baseClasses} bg-red-100 text-orange-800`;
    } else {
      return `${baseClasses} bg-blue-100 text-blue-800`;
    }
  };

  const getTypeColor = (type) => {
    return type === "income" ? "text-green-600" : "text-gray-600";
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-100 h-[230px] flex flex-col">
      {/* Header */}
      <div className="p-4 border-b border-gray-100 flex-shrink-0">
        <h2 className="text-xl font-semibold text-gray-900">Recurring Transactions</h2>
      </div>

      {/* Transactions List */}
      <div className="flex-1 overflow-y-auto md:overflow-y-hidden md:hover:overflow-y-auto transition-all duration-500 ease-in-out">
        {recurringTransactions.map((transaction) => (
          <div 
            key={transaction.id} 
            className="flex flex-col md:flex-row md:items-center p-4 border-b border-gray-50 hover:bg-primary/20 transition-colors duration-150"
          >
            {/* Transaction Info */}
            <div className="flex items-center flex-1 mb-2 md:mb-0">
              <div 
                className="w-10 h-10 rounded-full flex items-center justify-center mr-3 flex-shrink-0"
                style={{ backgroundColor: transaction.color + '20' }}
              >
                <i 
                  className={`${transaction.icon} text-lg`}
                  style={{ color: transaction.color }}
                ></i>
              </div>
              <div className="min-w-0 flex-1">
                <h3 className="text-sm font-medium text-gray-900 truncate">
                  {transaction.name}
                </h3>
                <p className="text-xs text-gray-500 md:hidden">
                  {transaction.duration} • {transaction.date}
                </p>
              </div>
            </div>

            {/* Mobile Layout */}
            <div className="flex justify-between items-center md:hidden">
              <div className="flex items-center gap-2">
                <span className={`text-xs font-medium ${getTypeColor(transaction.type)}`}>
                  {transaction.type}
                </span>
                <span className={getApprovalBadge(transaction.approval)}>
                  {transaction.approval}
                </span>
              </div>
              <div className="text-right">
                <div className={`text-sm font-medium ${transaction.amount >= 0 ? 'text-green-600' : 'text-gray-900'}`}>
                  {formatAmount(transaction.amount)}
                </div>
              </div>
            </div>

            {/* Desktop Layout */}
            <div className="hidden md:flex md:items-center">
              <div className="w-20 text-center">
                <span className={`text-xs font-medium px-2 py-1 rounded-full ${
                  transaction.type === 'income' 
                    ? 'bg-green-100 text-green-800' 
                    : 'bg-red-100 text-red-800'
                }`}>
                  {transaction.type}
                </span>
              </div>
              
              <div className="w-24 text-center">
                <span className={getApprovalBadge(transaction.approval)}>
                  {transaction.approval}
                </span>
              </div>
              
              <div className="w-20 text-center">
                <span className="text-sm text-gray-600">{transaction.duration}</span>
              </div>
              
              <div className="w-24 text-right">
                <span className={`text-sm font-medium ${
                  transaction.amount >= 0 ? 'text-green-600' : 'text-gray-900'
                }`}>
                  {formatAmount(transaction.amount)}
                </span>
              </div>
              
              <div className="w-16 text-center">
                <span className="text-sm text-gray-600">{transaction.date}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Recurring;