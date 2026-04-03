import { InsightCard } from './InsightCard';
import { 
  TrendingUp, 
  TrendingDown, 
  PiggyBank, 
  CalendarDays, 
  Flame, 
  AlertCircle 
} from 'lucide-react';
import { formatCurrency } from '@/lib/mock-data';

export function InsightsGrid() {
  const insights = [
    {
      title: 'Highest Spending Category',
      value: 'Housing',
      description: `Accounts for 55% of your total expenses this month.`,
      icon: TrendingDown,
      colorClass: 'bg-rose-500/10 text-rose-500 [&>svg]:text-rose-500',
    },
    {
      title: 'Monthly Comparison',
      value: '-12.5%',
      description: 'You spent less this month compared to last month. Great job!',
      icon: TrendingUp,
      colorClass: 'bg-emerald-500/10 text-emerald-500 [&>svg]:text-emerald-500',
    },
    {
      title: 'Biggest Single Expense',
      value: formatCurrency(1800),
      description: 'Monthly Rent on April 5, 2024.',
      icon: AlertCircle,
      colorClass: 'bg-orange-500/10 text-orange-500 [&>svg]:text-orange-500',
    },
    {
      title: 'Savings Rate',
      value: '28.5%',
      description: 'You are saving more than the recommended 20%.',
      icon: PiggyBank,
      colorClass: 'bg-blue-500/10 text-blue-500 [&>svg]:text-blue-500',
    },
    {
      title: 'Most Active Spending Day',
      value: 'Fridays',
      description: 'You tend to spend 40% more on Fridays.',
      icon: CalendarDays,
      colorClass: 'bg-purple-500/10 text-purple-500 [&>svg]:text-purple-500',
    },
    {
      title: 'Positive Balance Streak',
      value: '14 Days',
      description: 'Consecutive days without dipping below your minimum balance.',
      icon: Flame,
      colorClass: 'bg-amber-500/10 text-amber-500 [&>svg]:text-amber-500',
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
      {insights.map((insight) => (
        <InsightCard key={insight.title} {...insight} />
      ))}
    </div>
  );
}
