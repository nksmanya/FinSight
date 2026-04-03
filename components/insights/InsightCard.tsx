import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { LucideIcon } from 'lucide-react';

interface InsightCardProps {
  title: string;
  value: string;
  description: string;
  recommendation?: string;
  priority?: 'high' | 'medium' | 'low';
  icon: LucideIcon;
  colorClass: string;
}

export function InsightCard({
  title,
  value,
  description,
  recommendation,
  priority = 'low',
  icon: Icon,
  colorClass,
}: InsightCardProps) {
  const priorityLabel =
    priority === 'high' ? 'High Priority' : priority === 'medium' ? 'Watchlist' : 'Stable';

  const priorityClass =
    priority === 'high'
      ? 'bg-rose-500/10 text-rose-600 border-rose-500/30'
      : priority === 'medium'
        ? 'bg-amber-500/10 text-amber-600 border-amber-500/30'
        : 'bg-emerald-500/10 text-emerald-600 border-emerald-500/30';

  return (
    <Card className="h-full overflow-hidden border-border/70 hover:border-primary/50 hover:shadow-sm transition-all duration-200">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between gap-3">
          <CardTitle className="text-sm font-medium text-muted-foreground">
            {title}
          </CardTitle>
          <Badge variant="outline" className={cn('text-[11px] px-2 py-0.5', priorityClass)}>
            {priorityLabel}
          </Badge>
        </div>
        <div className="mt-2 inline-flex">
          <div className={cn("p-2 rounded-full ring-1 ring-border/40", colorClass)}>
            <Icon className={cn("h-4 w-4")} />
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-2.5">
        <div className="text-2xl md:text-3xl font-bold tracking-tight leading-tight break-words">
          {value}
        </div>
        <p className="text-xs md:text-sm text-muted-foreground leading-relaxed">
          {description}
        </p>
        {recommendation ? (
          <p className="text-xs md:text-sm font-medium text-foreground/90 bg-muted/50 rounded-md px-2.5 py-2">
            {recommendation}
          </p>
        ) : null}
      </CardContent>
    </Card>
  );
}
