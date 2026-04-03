'use client';

import { useMemo, useState } from 'react';
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
import { motion } from 'framer-motion';
import { Badge } from '@/components/ui/badge';

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

function CategoryBreakdownTooltip({ active, payload, label }: { active?: boolean; payload?: any[]; label?: string }) {
  if (!active || !payload || payload.length === 0) {
    return null;
  }

  const value = Number(payload[0]?.value ?? 0);

  return (
    <div className="rounded-xl border border-border/60 bg-card/95 backdrop-blur-md px-3 py-2 shadow-xl min-w-44">
      <p className="text-xs uppercase tracking-wide text-muted-foreground">Category</p>
      <p className="text-base font-semibold mt-0.5">{label}</p>
      <div className="mt-2 flex items-center justify-between">
        <span className="text-xs text-muted-foreground">Total Spend</span>
        <span className="text-sm font-bold text-foreground">{formatCurrency(value)}</span>
      </div>
    </div>
  );
}

export function InsightsCharts() {
  const { data } = useGlobalTransactions();
  const [activeMonth, setActiveMonth] = useState<string | null>(null);
  const [activeTopCategory, setActiveTopCategory] = useState<string | null>(null);

  const { categoryBreakdown, topCategories, monthlyComparison } = useMemo(() => {
    const expenses = data.filter((t) => t.type === 'expense');

    const categoryMap = new Map<string, number>();
    expenses.forEach((t) => {
      categoryMap.set(t.category, (categoryMap.get(t.category) || 0) + t.amount);
    });

    const categoryBreakdownData = Array.from(categoryMap.entries())
      .map(([category, amount]) => ({ category, amount }))
      .sort((a, b) => b.amount - a.amount)
      .map((item, index) => ({
        ...item,
        color: CATEGORY_COLORS[index % CATEGORY_COLORS.length],
      }));

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

  const totalTopCategorySpend = topCategories.reduce((sum, item) => sum + item.amount, 0);
  const activeTopCategoryData =
    activeTopCategory ? topCategories.find((item) => item.category === activeTopCategory) : null;

  const centerValue = activeTopCategoryData ? activeTopCategoryData.amount : totalTopCategorySpend;
  const centerValueDisplay = Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    notation: 'compact',
    maximumFractionDigits: 1,
  }).format(centerValue);

  return (
    <motion.section
      initial={{ opacity: 0, y: 14 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.35, ease: 'easeOut' }}
      className="space-y-4"
    >
      <div className="flex items-center justify-between gap-3 flex-wrap">
        <div>
          <h2 className="text-lg md:text-xl font-semibold tracking-tight">Visual Breakdown</h2>
          <p className="text-sm text-muted-foreground">Explore where money moves and how monthly balance shifts.</p>
        </div>
        <Badge variant="outline" className="bg-background/70">Interactive charts</Badge>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.2 }}
        transition={{ delay: 0.04, duration: 0.28 }}
        className="xl:col-span-2"
      >
      <Card className="h-full border-border/70 shadow-sm bg-gradient-to-b from-card to-card/90">
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
                  barCategoryGap="24%"
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
                    content={<CategoryBreakdownTooltip />}
                    cursor={false}
                  />
                  <Bar
                    dataKey="amount"
                    name="Spend"
                    radius={[0, 10, 10, 0]}
                    isAnimationActive
                    animationBegin={100}
                    animationDuration={750}
                    animationEasing="ease-out"
                    activeBar={{ stroke: '#ffffff', strokeOpacity: 0.25, strokeWidth: 1 }}
                  >
                    {categoryBreakdown.map((entry) => (
                      <Cell key={`bar-${entry.category}`} fill={entry.color} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            )}
          </div>
        </CardContent>
      </Card>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 10 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.2 }}
        transition={{ delay: 0.08, duration: 0.28 }}
      >
      <Card className="h-full border-border/70 shadow-sm bg-gradient-to-b from-card to-card/90">
        <CardHeader>
          <CardTitle>Top Expense Categories</CardTitle>
          <CardDescription>Where your money goes most often.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-56 w-full relative">
            {topCategories.length === 0 ? (
              <div className="h-full flex items-center justify-center text-sm text-muted-foreground">
                No expense data available yet.
              </div>
            ) : (
              <>
                <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none z-10">
                  <p className="text-[11px] font-semibold tracking-wide text-muted-foreground uppercase">
                    {activeTopCategoryData ? activeTopCategoryData.category : 'Total'}
                  </p>
                  <p className="text-2xl sm:text-[2rem] font-black leading-none tracking-tight text-foreground mt-1 max-w-[10.5rem] text-center truncate">
                    {centerValueDisplay}
                  </p>
                </div>

                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={topCategories}
                      dataKey="amount"
                      nameKey="category"
                      innerRadius={60}
                      outerRadius={90}
                      paddingAngle={3}
                      stroke="none"
                      isAnimationActive
                      animationBegin={120}
                      animationDuration={900}
                      animationEasing="ease-out"
                      onMouseEnter={(_, index) => setActiveTopCategory(topCategories[index]?.category ?? null)}
                      onMouseLeave={() => setActiveTopCategory(null)}
                    >
                      {topCategories.map((entry) => (
                        <Cell
                          key={entry.category}
                          fill={entry.color}
                          fillOpacity={activeTopCategory && activeTopCategory !== entry.category ? 0.35 : 1}
                          style={{ transition: 'fill-opacity 220ms ease' }}
                        />
                      ))}
                    </Pie>
                  </PieChart>
                </ResponsiveContainer>
              </>
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
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 10 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.2 }}
        transition={{ delay: 0.12, duration: 0.28 }}
        className="xl:col-span-3"
      >
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
                  <Tooltip
                    content={<ThemedTooltip />}
                    cursor={false}
                  />
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
      </motion.div>
    </div>
    </motion.section>
  );
}
