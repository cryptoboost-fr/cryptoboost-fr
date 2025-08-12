/**
 * Service de gestion des transactions - CryptoBoost
 * Gestion complète des transactions utilisateur
 */

import { db } from './db';

export interface Transaction {
  id: string;
  userId: string;
  type: 'deposit' | 'withdrawal' | 'transfer' | 'investment' | 'exchange';
  amount: number;
  currency: string;
  status: 'pending' | 'completed' | 'failed' | 'cancelled';
  description: string;
  createdAt: Date;
  updatedAt: Date;
  metadata?: Record<string, any>;
}

export interface CreateTransactionData {
  userId: string;
  type: Transaction['type'];
  amount: number;
  currency: string;
  description: string;
  metadata?: Record<string, any>;
}

export interface TransactionFilters {
  userId?: string;
  type?: Transaction['type'];
  status?: Transaction['status'];
  startDate?: Date;
  endDate?: Date;
  minAmount?: number;
  maxAmount?: number;
}

class TransactionService {
  /**
   * Créer une nouvelle transaction
   */
  async createTransaction(data: CreateTransactionData): Promise<Transaction> {
    const transaction: Transaction = {
      id: `tx_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      userId: data.userId,
      type: data.type,
      amount: data.amount,
      currency: data.currency,
      status: 'pending',
      description: data.description,
      createdAt: new Date(),
      updatedAt: new Date(),
      metadata: data.metadata || {}
    };

    // Ajouter à la base de données
    db.transactions.set(transaction.id, transaction);
    
    return transaction;
  }

  /**
   * Récupérer une transaction par ID
   */
  async getTransactionById(id: string): Promise<Transaction | null> {
    return db.transactions.get(id) || null;
  }

  /**
   * Récupérer les transactions d'un utilisateur
   */
  async getTransactionsByUserId(userId: string, filters?: TransactionFilters): Promise<Transaction[]> {
    let transactions = Array.from(db.transactions.values())
      .filter(tx => tx.userId === userId);

    // Appliquer les filtres
    if (filters) {
      if (filters.type) {
        transactions = transactions.filter(tx => tx.type === filters.type);
      }
      if (filters.status) {
        transactions = transactions.filter(tx => tx.status === filters.status);
      }
      if (filters.startDate) {
        transactions = transactions.filter(tx => tx.createdAt >= filters.startDate!);
      }
      if (filters.endDate) {
        transactions = transactions.filter(tx => tx.createdAt <= filters.endDate!);
      }
      if (filters.minAmount) {
        transactions = transactions.filter(tx => tx.amount >= filters.minAmount!);
      }
      if (filters.maxAmount) {
        transactions = transactions.filter(tx => tx.amount <= filters.maxAmount!);
      }
    }

    // Trier par date de création (plus récent en premier)
    return transactions.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
  }

  /**
   * Récupérer toutes les transactions (admin)
   */
  async getAllTransactions(filters?: TransactionFilters): Promise<Transaction[]> {
    let transactions = Array.from(db.transactions.values());

    // Appliquer les filtres
    if (filters) {
      if (filters.userId) {
        transactions = transactions.filter(tx => tx.userId === filters.userId);
      }
      if (filters.type) {
        transactions = transactions.filter(tx => tx.type === filters.type);
      }
      if (filters.status) {
        transactions = transactions.filter(tx => tx.status === filters.status);
      }
      if (filters.startDate) {
        transactions = transactions.filter(tx => tx.createdAt >= filters.startDate!);
      }
      if (filters.endDate) {
        transactions = transactions.filter(tx => tx.createdAt <= filters.endDate!);
      }
      if (filters.minAmount) {
        transactions = transactions.filter(tx => tx.amount >= filters.minAmount!);
      }
      if (filters.maxAmount) {
        transactions = transactions.filter(tx => tx.amount <= filters.maxAmount!);
      }
    }

    return transactions.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
  }

  /**
   * Mettre à jour le statut d'une transaction
   */
  async updateTransactionStatus(id: string, status: Transaction['status']): Promise<Transaction | null> {
    const transaction = db.transactions.get(id);
    if (!transaction) {
      return null;
    }

    transaction.status = status;
    transaction.updatedAt = new Date();
    db.transactions.set(id, transaction);

    return transaction;
  }

  /**
   * Approuver une transaction (admin)
   */
  async approveTransaction(id: string): Promise<Transaction | null> {
    return this.updateTransactionStatus(id, 'completed');
  }

  /**
   * Rejeter une transaction (admin)
   */
  async rejectTransaction(id: string): Promise<Transaction | null> {
    return this.updateTransactionStatus(id, 'failed');
  }

  /**
   * Supprimer une transaction
   */
  async deleteTransaction(id: string): Promise<boolean> {
    return db.transactions.delete(id);
  }

  /**
   * Obtenir les statistiques des transactions
   */
  async getTransactionStats(userId?: string): Promise<{
    total: number;
    pending: number;
    completed: number;
    failed: number;
    totalAmount: number;
  }> {
    let transactions = Array.from(db.transactions.values());
    
    if (userId) {
      transactions = transactions.filter(tx => tx.userId === userId);
    }

    const stats = {
      total: transactions.length,
      pending: transactions.filter(tx => tx.status === 'pending').length,
      completed: transactions.filter(tx => tx.status === 'completed').length,
      failed: transactions.filter(tx => tx.status === 'failed').length,
      totalAmount: transactions
        .filter(tx => tx.status === 'completed')
        .reduce((sum, tx) => sum + tx.amount, 0)
    };

    return stats;
  }

  /**
   * Exporter les transactions
   */
  async exportTransactions(filters?: TransactionFilters): Promise<string> {
    const transactions = await this.getAllTransactions(filters);
    
    // Format CSV
    const headers = ['ID', 'User ID', 'Type', 'Amount', 'Currency', 'Status', 'Description', 'Created At'];
    const rows = transactions.map(tx => [
      tx.id,
      tx.userId,
      tx.type,
      tx.amount.toString(),
      tx.currency,
      tx.status,
      tx.description,
      tx.createdAt.toISOString()
    ]);

    const csv = [headers, ...rows]
      .map(row => row.map(field => `"${field}"`).join(','))
      .join('\n');

    return csv;
  }
}

export const transactionService = new TransactionService();