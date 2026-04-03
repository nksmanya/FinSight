import { useState, useMemo } from 'react';
import { Transaction } from '@/types';
import { mockTransactions } from '@/lib/mock-data';

export type SortField = 'date' | 'amount';
export type SortOrder = 'asc' | 'desc';

export function useTransactions() {
  const [data, setData] = useState<Transaction[]>(mockTransactions);
  const [search, setSearch] = useState('');
  const [typeFilter, setTypeFilter] = useState<'all' | 'income' | 'expense'>('all');
  const [sortField, setSortField] = useState<SortField>('date');
  const [sortOrder, setSortOrder] = useState<SortOrder>('desc');

  const addTransaction = (transaction: Omit<Transaction, 'id'>) => {
    const newTransaction = {
      ...transaction,
      id: Math.random().toString(36).substring(7),
    };
    setData((prev) => [newTransaction, ...prev]);
  };

  const deleteTransaction = (id: string) => {
    setData((prev) => prev.filter((t) => t.id !== id));
  };

  const filteredAndSortedData = useMemo(() => {
    let result = [...data];

    // Search filter
    if (search) {
      const lowerSearch = search.toLowerCase();
      result = result.filter(
        (t) =>
          t.description.toLowerCase().includes(lowerSearch) ||
          t.category.toLowerCase().includes(lowerSearch)
      );
    }

    // Type filter
    if (typeFilter !== 'all') {
      result = result.filter((t) => t.type === typeFilter);
    }

    // Sort
    result.sort((a, b) => {
      let comparison = 0;
      if (sortField === 'date') {
        comparison = new Date(a.date).getTime() - new Date(b.date).getTime();
      } else if (sortField === 'amount') {
        comparison = a.amount - b.amount;
      }

      return sortOrder === 'asc' ? comparison : -comparison;
    });

    return result;
  }, [data, search, typeFilter, sortField, sortOrder]);

  return {
    transactions: filteredAndSortedData,
    search,
    setSearch,
    typeFilter,
    setTypeFilter,
    sortField,
    setSortField,
    sortOrder,
    setSortOrder,
    addTransaction,
    deleteTransaction,
  };
}
