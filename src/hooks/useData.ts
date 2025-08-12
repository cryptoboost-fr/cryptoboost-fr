import { useState, useEffect, useCallback } from 'react';
import { useToast } from '@/components/ui/toaster';
import { userApi, investmentApi, transactionApi, adminApi } from '@/lib/supabase';
import type { User, InvestmentPlan, Transaction, UserInvestment, CryptoWallet, Notification } from '@/types';

// Hook pour les utilisateurs
export const useUsers = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  const fetchUsers = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await adminApi.getAllUsers();
      setUsers(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur lors du chargement des utilisateurs');
      toast('Erreur lors du chargement des utilisateurs', 'error');
    } finally {
      setLoading(false);
    }
  }, [toast]);

  const createUser = useCallback(async (userData: Partial<User>) => {
    try {
      const newUser = await userApi.createUser(userData);
      if (newUser) {
        setUsers(prev => [newUser, ...prev]);
        toast('Utilisateur créé avec succès', 'success');
        return newUser;
      }
      throw new Error('Failed to create user');
    } catch (err) {
      toast('Erreur lors de la création de l\'utilisateur', 'error');
      throw err;
    }
  }, [toast]);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  return { users, loading, error, fetchUsers, createUser };
};

// Hook pour les plans d'investissement
export const useInvestmentPlans = () => {
  const [plans, setPlans] = useState<InvestmentPlan[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  const fetchPlans = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await investmentApi.getActivePlans();
      setPlans(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur lors du chargement des plans');
      toast('Erreur lors du chargement des plans', 'error');
    } finally {
      setLoading(false);
    }
  }, [toast]);

  const createPlan = useCallback(async (planData: Omit<InvestmentPlan, 'id' | 'created_at'>) => {
    try {
      const newPlan = await investmentApi.createPlan(planData);
      if (newPlan) {
        toast('Plan d\'investissement créé avec succès !', 'success');
        // Recharger la liste des plans
        fetchPlans();
        return newPlan;
      } else {
        toast('Erreur lors de la création du plan', 'error');
        return null;
      }
    } catch (err) {
      toast('Erreur lors de la création du plan', 'error');
      throw err;
    }
  }, [toast]);

  const updatePlan = useCallback(async (id: string, updates: Partial<InvestmentPlan>) => {
    try {
      const updatedPlan = await investmentApi.updatePlan(id, updates);
      if (updatedPlan) {
        toast('Plan d\'investissement mis à jour avec succès !', 'success');
        // Recharger la liste des plans
        fetchPlans();
        return updatedPlan;
      } else {
        toast('Erreur lors de la mise à jour du plan', 'error');
        return null;
      }
    } catch (err) {
      toast('Erreur lors de la mise à jour du plan', 'error');
      throw err;
    }
  }, [toast]);

  useEffect(() => {
    fetchPlans();
  }, [fetchPlans]);

  return { plans, loading, error, fetchPlans, createPlan, updatePlan };
};

// Hook pour les transactions
export const useTransactions = () => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  const fetchTransactions = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      // Note: getUserTransactions requires userId parameter in lib/supabase.ts
      // This would need to be updated to get current user ID first
      const data = await transactionApi.getPendingTransactions(); // Using available function
      setTransactions(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur lors du chargement des transactions');
      toast('Erreur lors du chargement des transactions', 'error');
    } finally {
      setLoading(false);
    }
  }, [toast]);

  const createTransaction = useCallback(async (transactionData: Omit<Transaction, 'id' | 'created_at'>) => {
    try {
      const newTransaction = await transactionApi.createTransaction(transactionData);
      if (newTransaction) {
        setTransactions(prev => [newTransaction, ...prev]);
        toast('Transaction créée avec succès', 'success');
        return newTransaction;
      }
      throw new Error('Failed to create transaction');
    } catch (err) {
      toast('Erreur lors de la création de la transaction', 'error');
      throw err;
    }
  }, [toast]);

  useEffect(() => {
    fetchTransactions();
  }, [fetchTransactions]);

  return { transactions, loading, error, fetchTransactions, createTransaction };
};

