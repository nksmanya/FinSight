'use client';

import { useGlobalTransactions } from '@/context/TransactionContext';
import { formatCurrency } from '@/lib/mock-data';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

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

  return (
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
  );
}
