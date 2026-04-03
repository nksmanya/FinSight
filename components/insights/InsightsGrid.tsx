'use client';

import { 
  TrendingUp, 
  TrendingDown, 
  PiggyBank,
  CalendarDays, 
  Sparkles,
  CircleAlert,
} from 'lucide-react';
import { formatCurrency } from '@/lib/mock-data';
import { useGlobalTransactions } from '@/context/TransactionContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

type SignalTone = 'good' | 'watch' | 'risk';

interface Signal {
  title: string;
  percent: number;
  valueLabel: string;
  tone: SignalTone;
  note: string;
}

function getToneClasses(tone: SignalTone) {
  if (tone === 'good') {
    return {
      badge: 'bg-emerald-500/10 text-emerald-600 border-emerald-500/30',
      bar: 'bg-emerald-500',
      label: 'Healthy',
    };
  }

  if (tone === 'watch') {
    return {
      badge: 'bg-amber-500/10 text-amber-600 border-amber-500/30',
      bar: 'bg-amber-500',
      label: 'Watch',
    };
  }

  return {
    badge: 'bg-rose-500/10 text-rose-600 border-rose-500/30',
    bar: 'bg-rose-500',
    label: 'Risk',
  };
}

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
  const netPosition = totalIncome - totalExpenses;

  const expenseRatio = totalIncome > 0 ? (totalExpenses / totalIncome) * 100 : 0;
  const coveragePercent = currentMonthExpenses > 0 ? Math.min(200, incomeCoverage) : 0;
  const savingsPercentNormalized = totalIncome > 0 ? Math.min(100, Math.max(0, savingsRate)) : 0;

  const signals: Signal[] = [
    {
      title: 'Category Concentration',
      percent: topCategoryPercentage,
      valueLabel: `${topCategoryPercentage}%`,
      tone: topCategoryPercentage >= 40 ? 'risk' : topCategoryPercentage >= 25 ? 'watch' : 'good',
      note: expenses.length > 0
        ? `${topCategory} is your largest expense bucket.`
        : 'Add expense entries to detect concentration.',
    },
    {
      title: 'Income Coverage',
      percent: Math.min(100, coveragePercent),
      valueLabel: currentMonthExpenses > 0 ? `${incomeCoverage.toFixed(0)}%` : 'N/A',
      tone: currentMonthExpenses === 0 ? 'watch' : incomeCoverage >= 100 ? 'good' : 'risk',
      note: `${incomeCoverageDesc} (${monthlyLabel})`,
    },
    {
      title: 'Savings Strength',
      percent: savingsPercentNormalized,
      valueLabel: totalIncome > 0 ? `${savingsRate.toFixed(1)}%` : 'N/A',
      tone: totalIncome === 0 ? 'watch' : savingsRate >= 20 ? 'good' : 'risk',
      note: totalIncome > 0
        ? 'Benchmark target is 20%+ savings rate.'
        : 'Add income entries to measure savings strength.',
    },
    {
      title: 'Expense Pressure',
      percent: Math.min(100, expenseRatio),
      valueLabel: totalIncome > 0 ? `${expenseRatio.toFixed(0)}%` : 'N/A',
      tone: totalIncome === 0 ? 'watch' : expenseRatio > 90 ? 'risk' : expenseRatio > 70 ? 'watch' : 'good',
      note: totalIncome > 0
        ? 'Lower expense pressure leaves more room to save.'
        : 'Add income entries to unlock this signal.',
    },
  ];

  const usefulObservation =
    topCategoryPercentage >= 45
      ? `${topCategory} dominates spending. A small reduction here can create the biggest improvement.`
      : monthlyChange > 10
        ? 'Monthly spending is accelerating. Review recent variable expenses before month-end.'
        : netPosition >= 0
          ? 'Your overall net position is positive. Focus on consistency to keep momentum.'
          : 'Expenses are outpacing income. Prioritize high-impact cuts in top categories.';

  return (
    <div className="space-y-6">
      <Card className="relative overflow-hidden border-border/70">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(59,130,246,0.12),transparent_55%)]" />
        <CardHeader className="relative pb-1">
          <div className="flex items-center justify-between gap-3">
            <CardTitle className="text-base">Financial Pulse</CardTitle>
            <Badge variant="outline" className="text-xs">Live from your transaction history</Badge>
          </div>
        </CardHeader>
        <CardContent className="relative grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <p className="text-xs text-muted-foreground">Transactions Analyzed</p>
            <p className="text-2xl font-bold tracking-tight mt-1">{data.length}</p>
            <p className="text-xs text-muted-foreground mt-1">Across all recorded periods</p>
          </div>

          <div>
            <p className="text-xs text-muted-foreground">Latest Month Spend</p>
            <p className="text-2xl font-bold tracking-tight mt-1">{formatCurrency(currentMonthExpenses)}</p>
            <p className="text-xs text-muted-foreground mt-1">Reference month: {monthlyLabel}</p>
          </div>

          <div>
            <p className="text-xs text-muted-foreground">Net Position</p>
            <p className="text-2xl font-bold tracking-tight mt-1">{formatCurrency(netPosition)}</p>
            <p className="text-xs text-muted-foreground mt-1">
              {netPosition >= 0 ? 'Positive overall balance' : 'Negative overall balance'}
            </p>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        <Card className="lg:col-span-3 border-border/70">
          <CardHeader className="pb-2">
            <CardTitle className="text-base">Insight Radar</CardTitle>
            <p className="text-sm text-muted-foreground">A compact view of your strongest and weakest financial signals.</p>
          </CardHeader>
          <CardContent className="space-y-4">
            {signals.map((signal) => {
              const tone = getToneClasses(signal.tone);
              return (
                <div key={signal.title} className="space-y-2">
                  <div className="flex items-center justify-between gap-3">
                    <p className="text-sm font-medium">{signal.title}</p>
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-semibold">{signal.valueLabel}</span>
                      <Badge variant="outline" className={tone.badge}>{tone.label}</Badge>
                    </div>
                  </div>
                  <div className="h-2 rounded-full bg-muted overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all ${tone.bar}`}
                      style={{ width: `${Math.min(100, Math.max(0, signal.percent))}%` }}
                    />
                  </div>
                  <p className="text-xs text-muted-foreground">{signal.note}</p>
                </div>
              );
            })}
          </CardContent>
        </Card>

        <Card className="lg:col-span-2 border-border/70">
          <CardHeader className="pb-2">
            <CardTitle className="text-base">Action Board</CardTitle>
            <p className="text-sm text-muted-foreground">Three key insights you can act on immediately.</p>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="rounded-lg border p-3 bg-muted/30">
              <p className="text-xs text-muted-foreground">Highest Spending Category</p>
              <p className="text-base font-semibold mt-1">{topCategory}</p>
              <p className="text-xs text-muted-foreground mt-1">Represents {topCategoryPercentage}% of total expenses.</p>
            </div>

            <div className="rounded-lg border p-3 bg-muted/30">
              <p className="text-xs text-muted-foreground">Monthly Comparison</p>
              <p className="text-base font-semibold mt-1">{monthlyComparisonStr}</p>
              <p className="text-xs text-muted-foreground mt-1">{monthlyComparisonDesc}</p>
            </div>

            <div className="rounded-lg border p-3 bg-muted/30">
              <p className="text-xs text-muted-foreground">Useful Observation</p>
              <p className="text-sm mt-1 leading-relaxed">{usefulObservation}</p>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="rounded-xl border bg-card px-4 py-3">
        <p className="text-sm font-medium">Narrative Snapshot</p>
        <p className="text-sm text-muted-foreground mt-1">
          Largest category is <span className="font-semibold text-foreground">{topCategory}</span>, monthly trend is{' '}
          <span className="font-semibold text-foreground">{monthlyComparisonStr}</span>, and your average daily spend in {monthlyLabel} is{' '}
          <span className="font-semibold text-foreground">{daysWithExpenseEntries > 0 ? formatCurrency(dailyBurnRate) : 'N/A'}</span>.
        </p>
        {biggestExpense ? (
          <p className="text-xs text-muted-foreground mt-2">
            Biggest single transaction: {biggestExpense.description} ({formatCurrency(biggestExpense.amount)}).
          </p>
        ) : null}
      </div>
    </div>
  );
}
