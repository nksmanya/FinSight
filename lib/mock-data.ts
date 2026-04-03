import { Transaction } from '@/types';

export const mockTransactions: Transaction[] = [
  // January 2026
  { id: '1', date: '2026-01-01', description: 'New Year Party', category: 'Miscellaneous', amount: 2000.00, type: 'expense' },
  { id: '2', date: '2026-01-04', description: 'Tech Corp Salary', category: 'Income', amount: 5200.00, type: 'income' },
  { id: '3', date: '2026-01-10', description: 'Shell Station', category: 'Transport', amount: 45.00, type: 'expense' },
  
  // February 2026
  { id: '4', date: '2026-02-02', description: 'Birthday Gift', category: 'Shopping', amount: 500.00, type: 'expense' },
  { id: '5', date: '2026-02-02', description: 'Salary', category: 'Income', amount: 4000.00, type: 'income' },
  { id: '6', date: '2026-02-04', description: 'Uber Rides', category: 'Transport', amount: 24.50, type: 'expense' },
  { id: '7', date: '2026-02-11', description: 'Clothes', category: 'Shopping', amount: 10.00, type: 'expense' },
  { id: '8', date: '2026-02-12', description: 'Internet Bill', category: 'Miscellaneous', amount: 5.00, type: 'expense' },
  { id: '9', date: '2026-02-18', description: 'Dividend Payment', category: 'Income', amount: 120.50, type: 'income' },
  
  // March 2026
  { id: '10', date: '2026-03-03', description: 'Birthday Present', category: 'Shopping', amount: 10.00, type: 'expense' },
  { id: '11', date: '2026-03-05', description: 'Salary', category: 'Income', amount: 3000.00, type: 'income' },
  { id: '12', date: '2026-03-30', description: 'Whole Foods', category: 'Groceries', amount: 145.20, type: 'expense' },
  
  // April 2026
  { id: '13', date: '2026-04-01', description: 'Gym Membership', category: 'Health', amount: 60.00, type: 'expense' },
  { id: '14', date: '2026-04-03', description: 'Salary', category: 'Income', amount: 6000.00, type: 'income' },
  { id: '15', date: '2026-04-03', description: 'Medical Expense', category: 'Health', amount: 1000.00, type: 'expense' },
  
  // May 2026
  { id: '16', date: '2026-05-02', description: 'Salary', category: 'Income', amount: 3000.00, type: 'income' },
  { id: '17', date: '2026-05-22', description: 'Monthly Rent', category: 'Housing', amount: 1800.00, type: 'expense' },
  
  // June 2026
  { id: '18', date: '2026-06-02', description: 'Gift Money', category: 'Income', amount: 2000.00, type: 'income' },
  { id: '19', date: '2026-06-18', description: 'Dress', category: 'Shopping', amount: 1000.00, type: 'expense' },
  
  // April 2024 (Historical Data)
  { id: '20', date: '2024-04-01', description: 'Tech Corp Salary', category: 'Income', amount: 5200.00, type: 'income' },
  { id: '21', date: '2024-04-02', description: 'Whole Foods', category: 'Groceries', amount: 145.20, type: 'expense' },
  { id: '22', date: '2024-04-03', description: 'Uber Rides', category: 'Transport', amount: 24.50, type: 'expense' },
  { id: '23', date: '2024-04-05', description: 'Monthly Rent', category: 'Housing', amount: 1800.00, type: 'expense' },
  { id: '24', date: '2024-04-08', description: 'Netflix Subscription', category: 'Entertainment', amount: 15.99, type: 'expense' },
  { id: '25', date: '2024-04-10', description: 'Client Freelance Work', category: 'Income', amount: 850.00, type: 'income' },
  { id: '26', date: '2024-04-12', description: 'Shell Station', category: 'Transport', amount: 45.00, type: 'expense' },
  { id: '27', date: '2024-04-15', description: 'Gym Membership', category: 'Health', amount: 60.00, type: 'expense' },
  { id: '28', date: '2024-04-18', description: 'Amazon Purchases', category: 'Shopping', amount: 112.30, type: 'expense' },
  { id: '29', date: '2024-04-20', description: 'Starbucks', category: 'Dining', amount: 8.50, type: 'expense' },
  { id: '30', date: '2024-04-22', description: 'Dinner with Friends', category: 'Dining', amount: 75.00, type: 'expense' },
  { id: '31', date: '2024-04-25', description: 'Dividend Payment', category: 'Income', amount: 120.50, type: 'income' },
];

export const chartData = [
  { month: 'Jan', balance: 12400 },
  { month: 'Feb', balance: 13200 },
  { month: 'Mar', balance: 12800 },
  { month: 'Apr', balance: 14500 },
  { month: 'May', balance: 15100 },
  { month: 'Jun', balance: 14900 },
  { month: 'Jul', balance: 16200 },
  { month: 'Aug', balance: 17500 },
  { month: 'Sep', balance: 17100 },
  { month: 'Oct', balance: 18400 },
  { month: 'Nov', balance: 19200 },
  { month: 'Dec', balance: 20500 },
];

export const spendingData = [
  { name: 'Housing', value: 1800, color: '#3b82f6' },
  { name: 'Groceries', value: 450, color: '#10b981' },
  { name: 'Dining', value: 320, color: '#f59e0b' },
  { name: 'Transport', value: 210, color: '#8b5cf6' },
  { name: 'Entertainment', value: 150, color: '#ef4444' },
];

export const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(amount);
};
