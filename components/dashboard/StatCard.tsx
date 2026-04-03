import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowDownIcon, ArrowUpIcon } from 'lucide-react';
import { cn } from '@/lib/utils';
import { MetricCardData } from '@/types';
import { formatCurrency } from '@/lib/mock-data';

interface StatCardProps {
  data: MetricCardData;
  isMain?: boolean;
}

export function StatCard({ data, isMain = false }: StatCardProps) {
  const isPositive = data.trend > 0;
  
  return (
    <Card className={cn(
      "overflow-hidden transition-all duration-200 hover:shadow-md",
      isMain ? "bg-teal-500/10 text-foreground border-teal-500/20" : ""
    )}>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className={cn(
          "text-sm font-medium",
          isMain ? "text-foreground/70" : "text-muted-foreground"
        )}>
          {data.title}
        </CardTitle>
        <div className={cn(
          "p-2 rounded-full",
          isMain ? "bg-teal-500/20 text-teal-600 dark:text-teal-400" : "bg-muted text-muted-foreground"
        )}>
          <data.icon className="h-4 w-4" />
        </div>
      </CardHeader>
      <CardContent>
        <div className="text-2xl md:text-3xl font-bold tracking-tight mb-2">
          {formatCurrency(data.amount)}
        </div>
        <div className="flex items-center text-xs">
          <span className={cn(
            "flex items-center font-medium mr-2 rounded-full px-1.5 py-0.5",
            isMain 
              ? isPositive ? "bg-teal-500/20 text-teal-600 dark:text-teal-400" : "bg-rose-500/20 text-rose-600 dark:text-rose-400"
              : isPositive ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400" : "bg-rose-500/10 text-rose-600 dark:text-rose-400"
          )}>
            {isPositive ? <ArrowUpIcon className="mr-1 h-3 w-3" /> : <ArrowDownIcon className="mr-1 h-3 w-3" />}
            {Math.abs(data.trend)}%
          </span>
          <span className={cn(
            isMain ? "text-foreground/60" : "text-muted-foreground"
          )}>
            {data.trendText}
          </span>
        </div>
      </CardContent>
    </Card>
  );
}
