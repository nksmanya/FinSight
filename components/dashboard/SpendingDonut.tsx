'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Cell, Pie, PieChart, ResponsiveContainer } from 'recharts';
import { useGlobalTransactions } from '@/context/TransactionContext';
import { useState } from 'react';

const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#8b5cf6', '#f43f5e', '#14b8a6', '#06b6d4', '#ec4899'];

export function SpendingDonut() {
  const { data } = useGlobalTransactions();
  const [hoveredItem, setHoveredItem] = useState<{name: string, value: number} | null>(null);
  
  const liveSpendingData = (() => {
    const expenses = data.filter(t => t.type === 'expense');
    const categoryMap = new Map<string, number>();
    expenses.forEach(t => {
      categoryMap.set(t.category, (categoryMap.get(t.category) || 0) + t.amount);
    });
    return Array.from(categoryMap.entries())
      .sort((a, b) => b[1] - a[1]) // Sort largest to smallest
      .map(([name, value], i) => ({
        name,
        value,
        color: COLORS[i % COLORS.length]
      }));
  })();
  return (
    <Card className="col-span-1">
      <CardHeader>
        <CardTitle>Spending by Category</CardTitle>
        <CardDescription>Where your money went this month.</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="h-[250px] w-full relative">
          {liveSpendingData.length === 0 ? (
            <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
              <div className="h-32 w-32 rounded-full border-[12px] border-muted mb-4" />
              <p className="text-muted-foreground text-sm font-medium">No expenses yet.</p>
            </div>
          ) : (
            <>
              <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                <div className="text-xs font-bold text-muted-foreground uppercase tracking-wider">
                  {hoveredItem ? hoveredItem.name : 'TOTAL'}
                </div>
                <div className="text-3xl font-black text-foreground">
                  {Intl.NumberFormat('en-US', {
                    style: 'currency',
                    currency: 'USD',
                    notation: 'compact',
                    maximumFractionDigits: 1,
                  }).format(hoveredItem ? hoveredItem.value : liveSpendingData.reduce((a, b) => a + b.value, 0))}
                </div>
              </div>
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={liveSpendingData}
                    cx="50%"
                    cy="50%"
                    innerRadius={70}
                    outerRadius={95}
                    paddingAngle={5}
                    dataKey="value"
                    stroke="none"
                    onMouseEnter={(_, index) => setHoveredItem(liveSpendingData[index])}
                    onMouseLeave={() => setHoveredItem(null)}
                  >
                    {liveSpendingData.map((entry, index) => (
                      <Cell 
                        key={`cell-${index}`} 
                        fill={entry.color} 
                        style={{ outline: 'none', transition: 'all 0.2s ease-in-out' }} 
                        className="hover:opacity-80 cursor-pointer"
                      />
                    ))}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
            </>
          )}
        </div>
        
        {liveSpendingData.length > 0 && (
          <div className="mt-4 grid grid-cols-2 gap-4 text-sm">
            {liveSpendingData.map((item) => (
              <div key={item.name} className="flex items-center gap-2">
                <div className="h-3 w-3 rounded-full" style={{ backgroundColor: item.color }} />
                <span className="text-muted-foreground">{item.name}</span>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
