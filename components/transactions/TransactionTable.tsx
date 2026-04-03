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

interface TransactionTableProps {
  transactions: Transaction[];
  onDelete: (id: string) => void;
  sortField: 'date' | 'amount';
  sortOrder: 'asc' | 'desc';
  onSort: (field: 'date' | 'amount') => void;
}

export function TransactionTable({
  transactions,
  onDelete,
  sortField,
  sortOrder,
  onSort,
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
        <TableHeader>
          <TableRow>
            <TableHead 
              className="cursor-pointer hover:bg-muted/50 transition-colors w-[120px]"
              onClick={() => onSort('date')}
            >
              Date <SortIcon field="date" />
            </TableHead>
            <TableHead>Description</TableHead>
            <TableHead>Category</TableHead>
            <TableHead 
              className="cursor-pointer hover:bg-muted/50 transition-colors text-right"
              onClick={() => onSort('amount')}
            >
              Amount <SortIcon field="amount" />
            </TableHead>
            {isAdmin && <TableHead className="w-[100px] text-right">Actions</TableHead>}
          </TableRow>
        </TableHeader>
        <TableBody>
          {transactions.map((transaction) => {
            const isIncome = transaction.type === 'income';
            
            return (
              <TableRow key={transaction.id} className="group">
                <TableCell className="font-medium whitespace-nowrap text-muted-foreground">
                  {new Date(transaction.date).toLocaleDateString()}
                </TableCell>
                <TableCell>
                  <div className="font-medium">{transaction.description}</div>
                </TableCell>
                <TableCell>
                  <Badge variant="secondary" className="font-normal">
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
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <Edit className="h-4 w-4" />
                      </Button>
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
