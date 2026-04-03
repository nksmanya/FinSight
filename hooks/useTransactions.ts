import { useState, useMemo } from 'react';
import { Transaction } from '@/types';
import { mockTransactions } from '@/lib/mock-data';

export type SortField = 'date' | 'amount';
export type SortOrder = 'asc' | 'desc';

export function useTransactions() {
  const [data, setData] = useState<Transaction[]>(mockTransactions);
  const [search, setSearch] = useState('');
  const [typeFilter, setTypeFilter] = useState<'all' | 'income' | 'expense'>('all');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [limit, setLimit] = useState<number>(50);
  const [sortField, setSortField] = useState<SortField>('date');
  const [sortOrder, setSortOrder] = useState<SortOrder>('desc');

  const categories = useMemo(() => {
    const cats = new Set(data.map((t) => t.category));
    return ['all', ...Array.from(cats)].sort();
  }, [data]);

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

  const editTransaction = (updatedTransaction: Transaction) => {
    setData((prev) =>
      prev.map((t) => (t.id === updatedTransaction.id ? updatedTransaction : t))
    );
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

    // Category filter
    if (categoryFilter !== 'all') {
      result = result.filter((t) => t.category === categoryFilter);
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
  }, [data, search, typeFilter, categoryFilter, sortField, sortOrder]);

  const stats = useMemo(() => {
    let income = 0;
    let expenses = 0;
    filteredAndSortedData.forEach((t) => {
      if (t.type === 'income') income += t.amount;
      else expenses += t.amount;
    });
    return { income, expenses, count: filteredAndSortedData.length };
  }, [filteredAndSortedData]);

  const paginatedData = useMemo(() => {
    return filteredAndSortedData.slice(0, limit);
  }, [filteredAndSortedData, limit]);

  return {
    transactions: paginatedData,
    allFilteredTransactionsLength: stats.count,
    stats,
    categories,
    search,
    setSearch,
    typeFilter,
    setTypeFilter,
    categoryFilter,
    setCategoryFilter,
    limit,
    setLimit,
    sortField,
    setSortField,
    sortOrder,
    setSortOrder,
    addTransaction,
    deleteTransaction,
    editTransaction,
  };
}
