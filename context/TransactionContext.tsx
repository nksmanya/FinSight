'use client';

import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { Transaction } from '@/types';
import { mockTransactions } from '@/lib/mock-data';
import { toast } from 'sonner';

interface TransactionContextType {
  data: Transaction[];
  addTransaction: (transaction: Omit<Transaction, 'id'>) => void;
  deleteTransaction: (id: string) => void;
  editTransaction: (updatedTransaction: Transaction) => void;
}

const TransactionContext = createContext<TransactionContextType | undefined>(undefined);

export function TransactionProvider({ children }: { children: ReactNode }) {
  const [data, setData] = useState<Transaction[]>(mockTransactions);
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    try {
      const stored = localStorage.getItem('finsight_data');
      if (stored) {
        setData(JSON.parse(stored));
      }
    } catch (e) {
      console.error("Failed to parse local storage", e);
    }
    setIsInitialized(true);
  }, []);

  useEffect(() => {
    if (isInitialized) {
      localStorage.setItem('finsight_data', JSON.stringify(data));
    }
  }, [data, isInitialized]);

  const addTransaction = (transaction: Omit<Transaction, 'id'>) => {
    const newTransaction = {
      ...transaction,
      id: Math.random().toString(36).substring(7),
    };
    setData((prev) => [newTransaction, ...prev]);
    toast.success('Transaction added successfully!');
  };

  const deleteTransaction = (id: string) => {
    setData((prev) => prev.filter((t) => t.id !== id));
    toast.info('Transaction deleted.');
  };

  const editTransaction = (updatedTransaction: Transaction) => {
    setData((prev) =>
      prev.map((t) => (t.id === updatedTransaction.id ? updatedTransaction : t))
    );
    toast.success('Transaction updated!');
  };

  return (
    <TransactionContext.Provider
      value={{ data, addTransaction, deleteTransaction, editTransaction }}
    >
      {children}
    </TransactionContext.Provider>
  );
}

export function useGlobalTransactions() {
  const context = useContext(TransactionContext);
  if (context === undefined) {
    throw new Error('useGlobalTransactions must be used within a TransactionProvider');
  }
  return context;
}
