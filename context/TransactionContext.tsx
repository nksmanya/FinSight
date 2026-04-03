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
const USER_STORAGE_KEY = 'finsight_user_data';
const LEGACY_STORAGE_KEY = 'finsight_data';

export function TransactionProvider({ children }: { children: ReactNode }) {
  const [data, setData] = useState<Transaction[]>(mockTransactions);
  const [userTransactions, setUserTransactions] = useState<Transaction[]>([]);
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    try {
      const storedUserData = localStorage.getItem(USER_STORAGE_KEY);
      const mockIdSet = new Set(mockTransactions.map((t) => t.id));
      let parsedUserData: Transaction[] = [];

      if (storedUserData) {
        const parsed = JSON.parse(storedUserData);
        if (Array.isArray(parsed)) {
          parsedUserData = parsed;
        }
      } else {
        const legacyStored = localStorage.getItem(LEGACY_STORAGE_KEY);
        if (legacyStored) {
          const parsedLegacy = JSON.parse(legacyStored);
          if (Array.isArray(parsedLegacy)) {
            // Migrate only non-seeded transactions from legacy storage.
            parsedUserData = parsedLegacy.filter(
              (tx: Transaction) => tx?.id && !mockIdSet.has(tx.id)
            );
            localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(parsedUserData));
          }
        }
      }

      setUserTransactions(parsedUserData);
      setData([...parsedUserData, ...mockTransactions]);
    } catch (e) {
      console.error("Failed to parse local storage", e);
      setUserTransactions([]);
      setData(mockTransactions);
    }
    setIsInitialized(true);
  }, []);

  useEffect(() => {
    if (isInitialized) {
      localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(userTransactions));
    }
  }, [userTransactions, isInitialized]);

  const addTransaction = (transaction: Omit<Transaction, 'id'>) => {
    const newTransaction = {
      ...transaction,
      id: Math.random().toString(36).substring(7),
    };
    setUserTransactions((prev) => [newTransaction, ...prev]);
    setData((prev) => [newTransaction, ...prev]);
    toast.success('Transaction added successfully!');
  };

  const deleteTransaction = (id: string) => {
    setData((prev) => prev.filter((t) => t.id !== id));
    setUserTransactions((prev) => prev.filter((t) => t.id !== id));
    toast.info('Transaction deleted.');
  };

  const editTransaction = (updatedTransaction: Transaction) => {
    setData((prev) =>
      prev.map((t) => (t.id === updatedTransaction.id ? updatedTransaction : t))
    );
    setUserTransactions((prev) =>
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
