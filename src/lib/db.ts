/**
 * Configuration de la base de données - CryptoBoost
 * Gestion de la connexion et des opérations de base de données
 */

// Types pour la base de données
export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: 'client' | 'admin';
  createdAt: Date;
  updatedAt: Date;
}

export interface Transaction {
  id: string;
  userId: string;
  type: 'deposit' | 'withdrawal' | 'transfer' | 'investment' | 'exchange';
  amount: number;
  currency: string;
  status: 'pending' | 'completed' | 'failed' | 'cancelled';
  description: string;
  fromWalletId?: string;
  toWalletId?: string;
  createdAt: Date;
  updatedAt: Date;
  metadata?: Record<string, any>;
}

export interface Wallet {
  id: string;
  userId: string;
  name: string;
  type: 'bitcoin' | 'ethereum' | 'usdt' | 'eur' | 'usd';
  address?: string;
  balance: number;
  currency: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt?: Date;
  metadata?: Record<string, any>;
}

// Configuration de la base de données
export class Database {
  private static instance: Database;
  public users: Map<string, User> = new Map();
  public transactions: Map<string, Transaction> = new Map();
  public wallets: Map<string, Wallet> = new Map();

  private constructor() {
    this.initializeData();
  }

  public static getInstance(): Database {
    if (!Database.instance) {
      Database.instance = new Database();
    }
    return Database.instance;
  }

  // Initialisation avec des données de test
  private initializeData() {
    // Utilisateurs de test
    const testUsers: User[] = [
      {
        id: '1',
        email: 'admin@cryptoboost.world',
        firstName: 'Admin',
        lastName: 'CryptoBoost',
        role: 'admin',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: '2',
        email: 'client@cryptoboost.world',
        firstName: 'Client',
        lastName: 'Test',
        role: 'client',
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ];

    // Wallets de test
    const testWallets: Wallet[] = [
      {
        id: '1',
        userId: '1',
        name: 'Portefeuille Principal',
        type: 'usd',
        balance: 10000,
        currency: 'USD',
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: '2',
        userId: '2',
        name: 'Portefeuille Bitcoin',
        type: 'bitcoin',
        balance: 5000,
        currency: 'USD',
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ];

    // Transactions de test
    const testTransactions: Transaction[] = [
      {
        id: '1',
        userId: '1',
        type: 'deposit',
        amount: 10000,
        currency: 'USD',
        status: 'completed',
        description: 'Dépôt initial',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: '2',
        userId: '2',
        type: 'deposit',
        amount: 5000,
        currency: 'USD',
        status: 'completed',
        description: 'Dépôt initial',
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ];

    // Ajouter les données de test
    testUsers.forEach(user => this.users.set(user.id, user));
    testWallets.forEach(wallet => this.wallets.set(wallet.id, wallet));
    testTransactions.forEach(transaction => this.transactions.set(transaction.id, transaction));
  }

  // Opérations sur les utilisateurs
  async getUserById(id: string): Promise<User | null> {
    return this.users.get(id) || null;
  }

  async getUserByEmail(email: string): Promise<User | null> {
    for (const user of this.users.values()) {
      if (user.email === email) {
        return user;
      }
    }
    return null;
  }

  async createUser(userData: Omit<User, 'id' | 'createdAt' | 'updatedAt'>): Promise<User> {
    const id = Date.now().toString();
    const now = new Date();
    const user: User = {
      ...userData,
      id,
      createdAt: now,
      updatedAt: now
    };
    this.users.set(id, user);
    return user;
  }

  async updateUser(id: string, updates: Partial<User>): Promise<User | null> {
    const user = this.users.get(id);
    if (!user) return null;

    const updatedUser: User = {
      ...user,
      ...updates,
      updatedAt: new Date()
    };
    this.users.set(id, updatedUser);
    return updatedUser;
  }

  // Opérations sur les wallets
  async getWalletByUserId(userId: string): Promise<Wallet | null> {
    for (const wallet of this.wallets.values()) {
      if (wallet.userId === userId) {
        return wallet;
      }
    }
    return null;
  }

  async updateWalletBalance(userId: string, newBalance: number): Promise<Wallet | null> {
    for (const [id, wallet] of this.wallets.entries()) {
      if (wallet.userId === userId) {
        const updatedWallet: Wallet = {
          ...wallet,
          balance: newBalance,
          updatedAt: new Date()
        };
        this.wallets.set(id, updatedWallet);
        return updatedWallet;
      }
    }
    return null;
  }

  // Opérations sur les transactions
  async getTransactionsByUserId(userId: string): Promise<Transaction[]> {
    return Array.from(this.transactions.values()).filter(t => t.userId === userId);
  }

  async createTransaction(transactionData: Omit<Transaction, 'id' | 'createdAt'>): Promise<Transaction> {
    const id = Date.now().toString();
    const transaction: Transaction = {
      ...transactionData,
      id,
      createdAt: new Date()
    };
    this.transactions.set(id, transaction);
    return transaction;
  }

  // Opérations de synchronisation
  async syncData(): Promise<void> {
    // Simulation de synchronisation avec une base de données externe
    console.log('Synchronisation des données...');
    await new Promise(resolve => setTimeout(resolve, 100));
    console.log('Données synchronisées avec succès');
  }

  // Opérations de nettoyage
  async clearData(): Promise<void> {
    this.users.clear();
    this.transactions.clear();
    this.wallets.clear();
  }

  // Statistiques
  async getStats(): Promise<{
    totalUsers: number;
    totalTransactions: number;
    totalWallets: number;
  }> {
    return {
      totalUsers: this.users.size,
      totalTransactions: this.transactions.size,
      totalWallets: this.wallets.size
    };
  }
}

// Export de l'instance singleton
export const db = Database.getInstance();