'use client';

import { useGlobalTransactions } from '@/context/TransactionContext';
import { formatCurrency } from '@/lib/mock-data';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
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

  const statItems = [
    {
      label: 'Transactions Analyzed',
      value: String(data.length),
      helper: 'Across all recorded periods',
      icon: Activity,
      accent: 'bg-sky-500/10 text-sky-600',
    },
    {
      label: 'Latest Month Spend',
      value: formatCurrency(currentMonthExpenses),
      helper: `Reference month: ${monthlyLabel}`,
      icon: BarChart3,
      accent: 'bg-amber-500/10 text-amber-600',
    },
    {
      label: 'Net Position',
      value: formatCurrency(netPosition),
      helper: netPosition >= 0 ? 'Positive overall balance' : 'Negative overall balance',
      icon: Wallet,
      accent: netPosition >= 0 ? 'bg-emerald-500/10 text-emerald-600' : 'bg-rose-500/10 text-rose-600',
    },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, ease: 'easeOut' }}
    >
      <Card className="relative overflow-hidden border-border/70 shadow-sm">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(59,130,246,0.16),transparent_55%)]" />
      <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-sky-500/50 to-transparent" />
      <CardHeader className="relative pb-2">
        <div className="flex items-center justify-between gap-3">
          <CardTitle className="text-base md:text-lg">Financial Pulse</CardTitle>
          <Badge variant="outline" className="text-xs bg-background/70 backdrop-blur-sm">Live from your transaction history</Badge>
        </div>
      </CardHeader>
      <CardContent className="relative grid grid-cols-1 md:grid-cols-3 gap-3 md:gap-4">
        {statItems.map((item, index) => (
          <motion.div
            key={item.label}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.08 * index + 0.1, duration: 0.28 }}
            className="group rounded-lg border bg-background/70 p-3 md:p-4 backdrop-blur-sm hover:border-primary/30 transition-colors"
          >
            <div className="flex items-center justify-between gap-2">
              <p className="text-xs text-muted-foreground">{item.label}</p>
              <span className={`inline-flex h-7 w-7 items-center justify-center rounded-md ${item.accent}`}>
                <item.icon className="h-3.5 w-3.5" />
              </span>
            </div>
            <p className="text-2xl font-bold tracking-tight mt-2">{item.value}</p>
            <p className="text-xs text-muted-foreground mt-1">{item.helper}</p>
            <div className="mt-3 h-1 overflow-hidden rounded-full bg-muted">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: '100%' }}
                transition={{ delay: 0.12 * index + 0.2, duration: 0.45 }}
                className="h-full bg-gradient-to-r from-sky-500/70 to-transparent"
              />
            </div>
          </motion.div>
        ))}
      </CardContent>
    </Card>
    </motion.div>
  );
}
