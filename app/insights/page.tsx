import { InsightsGrid } from '@/components/insights/InsightsGrid';
import { InsightsCharts } from '@/components/insights/InsightsCharts';
import { FinancialPulse } from '@/components/insights/FinancialPulse';

export default function InsightsPage() {
  return (
    <div className="space-y-8 pb-10">
      <div>
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
