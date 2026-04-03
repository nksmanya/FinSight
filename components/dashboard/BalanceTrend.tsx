'use client';

import { useMemo, useState } from 'react';
import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useGlobalTransactions } from '@/context/TransactionContext';

type RangeKey = '3M' | '6M' | '1Y';

const RANGE_MONTHS: Record<RangeKey, number> = {
  '3M': 3,
  '6M': 6,
  '1Y': 12,
};

function formatAxisValue(value: number) {
  if (value >= 1000) {
    return `$${(value / 1000).toFixed(0)}k`;
  }
  return `$${value}`;
}

export function BalanceTrend() {
  const { data } = useGlobalTransactions();
  const [range, setRange] = useState<RangeKey>('6M');

  const monthlySeries = useMemo(() => {
    const latestDate = data.reduce((max, txn) => {
      const d = new Date(txn.date);
      return d > max ? d : max;
    }, new Date());

    const baseMonth = new Date(latestDate.getFullYear(), latestDate.getMonth(), 1);

    const monthEntries = Array.from({ length: 12 }, (_, idx) => {
      const d = new Date(baseMonth.getFullYear(), baseMonth.getMonth() - (11 - idx), 1);
      const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
      return {
        key,
        month: d.toLocaleDateString('en-US', { month: 'short' }),
        monthLabel: d.toLocaleDateString('en-US', { month: 'short', year: '2-digit' }),
        income: 0,
        expense: 0,
      };
    });

    const monthMap = new Map(monthEntries.map((m) => [m.key, m]));

    data.forEach((txn) => {
      const d = new Date(txn.date);
      const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
      const target = monthMap.get(key);
      if (!target) return;

      if (txn.type === 'income') target.income += txn.amount;
      else target.expense += txn.amount;
    });

    return monthEntries;
  }, [data]);

  const displayData = useMemo(() => {
    return monthlySeries.slice(-RANGE_MONTHS[range]);
  }, [monthlySeries, range]);

  const rangeIncome = displayData.reduce((sum, item) => sum + item.income, 0);
  const rangeExpense = displayData.reduce((sum, item) => sum + item.expense, 0);

  return (
    <Card className="col-span-1 lg:col-span-2 border-border/70 shadow-sm bg-gradient-to-b from-card to-card/90">
      <CardHeader className="pb-2">
        <div className="flex items-start justify-between gap-4 flex-wrap">
          <div>
            <CardTitle>Balance Trend</CardTitle>
            <CardDescription>Monthly income vs expenses</CardDescription>
          </div>

          <div className="flex items-center gap-2 rounded-lg border border-border/60 bg-background/60 p-1">
            {(Object.keys(RANGE_MONTHS) as RangeKey[]).map((option) => {
              const isActive = range === option;
              return (
                <button
                  key={option}
                  type="button"
                  onClick={() => setRange(option)}
                  className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-all ${
                    isActive
                      ? 'bg-emerald-500/15 text-emerald-400 ring-1 ring-emerald-500/30'
                      : 'text-muted-foreground hover:text-foreground hover:bg-muted/60'
                  }`}
                >
                  {option}
                </button>
              );
            })}
          </div>
        </div>
      </CardHeader>

      <CardContent>
        <div className="h-[320px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart
              key={`range-${range}`}
              data={displayData}
              margin={{ top: 10, right: 8, left: 0, bottom: 0 }}
            >
              <defs>
                <linearGradient id="incomeGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#10b981" stopOpacity={0.2} />
                  <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="expenseGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#f43f5e" stopOpacity={0.18} />
                  <stop offset="95%" stopColor="#f43f5e" stopOpacity={0} />
                </linearGradient>
              </defs>

              <CartesianGrid strokeDasharray="4 4" stroke="rgba(148,163,184,0.16)" />

              <XAxis
                dataKey="month"
                stroke="#6b7280"
                fontSize={12}
                tickLine={false}
                axisLine={false}
              />
              <YAxis
                stroke="#6b7280"
                fontSize={12}
                tickLine={false}
                axisLine={false}
                tickFormatter={(value) => formatAxisValue(Number(value))}
              />

              <Tooltip
                cursor={false}
                content={({ active, payload, label }) => {
                  if (!active || !payload || payload.length === 0) return null;
                  return (
                    <div className="rounded-xl border border-border/60 bg-card/95 backdrop-blur-md px-3 py-2 shadow-xl">
                      <p className="text-xs text-muted-foreground mb-1">{label}</p>
                      <div className="space-y-1 text-sm">
                        <div className="flex items-center justify-between gap-6">
                          <span className="font-medium text-emerald-400">Income</span>
                          <span className="font-semibold text-foreground">
                            ${Number(payload[0]?.value || 0).toLocaleString()}
                          </span>
                        </div>
                        <div className="flex items-center justify-between gap-6">
                          <span className="font-medium text-rose-400">Expense</span>
                          <span className="font-semibold text-foreground">
                            ${Number(payload[1]?.value || 0).toLocaleString()}
                          </span>
                        </div>
                      </div>
                    </div>
                  );
                }}
              />

              <Area
                type="monotone"
                dataKey="income"
                stroke="#00e0a4"
                strokeWidth={3}
                fill="url(#incomeGradient)"
                fillOpacity={1}
                isAnimationActive
                animationBegin={80}
                animationDuration={600}
                animationEasing="ease-out"
                activeDot={{ r: 4, fill: '#00e0a4' }}
              />

              <Area
                type="monotone"
                dataKey="expense"
                stroke="#ff4f75"
                strokeWidth={3}
                fill="url(#expenseGradient)"
                fillOpacity={1}
                isAnimationActive
                animationBegin={180}
                animationDuration={650}
                animationEasing="ease-out"
                activeDot={{ r: 4, fill: '#ff4f75' }}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div className="rounded-lg border bg-background/70 px-3 py-2">
            <p className="text-xs text-muted-foreground">Income ({range})</p>
            <p className="text-sm font-semibold text-emerald-400">${rangeIncome.toLocaleString()}</p>
          </div>
          <div className="rounded-lg border bg-background/70 px-3 py-2">
            <p className="text-xs text-muted-foreground">Expense ({range})</p>
            <p className="text-sm font-semibold text-rose-400">${rangeExpense.toLocaleString()}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
