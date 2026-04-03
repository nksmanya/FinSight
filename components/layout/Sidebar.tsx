'use client';

import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { LayoutDashboard, Receipt, PieChart, Settings } from 'lucide-react';
import { cn } from '@/lib/utils';

const navItems = [
  { name: 'Dashboard', href: '/', icon: LayoutDashboard },
  { name: 'Transactions', href: '/transactions', icon: Receipt },
  { name: 'Insights', href: '/insights', icon: PieChart },
  { name: 'Settings', href: '/settings', icon: Settings },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-64 border-r bg-card hidden md:flex flex-col h-screen sticky top-0">
      <div className="h-16 flex items-center px-6 border-b">
        <Link href="/" className="flex items-center gap-3 font-bold text-xl tracking-tight">
          <div className="relative h-8 w-8 overflow-hidden rounded-md shadow-sm">
            <Image src="/logo.png" alt="FinSight Logo" fill className="object-cover" />
          </div>
          FinSight
        </Link>
      </div>
      <nav className="flex-1 p-4 space-y-1">
        {navItems.map((item) => {
          const isActive = pathname === item.href || (item.href !== '/' && pathname?.startsWith(item.href));
          return (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                'flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition-colors',
                isActive 
                  ? 'bg-secondary text-secondary-foreground' 
                  : 'text-muted-foreground hover:bg-secondary/50 hover:text-foreground'
              )}
            >
              <item.icon className="h-4 w-4" />
              {item.name}
            </Link>
          );
        })}
      </nav>
      <div className="p-4 border-t">
        <div className="bg-muted p-4 rounded-xl text-center">
          <p className="text-sm font-medium mb-1">Need help?</p>
          <p className="text-xs text-muted-foreground mb-3">Check our docs</p>
          <button className="text-xs font-medium bg-background border px-3 py-1.5 rounded-full shadow-sm hover:bg-card">
            Documentation
          </button>
        </div>
      </div>
    </aside>
  );
}
