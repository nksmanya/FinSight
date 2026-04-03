'use client';

import { useMemo } from 'react';
import {
  Bar,
  BarChart,
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import { useGlobalTransactions } from '@/context/TransactionContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { formatCurrency } from '@/lib/mock-data';

const CATEGORY_COLORS = [
  '#3b82f6',
  '#10b981',
  '#f59e0b',
  '#ef4444',
  '#14b8a6',
  '#8b5cf6',
  '#f97316',
  '#06b6d4',
  '#e11d48',
  '#22c55e',
];

export function InsightsCharts() {
  const { data } = useGlobalTransactions();

  const { categoryBreakdown, topCategories, monthlyComparison } = useMemo(() => {
    const expenses = data.filter((t) => t.type === 'expense');

    const categoryMap = new Map<string, number>();
    expenses.forEach((t) => {
      categoryMap.set(t.category, (categoryMap.get(t.category) || 0) + t.amount);
    });

    const categoryBreakdownData = Array.from(categoryMap.entries())
      .map(([category, amount]) => ({ category, amount }))
      .sort((a, b) => b.amount - a.amount);

    const topCategoriesData = categoryBreakdownData.slice(0, 5).map((item, index) => ({
      ...item,
      color: CATEGORY_COLORS[index % CATEGORY_COLORS.length],
    }));

    const monthMap = new Map<string, { income: number; expense: number }>();
    data.forEach((t) => {
      const date = new Date(t.date);
      const key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
      const current = monthMap.get(key) || { income: 0, expense: 0 };
      if (t.type === 'income') {
        current.income += t.amount;
      } else {
        current.expense += t.amount;
      }
      monthMap.set(key, current);
    });

    const monthlyData = Array.from(monthMap.entries())
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

    return {
      categoryBreakdown: categoryBreakdownData,
      topCategories: topCategoriesData,
      monthlyComparison: monthlyData,
    };
  }, [data]);

  return (
    <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
      <Card className="xl:col-span-2 border-border/70">
        <CardHeader>
          <CardTitle>Full Category Breakdown</CardTitle>
          <CardDescription>All spending categories ranked by total amount.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-80 w-full">
            {categoryBreakdown.length === 0 ? (
              <div className="h-full flex items-center justify-center text-sm text-muted-foreground">
                No expense data available yet.
              </div>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={categoryBreakdown}
                  layout="vertical"
                  margin={{ top: 8, right: 24, left: 24, bottom: 8 }}
                >
                  <XAxis
                    type="number"
                    tickFormatter={(value) => `$${Number(value).toLocaleString()}`}
                    axisLine={false}
                    tickLine={false}
                    fontSize={12}
                    stroke="#888888"
                  />
                  <YAxis
                    type="category"
                    dataKey="category"
                    width={120}
                    axisLine={false}
                    tickLine={false}
                    fontSize={12}
                    stroke="#888888"
                  />
                  <Tooltip
                    formatter={(value) => formatCurrency(Number(value ?? 0))}
                    cursor={{ fill: 'rgba(148, 163, 184, 0.12)' }}
                    contentStyle={{
                      borderRadius: '12px',
                      border: '1px solid rgba(148,163,184,0.25)',
                    }}
                  />
                  <Bar dataKey="amount" radius={[0, 8, 8, 0]} fill="#3b82f6" />
                </BarChart>
              </ResponsiveContainer>
            )}
          </div>
        </CardContent>
      </Card>

      <Card className="border-border/70">
        <CardHeader>
          <CardTitle>Top Expense Categories</CardTitle>
          <CardDescription>Where your money goes most often.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-56 w-full">
            {topCategories.length === 0 ? (
              <div className="h-full flex items-center justify-center text-sm text-muted-foreground">
                No expense data available yet.
              </div>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={topCategories}
                    dataKey="amount"
                    nameKey="category"
                    innerRadius={55}
                    outerRadius={85}
                    paddingAngle={3}
                    stroke="none"
                  >
                    {topCategories.map((entry) => (
                      <Cell key={entry.category} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value) => formatCurrency(Number(value ?? 0))} />
                </PieChart>
              </ResponsiveContainer>
            )}
          </div>

          {topCategories.length > 0 ? (
            <div className="mt-4 space-y-2">
              {topCategories.map((item) => (
                <div key={item.category} className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-2">
                    <span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: item.color }} />
                    <span className="text-muted-foreground">{item.category}</span>
                  </div>
                  <span className="font-medium">{formatCurrency(item.amount)}</span>
                </div>
              ))}
            </div>
          ) : null}
        </CardContent>
      </Card>

      <Card className="xl:col-span-3 border-border/70">
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
                <BarChart data={monthlyComparison} margin={{ top: 8, right: 12, left: 0, bottom: 8 }}>
                  <XAxis dataKey="month" axisLine={false} tickLine={false} fontSize={12} stroke="#888888" />
                  <YAxis
                    axisLine={false}
                    tickLine={false}
                    fontSize={12}
                    stroke="#888888"
                    tickFormatter={(value) => `$${Number(value).toLocaleString()}`}
                  />
                  <Tooltip
                    formatter={(value) => formatCurrency(Number(value ?? 0))}
                    contentStyle={{
                      borderRadius: '12px',
                      border: '1px solid rgba(148,163,184,0.25)',
                    }}
                  />
                  <Bar dataKey="income" name="Income" fill="#10b981" radius={[6, 6, 0, 0]} />
                  <Bar dataKey="expense" name="Expense" fill="#ef4444" radius={[6, 6, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
