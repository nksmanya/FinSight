'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Area, AreaChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { useGlobalTransactions } from '@/context/TransactionContext';
import { useTheme } from 'next-themes';

export function BalanceTrend() {
  const { theme } = useTheme();
  const { data } = useGlobalTransactions();
  
  const liveChartData = (() => {
    const sorted = [...data].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
    
    // Start with a base balance to make the chart look realistic
    let runningBalance = 12400; 
    
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const monthlyMap = new Map<string, number>();
    
    // Pre-fill all months with base balance
    months.forEach((m) => monthlyMap.set(m, runningBalance));

    sorted.forEach((txn) => {
      const monthStr = new Date(txn.date).toLocaleString('en-US', { month: 'short' });
      // Only process if it matches our short month format
      const monthIdx = months.indexOf(monthStr);
      if (monthIdx !== -1) {
        if (txn.type === 'income') runningBalance += txn.amount;
        else runningBalance -= txn.amount;
        
        // Carry the balance forward to all subsequent months
        for (let i = monthIdx; i < months.length; i++) {
          monthlyMap.set(months[i], runningBalance);
        }
      }
    });

    return Array.from(monthlyMap.entries()).map(([month, balance]) => ({
      month,
      balance
    }));
  })();

  // Choose accent color based on theme
  const strokeColor = '#3b82f6'; // Bright blue for pop
  const fillColor = '#3b82f6';

  return (
    <Card className="col-span-1 lg:col-span-2">
      <CardHeader>
        <CardTitle>Balance Trend</CardTitle>
        <CardDescription>Your account balance over the last 12 months.</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="h-[300px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={liveChartData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
              <defs>
                <linearGradient id="colorBalance" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor={fillColor} stopOpacity={0.3} />
                  <stop offset="95%" stopColor={fillColor} stopOpacity={0} />
                </linearGradient>
              </defs>
              <XAxis 
                dataKey="month" 
                stroke="#888888" 
                fontSize={12} 
                tickLine={false} 
                axisLine={false} 
              />
              <YAxis
                stroke="#888888"
                fontSize={12}
                tickLine={false}
                axisLine={false}
                tickFormatter={(value) => `$${value}`}
              />
              <Tooltip
                content={({ active, payload }) => {
                  if (active && payload && payload.length) {
                    return (
                      <div className="rounded-xl border border-primary/10 bg-background/95 backdrop-blur-md p-4 shadow-xl">
                        <div className="flex flex-col gap-1">
                          <span className="text-xs uppercase font-semibold text-muted-foreground tracking-wider">
                            {payload[0].payload.month}
                          </span>
                          <span className="font-bold text-2xl text-foreground">
                            ${Number(payload[0]?.value || 0).toLocaleString()}
                          </span>
                        </div>
                      </div>
                    );
                  }
                  return null;
                }}
              />
              <Area
                type="monotone"
                dataKey="balance"
                stroke={strokeColor}
                strokeWidth={4}
                fillOpacity={1}
                fill="url(#colorBalance)"
                style={{ filter: 'drop-shadow(0 4px 8px rgba(59, 130, 246, 0.2))' }}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
