import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Transaction } from '@/types';
import { formatCurrency } from '@/lib/mock-data';
import { ArrowDown, ArrowUp, Edit, Trash2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useRole } from '@/context/RoleContext';
import { EditTransactionModal } from './EditTransactionModal';
import { getCategoryColorClass } from '@/lib/categories';

interface TransactionTableProps {
  transactions: Transaction[];
  onDelete: (id: string) => void;
  sortField: 'date' | 'amount';
  sortOrder: 'asc' | 'desc';
  onSort: (field: 'date' | 'amount') => void;
  onEdit: (updatedTransaction: Transaction) => void;
}

export function TransactionTable({
  transactions,
  onDelete,
  sortField,
  sortOrder,
  onSort,
  onEdit,
}: TransactionTableProps) {
  const { isAdmin } = useRole();

  if (transactions.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <div className="bg-muted h-24 w-24 rounded-full flex items-center justify-center mb-4">
          <svg
            className="w-12 h-12 text-muted-foreground"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
        </div>
        <h3 className="text-lg font-medium">No transactions found</h3>
        <p className="text-sm text-muted-foreground mt-1 max-w-sm">
          We couldn&apos;t find any transactions matching your current filters.
        </p>
      </div>
    );
  }

  const SortIcon = ({ field }: { field: 'date' | 'amount' }) => {
    if (sortField !== field) return null;
    return sortOrder === 'asc' ? <ArrowUp className="w-3 h-3 ml-1 inline" /> : <ArrowDown className="w-3 h-3 ml-1 inline" />;
  };

  return (
    <div className="border rounded-md">
      <Table>
        <TableHeader className="bg-muted/40">
          <TableRow className="hover:bg-transparent">
            <TableHead 
              className="cursor-pointer hover:text-foreground transition-colors w-[130px] font-semibold"
              onClick={() => onSort('date')}
            >
              Date <SortIcon field="date" />
            </TableHead>
            <TableHead className="font-semibold">Description</TableHead>
            <TableHead className="font-semibold">Type</TableHead>
            <TableHead className="font-semibold">Category</TableHead>
            <TableHead 
              className="cursor-pointer hover:text-foreground transition-colors text-right font-semibold"
              onClick={() => onSort('amount')}
            >
              Amount <SortIcon field="amount" />
            </TableHead>
            {isAdmin && <TableHead className="w-[100px] text-right font-semibold">Actions</TableHead>}
          </TableRow>
        </TableHeader>
        <TableBody>
          {transactions.map((transaction) => {
            const isIncome = transaction.type === 'income';
            
            return (
              <TableRow key={transaction.id} className="group hover:bg-muted/30 transition-colors border-b last:border-0 data-[state=selected]:bg-muted">
                <TableCell className="font-medium whitespace-nowrap text-muted-foreground/80 py-4">
                  {new Date(transaction.date).toLocaleDateString('en-GB', { day: '2-digit', month: 'long', year: 'numeric' })}
                </TableCell>
                <TableCell>
                  <div className="font-medium">{transaction.description}</div>
                </TableCell>
                <TableCell>
                  <Badge variant="outline" className={cn(
                    "capitalize font-medium text-xs",
                    isIncome 
                      ? "bg-emerald-500/10 text-emerald-600 border-emerald-500/20 dark:text-emerald-400" 
                      : "bg-rose-500/10 text-rose-600 border-rose-500/20 dark:text-rose-400"
                  )}>
                    {transaction.type}
                  </Badge>
                </TableCell>
                <TableCell>
                  <Badge variant="outline" className={cn("font-medium", getCategoryColorClass(transaction.category))}>
                    {transaction.category}
                  </Badge>
                </TableCell>
                <TableCell className={cn(
                  "text-right font-medium",
                  isIncome ? "text-emerald-600 dark:text-emerald-400" : ""
                )}>
                  {isIncome ? '+' : '-'}{formatCurrency(transaction.amount)}
                </TableCell>
                {isAdmin && (
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <EditTransactionModal transaction={transaction} onEdit={onEdit} />
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        className="h-8 w-8 text-rose-500 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-500/10"
                        onClick={() => onDelete(transaction.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                )}
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
}
