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

interface SidebarProps {
  isMobileNavOpen: boolean;
  onMobileNavClose: () => void;
}

export function Sidebar({ isMobileNavOpen, onMobileNavClose }: SidebarProps) {
  const pathname = usePathname();

  const navContent = (
    <>
      <div className="h-16 flex items-center px-6 border-b">
        <Link href="/" className="flex items-center gap-3 font-bold text-xl tracking-tight" onClick={onMobileNavClose}>
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
              onClick={onMobileNavClose}
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
    </>
  );

  return (
    <>
      <aside className="w-64 border-r bg-card hidden md:flex flex-col h-screen sticky top-0">
        {navContent}
      </aside>

      {isMobileNavOpen ? (
        <div className="md:hidden fixed inset-0 z-40">
          <button
            aria-label="Close navigation"
            onClick={onMobileNavClose}
            className="absolute inset-0 bg-black/40"
          />
          <aside className="relative z-10 w-72 max-w-[85vw] h-full bg-card border-r shadow-xl flex flex-col">
            {navContent}
          </aside>
        </div>
      ) : null}
    </>
  );
}
