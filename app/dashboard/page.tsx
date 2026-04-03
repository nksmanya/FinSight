'use client';

import { StatCard } from '@/components/dashboard/StatCard';
import { BalanceTrend } from '@/components/dashboard/BalanceTrend';
import { SpendingDonut } from '@/components/dashboard/SpendingDonut';
import { RecentActivity } from '@/components/dashboard/RecentActivity';
import { MonthlyComparisonChart } from '@/components/dashboard/MonthlyComparisonChart';
import { WalletIcon, TrendingUpIcon, TrendingDownIcon } from 'lucide-react';
import { useRole } from '@/context/RoleContext';
import { useGlobalTransactions } from '@/context/TransactionContext';

export default function DashboardPage() {
  const { role } = useRole();
  const userName = role === 'admin' ? 'Admin' : 'Viewer';
  const { data } = useGlobalTransactions();

  let totalIncome = 0;
  let totalExpenses = 0;
  data.forEach((t) => {
    if (t.type === 'income') totalIncome += t.amount;
    else totalExpenses += t.amount;
  });
  const balance = totalIncome - totalExpenses;

  const metricsData = [
    {
      title: 'Total Balance',
      amount: balance,
      trend: 12.5,
      trendText: 'from last month',
      icon: WalletIcon,
    },
    {
      title: 'Total Income',
      amount: totalIncome,
      trend: 4.2,
      trendText: 'from last month',
      icon: TrendingUpIcon,
    },
    {
      title: 'Total Expenses',
      amount: totalExpenses,
      trend: -2.1,
      trendText: 'from last month',
      icon: TrendingDownIcon,
    },
  ];

  return (
    <div className="space-y-8 pb-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Welcome back, {userName}</h1>
        <p className="text-muted-foreground mt-1">
          Overview of your current financial portfolio.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {metricsData.map((data, i) => (
          <StatCard key={data.title} data={data} isMain={i === 0} />
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <BalanceTrend />
        <SpendingDonut />
      </div>

      <div className="grid grid-cols-1 gap-6">
        <MonthlyComparisonChart />
      </div>

      <div className="grid grid-cols-1 gap-6">
        <RecentActivity />
      </div>
    </div>
  );
}
