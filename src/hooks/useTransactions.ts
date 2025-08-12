/**
 * Hook useTransactions - CryptoBoost
 * Hook React pour gérer les transactions
 */

import { useState, useEffect, useCallback } from 'react';
import { transactionService, Transaction, CreateTransactionData, TransactionFilters } from '../lib/transactions';
import { useAuth } from './useAuth';

export interface UseTransactionsReturn {
  // État
  transactions: Transaction[];
  isLoading: boolean;
  error: string | null;
  
  // Actions
  createTransaction: (data: Omit<CreateTransactionData, 'userId'>) => Promise<Transaction | null>;
  getTransactions: (filters?: TransactionFilters) => Promise<void>;
  getTransactionById: (id: string) => Promise<Transaction | null>;
  updateTransactionStatus: (id: string, status: Transaction['status']) => Promise<Transaction | null>;
  approveTransaction: (id: string) => Promise<Transaction | null>;
  rejectTransaction: (id: string) => Promise<Transaction | null>;
  deleteTransaction: (id: string) => Promise<boolean>;
  exportTransactions: (filters?: TransactionFilters) => Promise<string>;
  getStats: () => Promise<{
    total: number;
    pending: number;
    completed: number;
    failed: number;
    totalAmount: number;
  }>;
  
  // Utilitaires
  clearError: () => void;
}

export const useTransactions = (): UseTransactionsReturn => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const { user } = useAuth();

  // Charger les transactions au montage
  useEffect(() => {
    if (user) {
      getTransactions();
    }
  }, [user]);

  // Créer une transaction
  const createTransaction = useCallback(async (data: Omit<CreateTransactionData, 'userId'>): Promise<Transaction | null> => {
    if (!user) {
      setError('Utilisateur non connecté');
      return null;
    }

    setIsLoading(true);
    setError(null);

    try {
      const transaction = await transactionService.createTransaction({
        ...data,
        userId: user.id
      });
      
      // Ajouter à la liste locale
      setTransactions(prev => [transaction, ...prev]);
      
      return transaction;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erreur lors de la création de la transaction';
      setError(errorMessage);
      return null;
    } finally {
      setIsLoading(false);
    }
  }, [user]);

  // Récupérer les transactions
  const getTransactions = useCallback(async (filters?: TransactionFilters): Promise<void> => {
    if (!user) {
      setError('Utilisateur non connecté');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const userTransactions = await transactionService.getTransactionsByUserId(user.id, filters);
      setTransactions(userTransactions);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erreur lors de la récupération des transactions';
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  }, [user]);

  // Récupérer une transaction par ID
  const getTransactionById = useCallback(async (id: string): Promise<Transaction | null> => {
    setIsLoading(true);
    setError(null);

    try {
      return await transactionService.getTransactionById(id);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erreur lors de la récupération de la transaction';
      setError(errorMessage);
      return null;
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Mettre à jour le statut d'une transaction
  const updateTransactionStatus = useCallback(async (id: string, status: Transaction['status']): Promise<Transaction | null> => {
    setIsLoading(true);
    setError(null);

    try {
      const updatedTransaction = await transactionService.updateTransactionStatus(id, status);
      
      if (updatedTransaction) {
        // Mettre à jour dans la liste locale
        setTransactions(prev => 
          prev.map(tx => tx.id === id ? updatedTransaction : tx)
        );
      }
      
      return updatedTransaction;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erreur lors de la mise à jour de la transaction';
      setError(errorMessage);
      return null;
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Approuver une transaction (admin)
  const approveTransaction = useCallback(async (id: string): Promise<Transaction | null> => {
    return updateTransactionStatus(id, 'completed');
  }, [updateTransactionStatus]);

  // Rejeter une transaction (admin)
  const rejectTransaction = useCallback(async (id: string): Promise<Transaction | null> => {
    return updateTransactionStatus(id, 'failed');
  }, [updateTransactionStatus]);

  // Supprimer une transaction
  const deleteTransaction = useCallback(async (id: string): Promise<boolean> => {
    setIsLoading(true);
    setError(null);

    try {
      const success = await transactionService.deleteTransaction(id);
      
      if (success) {
        // Retirer de la liste locale
        setTransactions(prev => prev.filter(tx => tx.id !== id));
      }
      
      return success;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erreur lors de la suppression de la transaction';
      setError(errorMessage);
      return false;
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Exporter les transactions
  const exportTransactions = useCallback(async (filters?: TransactionFilters): Promise<string> => {
    setIsLoading(true);
    setError(null);

    try {
      return await transactionService.exportTransactions(filters);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erreur lors de l\'export des transactions';
      setError(errorMessage);
      return '';
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Obtenir les statistiques
  const getStats = useCallback(async (): Promise<{
    total: number;
    pending: number;
    completed: number;
    failed: number;
    totalAmount: number;
  }> => {
    setIsLoading(true);
    setError(null);

    try {
      return await transactionService.getTransactionStats(user?.id);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erreur lors de la récupération des statistiques';
      setError(errorMessage);
      return {
        total: 0,
        pending: 0,
        completed: 0,
        failed: 0,
        totalAmount: 0
      };
    } finally {
      setIsLoading(false);
    }
  }, [user]);

  // Effacer l'erreur
  const clearError = useCallback(() => {
    setError(null);
  }, []);

  return {
    // État
    transactions,
    isLoading,
    error,
    
    // Actions
    createTransaction,
    getTransactions,
    getTransactionById,
    updateTransactionStatus,
    approveTransaction,
    rejectTransaction,
    deleteTransaction,
    exportTransactions,
    getStats,
    
    // Utilitaires
    clearError
  };
};