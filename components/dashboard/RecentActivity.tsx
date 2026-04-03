import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { formatCurrency } from '@/lib/mock-data';
import { useGlobalTransactions } from '@/context/TransactionContext';
import { ArrowDownLeft, ArrowUpRight } from 'lucide-react';
import { cn } from '@/lib/utils';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

export function RecentActivity() {
  const { data } = useGlobalTransactions();
  // Sort data strictly by date descending to get true recent txns
  const recentTransactions = [...data].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()).slice(0, 5);

  return (
    <Card className="col-span-1 lg:col-span-3">
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle>Recent Activity</CardTitle>
          <CardDescription>Your latest transactions.</CardDescription>
        </div>
        <Button variant="ghost" size="sm" asChild>
          <Link href="/transactions">View All</Link>
        </Button>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          {recentTransactions.map((transaction) => {
            const isIncome = transaction.type === 'income';
            
            return (
              <div key={transaction.id} className="flex items-center justify-between group hover:bg-muted/40 p-3 -mx-3 rounded-xl transition-all border border-transparent hover:border-border">
                <div className="flex items-center gap-4">
                  <Avatar className={cn(
                    "h-11 w-11 flex items-center justify-center border shadow-sm",
                    isIncome ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-600 dark:text-emerald-400" : "bg-rose-500/10 border-rose-500/20 text-rose-600 dark:text-rose-400"
                  )}>
                    <AvatarFallback className="bg-transparent">
                      {isIncome ? <ArrowDownLeft className="h-4 w-4" /> : <ArrowUpRight className="h-4 w-4" />}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="text-sm font-semibold leading-none mb-1.5 group-hover:text-primary transition-colors">
                      {transaction.description}
                    </p>
                    <p className="text-xs text-muted-foreground font-medium">
                      {new Date(transaction.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })} • {transaction.category}
                    </p>
                  </div>
                </div>
                <div className={cn(
                  "font-medium",
                  isIncome ? "text-emerald-600 dark:text-emerald-400" : ""
                )}>
                  {isIncome ? '+' : '-'}{formatCurrency(transaction.amount)}
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
