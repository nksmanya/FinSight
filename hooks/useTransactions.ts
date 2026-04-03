import { useState, useMemo } from 'react';
import { Transaction } from '@/types';
import { useGlobalTransactions } from '@/context/TransactionContext';
import { toast } from 'sonner';

export type SortField = 'date' | 'amount';
export type SortOrder = 'asc' | 'desc';
export type DateFilter = 'all' | 'current-month' | 'custom';

export function useTransactions() {
  const { data, addTransaction, deleteTransaction, editTransaction } = useGlobalTransactions();
  const [search, setSearch] = useState('');
  const [typeFilter, setTypeFilter] = useState<'all' | 'income' | 'expense'>('all');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [dateFilter, setDateFilter] = useState<DateFilter>('all');
  const [startDate, setStartDate] = useState<string>('');
  const [endDate, setEndDate] = useState<string>('');
  const [limit, setLimit] = useState<number>(50);
  const [sortField, setSortField] = useState<SortField>('date');
  const [sortOrder, setSortOrder] = useState<SortOrder>('desc');

  const categories = useMemo(() => {
    const cats = new Set(data.map((t) => t.category));
    return ['all', ...Array.from(cats)].sort();
  }, [data]);

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

    // Date filter
    if (dateFilter === 'current-month') {
      const now = new Date();
      const currentMonth = now.getMonth();
      const currentYear = now.getFullYear();
      result = result.filter((t) => {
        const tDate = new Date(t.date);
        return tDate.getMonth() === currentMonth && tDate.getFullYear() === currentYear;
      });
    } else if (dateFilter === 'custom' && startDate && endDate) {
      const start = new Date(startDate);
      const end = new Date(endDate);
      end.setHours(23, 59, 59, 999); // Include entire end date
      result = result.filter((t) => {
        const tDate = new Date(t.date);
        return tDate >= start && tDate <= end;
      });
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
  }, [data, search, typeFilter, categoryFilter, dateFilter, startDate, endDate, sortField, sortOrder]);

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

  const exportCSV = () => {
    if (filteredAndSortedData.length === 0) {
      toast.error('No transactions to export.');
      return;
    }

    const headers = ['ID', 'Date', 'Description', 'Category', 'Type', 'Amount'];
    const csvLines = [
      headers.join(','),
      ...filteredAndSortedData.map(t => 
        // Wrapping description in quotes to safety escape internal commas
        `${t.id},${t.date},"${t.description.replace(/"/g, '""')}",${t.category},${t.type},${t.amount}`
      )
    ];

    const blob = new Blob([csvLines.join('\n')], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `finsight_transactions_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success(`Exported ${filteredAndSortedData.length} records successfully.`);
  };

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
    dateFilter,
    setDateFilter,
    startDate,
    setStartDate,
    endDate,
    setEndDate,
    limit,
    setLimit,
    sortField,
    setSortField,
    sortOrder,
    setSortOrder,
    addTransaction,
    deleteTransaction,
    editTransaction,
    exportCSV,
  };
}