// Hook pour les investissements
export const useInvestments = () => {
  const [investments, setInvestments] = useState<UserInvestment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  const fetchInvestments = useCallback(async (userId?: string) => {
    try {
      setLoading(true);
      setError(null);

      if (userId) {
        // Récupérer les investissements d'un utilisateur spécifique
        const data = await userApi.getUserInvestments(userId);
        setInvestments(data);
      } else {
        // Récupérer tous les investissements (admin)
        const data = await adminApi.getAllInvestments();
        setInvestments(data);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur lors du chargement des investissements');
      toast('Erreur lors du chargement des investissements', 'error');
    } finally {
      setLoading(false);
    }
  }, [toast]);

  const createInvestment = useCallback(async (investmentData: Omit<UserInvestment, 'id' | 'created_at'>) => {
    try {
      const newInvestment = await investmentApi.createInvestment(investmentData);
      if (newInvestment) {
        setInvestments(prev => [newInvestment, ...prev]);
        toast('Investissement créé avec succès', 'success');
        return newInvestment;
      }
      throw new Error('Failed to create investment');
    } catch (err) {
      toast('Erreur lors de la création de l\'investissement', 'error');
      throw err;
    }
  }, [toast]);

  useEffect(() => {
    fetchInvestments();
  }, [fetchInvestments]);

  return { investments, loading, error, fetchInvestments, createInvestment };
};

// Hook pour les wallets crypto
export const useCryptoWallets = () => {
  const [wallets, setWallets] = useState<CryptoWallet[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  const fetchWallets = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await cryptoWalletService.getUserWallets();
      setWallets(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur lors du chargement des wallets');
      toast('Erreur lors du chargement des wallets', 'error');
    } finally {
      setLoading(false);
    }
  }, [toast]);

  const createWallet = useCallback(async (walletData: Omit<CryptoWallet, 'id' | 'created_at' | 'updated_at'>) => {
    try {
      const newWallet = await cryptoWalletService.createWallet(walletData);
      setWallets(prev => [newWallet, ...prev]);
      toast('Wallet créé avec succès', 'success');
      return newWallet;
    } catch (err) {
      toast('Erreur lors de la création du wallet', 'error');
      throw err;
    }
  }, [toast]);

  useEffect(() => {
    fetchWallets();
  }, [fetchWallets]);

  return { wallets, loading, error, fetchWallets, createWallet };
};

// Hook pour les notifications
export const useNotifications = () => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  const fetchNotifications = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await notificationService.getUserNotifications();
      setNotifications(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur lors du chargement des notifications');
      toast('Erreur lors du chargement des notifications', 'error');
    } finally {
      setLoading(false);
    }
  }, [toast]);

  const markAsRead = useCallback(async (notificationId: string) => {
    try {
      await notificationService.markAsRead(notificationId);
      setNotifications(prev => 
        prev.map(notification => 
          notification.id === notificationId 
            ? { ...notification, is_read: true }
            : notification
        )
      );
    } catch (err) {
      toast('Erreur lors de la mise à jour de la notification', 'error');
    }
  }, [toast]);

  const createNotification = useCallback(async (notificationData: Omit<Notification, 'id' | 'created_at'>) => {
    try {
      const newNotification = await notificationService.createNotification(notificationData);
      setNotifications(prev => [newNotification, ...prev]);
      return newNotification;
    } catch (err) {
      toast('Erreur lors de la création de la notification', 'error');
      throw err;
    }
  }, [toast]);

  useEffect(() => {
    fetchNotifications();
  }, [fetchNotifications]);

  return { 
    notifications, 
    loading, 
    error, 
    fetchNotifications, 
    markAsRead, 
    createNotification 
  };
};

// Hook pour les logs système (admin seulement)
export const useSystemLogs = () => {
  const [logs, setLogs] = useState<SystemLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  const fetchLogs = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await systemLogService.getAllLogs();
      setLogs(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur lors du chargement des logs');
      toast('Erreur lors du chargement des logs', 'error');
    } finally {
      setLoading(false);
    }
  }, [toast]);

  useEffect(() => {
    fetchLogs();
  }, [fetchLogs]);

  return { logs, loading, error, fetchLogs };
};

// Hook pour le profil utilisateur
export const useProfile = () => {
  const [profile, setProfile] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  const fetchProfile = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await userService.getCurrentUser();
      setProfile(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur lors du chargement du profil');
      toast('Erreur lors du chargement du profil', 'error');
    } finally {
      setLoading(false);
    }
  }, [toast]);

  const updateProfile = useCallback(async (updates: Partial<User>) => {
    try {
      const updatedProfile = await userService.updateProfile(updates);
      setProfile(updatedProfile);
      toast('Profil mis à jour avec succès', 'success');
      return updatedProfile;
    } catch (err) {
      toast('Erreur lors de la mise à jour du profil', 'error');
      throw err;
    }
  }, [toast]);

  useEffect(() => {
    fetchProfile();
  }, [fetchProfile]);

  return { profile, loading, error, fetchProfile, updateProfile };
};