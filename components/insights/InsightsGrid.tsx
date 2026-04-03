'use client';

import { InsightCard } from './InsightCard';
import { 
  TrendingUp, 
  TrendingDown, 
  PiggyBank, 
  CalendarDays, 
  Wallet,
  AlertCircle,
  Activity,
  Clock3,
  BadgeDollarSign,
} from 'lucide-react';
import { formatCurrency } from '@/lib/mock-data';
import { useGlobalTransactions } from '@/context/TransactionContext';

export function InsightsGrid() {
  const { data } = useGlobalTransactions();

  if (data.length === 0) {
    return (
      <div className="rounded-xl border bg-card p-8 text-center">
        <h2 className="text-lg font-semibold">No insights yet</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          Add a few income and expense transactions to unlock spending patterns and monthly trends.
        </p>
      </div>
    );
  }

  // Filter basic types
  const expenses = data.filter((t) => t.type === 'expense');
  const incomes = data.filter((t) => t.type === 'income');
  const totalExpenses = expenses.reduce((acc, t) => acc + t.amount, 0);
  const totalIncome = incomes.reduce((acc, t) => acc + t.amount, 0);

  // 1. Highest Spending Category
  const categoryMap = new Map<string, number>();
  expenses.forEach((t) => categoryMap.set(t.category, (categoryMap.get(t.category) || 0) + t.amount));
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
  expenses.forEach((t) => {
    if (t.amount > (biggestExpense?.amount || 0)) biggestExpense = t;
  });

  // 3. Savings Rate
  const savingsRate = totalIncome > 0 ? ((totalIncome - totalExpenses) / totalIncome) * 100 : 0;

  // 4. Most Active Spending Day
  const dayName = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  const dayCounts = [0, 0, 0, 0, 0, 0, 0];
  expenses.forEach((t) => {
    const d = new Date(t.date).getDay();
    dayCounts[d]++;
  });
  let topDayIndex = 0;
  dayCounts.forEach((count, idx) => {
    if (count > dayCounts[topDayIndex]) topDayIndex = idx;
  });
  const topDayName = expenses.length > 0 ? dayName[topDayIndex] : 'None';
  const topDayPercentage = expenses.length > 0 ? Math.round((dayCounts[topDayIndex] / expenses.length) * 100) : 0;

  // 5. Monthly Comparison (based on most recent month present in data)
  let latestDate = new Date(0);
  data.forEach((t) => {
    const d = new Date(t.date);
    if (d > latestDate) latestDate = d;
  });
  const currentMonthIdx = latestDate.getMonth();
  const currentYear = latestDate.getFullYear();
  
  let currentMonthExpenses = 0;
  let previousMonthExpenses = 0;
  let currentMonthIncome = 0;

  data.forEach((t) => {
    const d = new Date(t.date);
    const isCurrentMonth = d.getFullYear() === currentYear && d.getMonth() === currentMonthIdx;
    const isPreviousMonthSameYear = d.getFullYear() === currentYear && d.getMonth() === currentMonthIdx - 1;
    const isPreviousMonthCrossYear = d.getFullYear() === currentYear - 1 && currentMonthIdx === 0 && d.getMonth() === 11;
  
    if (t.type === 'expense') {
      if (isCurrentMonth) currentMonthExpenses += t.amount;
      else if (isPreviousMonthSameYear || isPreviousMonthCrossYear) previousMonthExpenses += t.amount;
    }

    if (t.type === 'income' && isCurrentMonth) {
      currentMonthIncome += t.amount;
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

  // 6. Income Coverage (Current Month)
  const incomeCoverage = currentMonthExpenses > 0
    ? (currentMonthIncome / currentMonthExpenses) * 100
    : 0;
  const incomeCoverageDesc = currentMonthExpenses === 0
    ? 'No expenses recorded for the latest month in your data.'
    : incomeCoverage >= 100
      ? 'Income fully covers this month\'s expenses.'
      : 'Income does not fully cover this month\'s expenses.';

  // 7. Daily Burn Rate (Current Month)
  const daysWithExpenseEntries = new Set(
    expenses
      .filter((t) => {
        const d = new Date(t.date);
        return d.getFullYear() === currentYear && d.getMonth() === currentMonthIdx;
      })
      .map((t) => new Date(t.date).toISOString().split('T')[0])
  ).size;

  const dailyBurnRate = daysWithExpenseEntries > 0 ? currentMonthExpenses / daysWithExpenseEntries : 0;

  const monthlyLabel = latestDate.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });

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
      title: 'Income Coverage',
      value: currentMonthExpenses > 0 ? `${incomeCoverage.toFixed(0)}%` : 'N/A',
      description: `${incomeCoverageDesc} (${monthlyLabel})`,
      icon: BadgeDollarSign,
      colorClass: incomeCoverage >= 100
        ? 'bg-emerald-500/10 text-emerald-500 [&>svg]:text-emerald-500'
        : 'bg-amber-500/10 text-amber-500 [&>svg]:text-amber-500',
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
      value: totalIncome > 0 ? `${savingsRate.toFixed(1)}%` : 'N/A',
      description: totalIncome > 0
        ? savingsRate > 20
          ? 'You are saving more than the recommended 20%.'
          : 'Consider finding areas to cut costs to reach 20%.'
        : 'Add income entries to calculate savings rate.',
      icon: PiggyBank,
      colorClass: 'bg-blue-500/10 text-blue-500 [&>svg]:text-blue-500',
    },
    {
      title: 'Average Daily Spend',
      value: daysWithExpenseEntries > 0 ? formatCurrency(dailyBurnRate) : 'N/A',
      description: daysWithExpenseEntries > 0
        ? `Average on active spending days in ${monthlyLabel}.`
        : `No expense activity in ${monthlyLabel}.`,
      icon: Clock3,
      colorClass: 'bg-cyan-500/10 text-cyan-500 [&>svg]:text-cyan-500',
    },
    {
      title: 'Most Active Spending Day',
      value: topDayName,
      description: expenses.length > 0 ? `You make ${topDayPercentage}% of your transactions on ${topDayName}s.` : 'Insufficient data.',
      icon: CalendarDays,
      colorClass: 'bg-violet-500/10 text-violet-500 [&>svg]:text-violet-500',
    },
    {
      title: 'Net Position',
      value: formatCurrency(totalIncome - totalExpenses),
      description: totalIncome >= totalExpenses
        ? 'You are net positive across recorded transactions.'
        : 'Expenses currently exceed income in recorded transactions.',
      icon: Wallet,
      colorClass: totalIncome >= totalExpenses
        ? 'bg-emerald-500/10 text-emerald-500 [&>svg]:text-emerald-500'
        : 'bg-rose-500/10 text-rose-500 [&>svg]:text-rose-500',
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
