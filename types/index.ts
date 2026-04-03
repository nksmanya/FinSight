export type Role = 'viewer' | 'admin';

export type TransactionType = 'income' | 'expense';

export interface Transaction {
  id: string;
  date: string;
  description: string;
  category: string;
  amount: number;
  type: TransactionType;
}

export interface MetricCardData {
  title: string;
  amount: number;
  trend: number;
  trendText: string;
  icon: any;
}
