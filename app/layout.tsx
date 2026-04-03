import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { ThemeProvider } from '@/components/providers/ThemeProvider';
import { RoleProvider } from '@/context/RoleContext';
import { TransactionProvider } from '@/context/TransactionContext';
import { TooltipProvider } from '@/components/ui/tooltip';
import { AppShell } from '@/components/layout/AppShell';
import { Toaster } from '@/components/ui/sonner';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'FinSight Dashboard',
  description: 'A modern, clean, and highly intuitive Finance Dashboard UI',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <RoleProvider>
            <TransactionProvider>
              <TooltipProvider>
                <AppShell>{children}</AppShell>
                <Toaster />
              </TooltipProvider>
            </TransactionProvider>
          </RoleProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
