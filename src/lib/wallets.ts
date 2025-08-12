/**
 * Service de gestion des wallets - CryptoBoost
 * Gestion complète des portefeuilles crypto
 */

import { db, Wallet } from './db';

export interface CreateWalletData {
  userId: string;
  name: string;
  type: Wallet['type'];
  currency: string;
  metadata?: Record<string, any>;
}

export interface TransferData {
  fromWalletId: string;
  toWalletId: string;
  amount: number;
  description?: string;
}

class WalletService {
  /**
   * Créer un nouveau wallet
   */
  async createWallet(data: CreateWalletData): Promise<Wallet> {
    const wallet: Wallet = {
      id: `wallet_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      userId: data.userId,
      name: data.name,
      type: data.type,
      address: this.generateAddress(data.type),
      balance: 0,
      currency: data.currency,
      isActive: true,
      createdAt: new Date(),
      updatedAt: new Date(),
      metadata: data.metadata || {}
    };

    // Ajouter à la base de données
    db.wallets.set(wallet.id, wallet);
    
    return wallet;
  }

  /**
   * Générer une adresse crypto
   */
  private generateAddress(type: Wallet['type']): string {
    const prefix = {
      bitcoin: 'bc1',
      ethereum: '0x',
      usdt: 'T',
      eur: 'EUR',
      usd: 'USD'
    }[type];

    const randomPart = Math.random().toString(36).substr(2, 20);
    return `${prefix}${randomPart}`;
  }

  /**
   * Récupérer un wallet par ID
   */
  async getWalletById(id: string): Promise<Wallet | null> {
    return db.wallets.get(id) || null;
  }

  /**
   * Récupérer les wallets d'un utilisateur
   */
  async getWalletsByUserId(userId: string): Promise<Wallet[]> {
    return Array.from(db.wallets.values())
      .filter(wallet => wallet.userId === userId && wallet.isActive)
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
  }

  /**
   * Récupérer tous les wallets (admin)
   */
  async getAllWallets(): Promise<Wallet[]> {
    return Array.from(db.wallets.values())
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
  }

  /**
   * Mettre à jour un wallet
   */
  async updateWallet(id: string, updates: Partial<Wallet>): Promise<Wallet | null> {
    const wallet = db.wallets.get(id);
    if (!wallet) {
      return null;
    }

    const updatedWallet = {
      ...wallet,
      ...updates,
      updatedAt: new Date()
    };

    db.wallets.set(id, updatedWallet);
    return updatedWallet;
  }

  /**
   * Supprimer un wallet (désactiver)
   */
  async deleteWallet(id: string): Promise<boolean> {
    const wallet = db.wallets.get(id);
    if (!wallet) {
      return false;
    }

    wallet.isActive = false;
    wallet.updatedAt = new Date();
    db.wallets.set(id, wallet);

    return true;
  }

  /**
   * Ajouter des fonds à un wallet
   */
  async addFunds(walletId: string, amount: number): Promise<Wallet | null> {
    const wallet = db.wallets.get(walletId);
    if (!wallet || !wallet.isActive) {
      return null;
    }

    wallet.balance += amount;
    wallet.updatedAt = new Date();
    db.wallets.set(walletId, wallet);

    return wallet;
  }

  /**
   * Retirer des fonds d'un wallet
   */
  async withdrawFunds(walletId: string, amount: number): Promise<Wallet | null> {
    const wallet = db.wallets.get(walletId);
    if (!wallet || !wallet.isActive) {
      return null;
    }

    if (wallet.balance < amount) {
      throw new Error('Solde insuffisant');
    }

    wallet.balance -= amount;
    wallet.updatedAt = new Date();
    db.wallets.set(walletId, wallet);

    return wallet;
  }

  /**
   * Transférer des fonds entre wallets
   */
  async transferFunds(data: TransferData): Promise<{
    fromWallet: Wallet;
    toWallet: Wallet;
  } | null> {
    const fromWallet = db.wallets.get(data.fromWalletId);
    const toWallet = db.wallets.get(data.toWalletId);

    if (!fromWallet || !toWallet || !fromWallet.isActive || !toWallet.isActive) {
      return null;
    }

    if (fromWallet.balance < data.amount) {
      throw new Error('Solde insuffisant pour le transfert');
    }

    // Effectuer le transfert
    fromWallet.balance -= data.amount;
    toWallet.balance += data.amount;
    
    fromWallet.updatedAt = new Date();
    toWallet.updatedAt = new Date();

    db.wallets.set(data.fromWalletId, fromWallet);
    db.wallets.set(data.toWalletId, toWallet);

    return { fromWallet, toWallet };
  }

  /**
   * Obtenir le solde total d'un utilisateur
   */
  async getTotalBalance(userId: string): Promise<{
    total: number;
    byCurrency: Record<string, number>;
  }> {
    const wallets = await this.getWalletsByUserId(userId);
    
    const byCurrency: Record<string, number> = {};
    let total = 0;

    wallets.forEach(wallet => {
      byCurrency[wallet.currency] = (byCurrency[wallet.currency] || 0) + wallet.balance;
      total += wallet.balance;
    });

    return { total, byCurrency };
  }

  /**
   * Obtenir les statistiques des wallets
   */
  async getWalletStats(): Promise<{
    totalWallets: number;
    activeWallets: number;
    totalBalance: number;
    byType: Record<string, number>;
  }> {
    const wallets = Array.from(db.wallets.values());
    
    const stats = {
      totalWallets: wallets.length,
      activeWallets: wallets.filter(w => w.isActive).length,
      totalBalance: wallets.reduce((sum, w) => sum + w.balance, 0),
      byType: {} as Record<string, number>
    };

    wallets.forEach(wallet => {
      stats.byType[wallet.type] = (stats.byType[wallet.type] || 0) + wallet.balance;
    });

    return stats;
  }

  /**
   * Synchroniser les soldes avec un service externe
   */
  async syncBalances(): Promise<void> {
    const wallets = Array.from(db.wallets.values());
    
    // Simulation de synchronisation avec un service externe
    for (const wallet of wallets) {
      if (wallet.type === 'bitcoin' || wallet.type === 'ethereum') {
        // Simuler une mise à jour de solde
        const randomChange = (Math.random() - 0.5) * 0.01; // ±0.5%
        wallet.balance *= (1 + randomChange);
        wallet.updatedAt = new Date();
        db.wallets.set(wallet.id, wallet);
      }
    }
  }
}

export const walletService = new WalletService();