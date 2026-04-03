'use client';

import { useTransactions } from '@/hooks/useTransactions';
import { TransactionTable } from '@/components/transactions/TransactionTable';
import { AddTransactionModal } from '@/components/transactions/AddTransactionModal';
import { useRole } from '@/context/RoleContext';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Search } from 'lucide-react';
import { formatCurrency } from '@/lib/mock-data';

export default function TransactionsPage() {
  const { isAdmin } = useRole();
  const {
    transactions,
    search,
    setSearch,
    typeFilter,
    setTypeFilter,
    categoryFilter,
    setCategoryFilter,
    limit,
    setLimit,
    sortField,
    sortOrder,
    setSortOrder,
    setSortField,
    addTransaction,
    deleteTransaction,
    editTransaction,
    categories,
    stats,
    allFilteredTransactionsLength,
  } = useTransactions();

  const handleSort = (field: 'date' | 'amount') => {
    if (sortField === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortOrder('desc');
    }
  };

  return (
    <div className="space-y-6 pb-8">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Transactions</h1>
          <p className="text-muted-foreground mt-1">
            Manage and track all your income and expenses.
          </p>
        </div>
        {isAdmin && <AddTransactionModal onAdd={addTransaction} existingCategories={categories.filter(c => c !== 'all')} />}
      </div>

      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row flex-wrap items-center gap-2 bg-card p-3 rounded-lg border">
          <div className="relative flex-1 min-w-[200px] w-full">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search transactions..."
              className="pl-9 bg-background h-9"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <Select value={typeFilter} onValueChange={(v: any) => setTypeFilter(v)}>
              <SelectTrigger className="w-full sm:w-[130px] bg-background h-9">
                <SelectValue placeholder="All Types" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="income">Income</SelectItem>
                <SelectItem value="expense">Expense</SelectItem>
              </SelectContent>
            </Select>

            <Select value={categoryFilter} onValueChange={(v) => setCategoryFilter(v)}>
              <SelectTrigger className="w-full sm:w-[150px] bg-background h-9">
                <SelectValue placeholder="All Categories" />
              </SelectTrigger>
              <SelectContent>
                {categories.map(c => (
                  <SelectItem key={c} value={c}>{c === 'all' ? 'All Categories' : c}</SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={limit.toString()} onValueChange={(v) => setLimit(parseInt(v))}>
              <SelectTrigger className="w-full sm:w-[110px] bg-background h-9">
                <SelectValue placeholder="Limit" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="10">10 / page</SelectItem>
                <SelectItem value="25">25 / page</SelectItem>
                <SelectItem value="50">50 / page</SelectItem>
                <SelectItem value="100">100 / page</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="flex flex-wrap gap-2">
          <div className="px-3 py-1.5 bg-card border rounded-md text-sm text-muted-foreground font-medium flex items-center gap-1.5">
            Showing: <span className="font-bold text-foreground">{allFilteredTransactionsLength} results</span>
          </div>
          <div className="px-3 py-1.5 bg-card border rounded-md text-sm text-muted-foreground font-medium flex items-center gap-1.5">
            Income: <span className="text-emerald-500 dark:text-emerald-400 font-bold">{formatCurrency(stats.income)}</span>
          </div>
          <div className="px-3 py-1.5 bg-card border rounded-md text-sm text-muted-foreground font-medium flex items-center gap-1.5">
            Expenses: <span className="text-rose-500 dark:text-rose-400 font-bold">{formatCurrency(stats.expenses)}</span>
          </div>
        </div>
      </div>

      <TransactionTable
        transactions={transactions}
        onDelete={deleteTransaction}
        onEdit={editTransaction}
        sortField={sortField}
        sortOrder={sortOrder}
        onSort={handleSort}
      />
    </div>
  );
}
