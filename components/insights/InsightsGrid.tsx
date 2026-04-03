'use client';

import { InsightCard } from './InsightCard';
import { 
  TrendingUp, 
  TrendingDown, 
  PiggyBank, 
  CalendarDays, 
  Flame, 
  AlertCircle,
  Activity
} from 'lucide-react';
import { formatCurrency } from '@/lib/mock-data';
import { useGlobalTransactions } from '@/context/TransactionContext';

export function InsightsGrid() {
  const { data } = useGlobalTransactions();

  // Filter basic types
  const expenses = data.filter(t => t.type === 'expense');
  const incomes = data.filter(t => t.type === 'income');
  const totalExpenses = expenses.reduce((acc, t) => acc + t.amount, 0);
  const totalIncome = incomes.reduce((acc, t) => acc + t.amount, 0);

  // 1. Highest Spending Category
  const categoryMap = new Map<string, number>();
  expenses.forEach(t => categoryMap.set(t.category, (categoryMap.get(t.category) || 0) + t.amount));
  let topCategory = 'None';
  let topCategoryAmount = 0;
  categoryMap.forEach((amount, cat) => {
    if (amount > topCategoryAmount) {
      topCategory = cat;
      topCategoryAmount = amount;
    }
  });
  const topCategoryPercentage = totalExpenses > 0 ? Math.round((topCategoryAmount / totalExpenses) * 100) : 0;

  // 2. Biggest Single Expense
  let biggestExpense = expenses.length > 0 ? expenses[0] : null;
  expenses.forEach(t => {
    if (t.amount > (biggestExpense?.amount || 0)) biggestExpense = t;
  });

  // 3. Savings Rate
  const savingsRate = totalIncome > 0 ? ((totalIncome - totalExpenses) / totalIncome) * 100 : 0;

  // 4. Most Active Spending Day
  const dayName = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  const dayCounts = [0, 0, 0, 0, 0, 0, 0];
  expenses.forEach(t => {
    const d = new Date(t.date).getDay();
    dayCounts[d]++;
  });
  let topDayIndex = 0;
  dayCounts.forEach((count, idx) => {
    if (count > dayCounts[topDayIndex]) topDayIndex = idx;
  });
  const topDayName = expenses.length > 0 ? dayName[topDayIndex] : 'None';
  const topDayPercentage = expenses.length > 0 ? Math.round((dayCounts[topDayIndex] / expenses.length) * 100) : 0;

  // 5. Monthly Comparison
  let latestDate = new Date(0);
  expenses.forEach(t => { 
    const d = new Date(t.date); 
    if (d > latestDate) latestDate = d; 
  });
  const currentMonthIdx = latestDate.getMonth();
  const currentYear = latestDate.getFullYear();
  
  let currentMonthExpenses = 0;
  let previousMonthExpenses = 0;
  
  expenses.forEach(t => {
    const d = new Date(t.date);
    if (d.getFullYear() === currentYear) {
      if (d.getMonth() === currentMonthIdx) currentMonthExpenses += t.amount;
      else if (d.getMonth() === currentMonthIdx - 1) previousMonthExpenses += t.amount;
    } else if (d.getFullYear() === currentYear - 1 && currentMonthIdx === 0 && d.getMonth() === 11) {
      previousMonthExpenses += t.amount;
    }
  });

  let monthlyChange = 0;
  if (previousMonthExpenses > 0) {
    monthlyChange = ((currentMonthExpenses - previousMonthExpenses) / previousMonthExpenses) * 100;
  }
  
  const monthlyComparisonStr = previousMonthExpenses === 0 
    ? 'N/A' 
    : monthlyChange > 0 
      ? `+${monthlyChange.toFixed(1)}%` 
      : `${monthlyChange.toFixed(1)}%`;
      
  const monthlyComparisonDesc = previousMonthExpenses === 0
    ? 'Need at least two months of data to compare.'
    : monthlyChange > 0
      ? 'You spent more this month compared to last month.'
      : 'You spent less this month compared to last month. Great job!';

  const insights = [
    {
      title: 'Highest Spending Category',
      value: topCategory,
      description: expenses.length > 0 ? `Accounts for ${topCategoryPercentage}% of your total expenses.` : 'No expenses recorded yet.',
      icon: TrendingDown,
      colorClass: 'bg-rose-500/10 text-rose-500 [&>svg]:text-rose-500',
    },
    {
      title: 'Monthly Comparison',
      value: monthlyComparisonStr,
      description: monthlyComparisonDesc,
      icon: monthlyChange > 0 ? Activity : TrendingUp,
      colorClass: monthlyChange > 0 ? 'bg-orange-500/10 text-orange-500 [&>svg]:text-orange-500' : 'bg-emerald-500/10 text-emerald-500 [&>svg]:text-emerald-500',
    },
    {
      title: 'Biggest Single Expense',
      value: biggestExpense ? formatCurrency(biggestExpense.amount) : '$0.00',
      description: biggestExpense 
        ? `${biggestExpense.description} on ${new Date(biggestExpense.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}.` 
        : 'No expenses yet.',
      icon: AlertCircle,
      colorClass: 'bg-orange-500/10 text-orange-500 [&>svg]:text-orange-500',
    },
    {
      title: 'Savings Rate',
      value: `${savingsRate.toFixed(1)}%`,
      description: savingsRate > 20 ? 'You are saving more than the recommended 20%.' : 'Consider finding areas to cut costs to reach 20%.',
      icon: PiggyBank,
      colorClass: 'bg-blue-500/10 text-blue-500 [&>svg]:text-blue-500',
    },
    {
      title: 'Most Active Spending Day',
      value: topDayName,
      description: expenses.length > 0 ? `You make ${topDayPercentage}% of your transactions on ${topDayName}s.` : 'Insufficient data.',
      icon: CalendarDays,
      colorClass: 'bg-purple-500/10 text-purple-500 [&>svg]:text-purple-500',
    }
  ];
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
      {insights.map((insight) => (
        <InsightCard key={insight.title} {...insight} />
      ))}
    </div>
  );
}
