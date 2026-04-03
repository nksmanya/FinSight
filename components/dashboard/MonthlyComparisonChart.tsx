'use client';

import { useMemo, useState } from 'react';
import { Bar, BarChart, Cell, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useGlobalTransactions } from '@/context/TransactionContext';
import { formatCurrency } from '@/lib/mock-data';

function ThemedTooltip({ active, payload, label }: { active?: boolean; payload?: any[]; label?: string }) {
  if (!active || !payload || payload.length === 0) {
    return null;
  }

  return (
    <div className="rounded-xl border border-border/60 bg-card/95 backdrop-blur-md px-3 py-2 shadow-xl">
      {label ? <p className="text-xs text-muted-foreground mb-1">{label}</p> : null}
      <div className="space-y-1">
        {payload.map((item) => (
          <div key={`${item.name}-${item.value}`} className="flex items-center justify-between gap-4 text-sm">
            <span className="font-medium" style={{ color: item.color || 'currentColor' }}>
              {item.name}
            </span>
            <span className="font-semibold text-foreground">
              {formatCurrency(Number(item.value ?? 0))}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

export function MonthlyComparisonChart() {
  const { data } = useGlobalTransactions();
  const [activeMonth, setActiveMonth] = useState<string | null>(null);

  const monthlyComparison = useMemo(() => {
    const monthMap = new Map<string, { income: number; expense: number }>();

    data.forEach((t) => {
      const date = new Date(t.date);
      const key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
      const current = monthMap.get(key) || { income: 0, expense: 0 };

      if (t.type === 'income') current.income += t.amount;
      else current.expense += t.amount;

      monthMap.set(key, current);
    });

    return Array.from(monthMap.entries())
      .sort((a, b) => a[0].localeCompare(b[0]))
      .slice(-8)
      .map(([key, values]) => {
        const [year, month] = key.split('-');
        const labelDate = new Date(Number(year), Number(month) - 1, 1);
        return {
          month: labelDate.toLocaleDateString('en-US', { month: 'short', year: '2-digit' }),
          income: values.income,
          expense: values.expense,
        };
      });
  }, [data]);

  return (
    <Card className="border-border/70 shadow-sm bg-gradient-to-b from-card to-card/90">
      <CardHeader>
        <CardTitle>Monthly Comparison</CardTitle>
        <CardDescription>Income vs expenses across recent months.</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="h-80 w-full">
          {monthlyComparison.length === 0 ? (
            <div className="h-full flex items-center justify-center text-sm text-muted-foreground">
              No monthly data available yet.
            </div>
          ) : (
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={monthlyComparison}
                margin={{ top: 8, right: 12, left: 0, bottom: 8 }}
                barCategoryGap="28%"
                onMouseMove={(state) => {
                  const label = state?.activeLabel;
                  setActiveMonth(typeof label === 'string' ? label : null);
                }}
                onMouseLeave={() => setActiveMonth(null)}
              >
                <XAxis dataKey="month" axisLine={false} tickLine={false} fontSize={12} stroke="#888888" />
                <YAxis
                  axisLine={false}
                  tickLine={false}
                  fontSize={12}
                  stroke="#888888"
                  tickFormatter={(value) => `$${Number(value).toLocaleString()}`}
                />
                <Tooltip content={<ThemedTooltip />} cursor={false} />
                <Bar
                  dataKey="income"
                  name="Income"
                  fill="#10b981"
                  radius={[6, 6, 0, 0]}
                  isAnimationActive
                  animationBegin={80}
                  animationDuration={850}
                  animationEasing="ease-out"
                  activeBar={{ stroke: '#10b981', strokeOpacity: 0.35, strokeWidth: 2 }}
                >
                  {monthlyComparison.map((entry) => (
                    <Cell
                      key={`income-${entry.month}`}
                      fillOpacity={activeMonth && activeMonth !== entry.month ? 0.35 : 1}
                      style={{ transition: 'fill-opacity 220ms ease' }}
                    />
                  ))}
                </Bar>
                <Bar
                  dataKey="expense"
                  name="Expense"
                  fill="#ef4444"
                  radius={[6, 6, 0, 0]}
                  isAnimationActive
                  animationBegin={220}
                  animationDuration={900}
                  animationEasing="ease-out"
                  activeBar={{ stroke: '#ef4444', strokeOpacity: 0.35, strokeWidth: 2 }}
                >
                  {monthlyComparison.map((entry) => (
                    <Cell
                      key={`expense-${entry.month}`}
                      fillOpacity={activeMonth && activeMonth !== entry.month ? 0.35 : 1}
                      style={{ transition: 'fill-opacity 220ms ease' }}
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
