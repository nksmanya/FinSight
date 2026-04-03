'use client';

import { useGlobalTransactions } from '@/context/TransactionContext';
import { formatCurrency } from '@/lib/mock-data';
import { getCategoryColorClass } from '@/lib/categories';
import { Card, CardContent } from '@/components/ui/card';
import { motion } from 'framer-motion';
import { Activity, BarChart3, Wallet } from 'lucide-react';

export function FinancialPulse() {
  const { data } = useGlobalTransactions();

  let totalIncome = 0;
  let totalExpenses = 0;
  let latestDate = new Date(0);

  data.forEach((t) => {
    if (t.type === 'income') totalIncome += t.amount;
    else totalExpenses += t.amount;

    const d = new Date(t.date);
    if (d > latestDate) latestDate = d;
  });

  const currentMonthIdx = latestDate.getMonth();
  const currentYear = latestDate.getFullYear();

  const currentMonthExpenses = data.reduce((sum, t) => {
    const d = new Date(t.date);
    const isCurrentMonth = d.getFullYear() === currentYear && d.getMonth() === currentMonthIdx;
    if (isCurrentMonth && t.type === 'expense') return sum + t.amount;
    return sum;
  }, 0);

  const monthlyLabel = latestDate.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
  const netPosition = totalIncome - totalExpenses;

  const categorySpendMap = new Map<string, number>();
  data.forEach((t) => {
    if (t.type !== 'expense') return;
    categorySpendMap.set(t.category, (categorySpendMap.get(t.category) || 0) + t.amount);
  });

  let highestCategory = 'N/A';
  let highestCategoryAmount = 0;
  categorySpendMap.forEach((amount, category) => {
    if (amount > highestCategoryAmount) {
      highestCategory = category;
      highestCategoryAmount = amount;
    }
  });

  const statItems = [
    {
      label: 'Highest Spending Category',
      value: highestCategory,
      helper: highestCategoryAmount > 0 ? formatCurrency(highestCategoryAmount) : 'No expense data yet',
      icon: Activity,
    },
    {
      label: 'Latest Month Spend',
      value: formatCurrency(currentMonthExpenses),
      helper: `Reference month: ${monthlyLabel}`,
      icon: BarChart3,
    },
    {
      label: 'Net Position',
      value: formatCurrency(netPosition),
      helper: netPosition >= 0 ? 'Positive overall balance' : 'Negative overall balance',
      icon: Wallet,
    },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, ease: 'easeOut' }}
      className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6"
    >
      {statItems.map((item, index) => (
        <Card
          key={item.label}
          className="overflow-hidden border-border/70 transition-all duration-200 hover:shadow-md"
        >
          <CardContent className="p-3 md:p-4">
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.08 * index + 0.1, duration: 0.28 }}
              className="space-y-3"
            >
              <div className="flex items-center justify-between gap-2">
                <p className="text-xs font-medium text-muted-foreground">{item.label}</p>
                <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-muted text-muted-foreground">
                  <item.icon className="h-4 w-4" />
                </span>
              </div>

              <div className="text-2xl md:text-3xl font-bold tracking-tight truncate" title={item.value}>
                {index === 0 ? (
                  <span style={{ color: '#3b82f6' }}>{item.value}</span>
                ) : index === 1 ? (
                  <span style={{ color: '#ef4444' }}>{item.value}</span>
                ) : index === 2 && netPosition >= 0 ? (
                  <span style={{ color: '#10b981' }}>{item.value}</span>
                ) : index === 2 && netPosition < 0 ? (
                  <span style={{ color: '#ef4444' }}>{item.value}</span>
                ) : (
                  <p>{item.value}</p>
                )}
              </div>

              <p className="text-xs text-muted-foreground">{item.helper}</p>
            </motion.div>
          </CardContent>
        </Card>
      ))}
    </motion.div>
  );
}
