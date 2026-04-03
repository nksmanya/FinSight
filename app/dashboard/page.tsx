'use client';

import { StatCard } from '@/components/dashboard/StatCard';
import { BalanceTrend } from '@/components/dashboard/BalanceTrend';
import { SpendingDonut } from '@/components/dashboard/SpendingDonut';
import { RecentActivity } from '@/components/dashboard/RecentActivity';
import { WalletIcon, TrendingUpIcon, TrendingDownIcon } from 'lucide-react';
import { useRole } from '@/context/RoleContext';

export default function DashboardPage() {
  const { role } = useRole();
  const userName = role === 'admin' ? 'Admin' : 'Viewer';

  const metricsData = [
    {
      title: 'Total Balance',
      amount: 24562.00,
      trend: 12.5,
      trendText: 'from last month',
      icon: WalletIcon,
    },
    {
      title: 'Total Income',
      amount: 8450.00,
      trend: 4.2,
      trendText: 'from last month',
      icon: TrendingUpIcon,
    },
    {
      title: 'Total Expenses',
      amount: 3240.50,
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
          Here&apos;s what&apos;s happening with your money today.
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
        <RecentActivity />
      </div>
    </div>
  );
}
