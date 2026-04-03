import { InsightsGrid } from '@/components/insights/InsightsGrid';

export default function InsightsPage() {
  return (
    <div className="space-y-6 pb-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Financial Insights</h1>
        <p className="text-muted-foreground mt-1">
          AI-driven analysis of your spending habits and financial health.
        </p>
      </div>

      <InsightsGrid />
    </div>
  );
}
