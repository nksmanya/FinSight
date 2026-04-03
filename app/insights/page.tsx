import { InsightsGrid } from '@/components/insights/InsightsGrid';
import { InsightsCharts } from '@/components/insights/InsightsCharts';
import { FinancialPulse } from '@/components/insights/FinancialPulse';

export default function InsightsPage() {
  return (
    <div className="space-y-8 pb-10 relative">
      <div className="absolute inset-x-0 -top-8 h-44 pointer-events-none bg-[radial-gradient(circle_at_top,rgba(14,165,233,0.14),transparent_65%)]" />
      <div className="relative">
        <h1 className="text-3xl md:text-4xl font-bold tracking-tight">Financial Insights</h1>
        <p className="text-muted-foreground mt-2 max-w-2xl">
          Clear, data-driven observations to help you understand spending behavior and make better monthly decisions.
        </p>
      </div>

      <FinancialPulse />
      <InsightsCharts />
      <InsightsGrid />
    </div>
  );
}
