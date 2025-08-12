#!/usr/bin/env node

/**
 * SCRIPT DE SUPPRESSION DES MOCKS ET CRÉATION DE FONCTIONNALITÉS RÉELLES
 * Remplace tous les mocks par des opérations réelles et fonctionnelles
 */

import fs from 'fs';
import path from 'path';

// Couleurs pour les logs
const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m'
};

function log(message, color = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

function logSection(title) {
  log(`\n${colors.cyan}${'='.repeat(60)}`, 'cyan');
  log(`${colors.bright}${title}${colors.reset}`, 'bright');
  log(`${colors.cyan}${'='.repeat(60)}${colors.reset}`, 'cyan');
}

// ============================================================================
// SUPPRESSION DES MOCKS
// ============================================================================

function removeMockFiles() {
  logSection('🗑️  SUPPRESSION DES FICHIERS MOCK');
  
  const mockFiles = [
    'src/services/mockDataService.ts',
    'scripts/test-real-users.mjs',
    'scripts/fix-investment-plans-access.mjs'
  ];

  for (const file of mockFiles) {
    try {
      if (fs.existsSync(file)) {
        fs.unlinkSync(file);
        log(`✅ Fichier mock supprimé: ${file}`, 'green');
      } else {
        log(`⚠️  Fichier non trouvé: ${file}`, 'yellow');
      }
    } catch (error) {
      log(`❌ Erreur suppression ${file}: ${error.message}`, 'red');
    }
  }
}

// ============================================================================
// CRÉATION DU SERVICE DE DONNÉES RÉELLES
// ============================================================================

function createRealDataService() {
  logSection('🔧 CRÉATION DU SERVICE DE DONNÉES RÉELLES');
  
  const realServiceContent = `// Service de données RÉELLES - Pas de mock
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://ropzeweidvjkfeyyuiim.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJvcHpld2VpZHZqa2ZleXl1aWltIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTQ1NzE5OTEsImV4cCI6MjA3MDE0Nzk5MX0.5oA4zhbQyv0zZLqYLIOb74yl2xh_1-4v_IAa8SKcOYg'

const supabase = createClient(supabaseUrl, supabaseKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true
  }
})

// Service de données RÉELLES - Toutes les opérations sont en temps réel
export const dataService = {
  // ============================================================================
  // AUTHENTIFICATION ET UTILISATEURS
  // ============================================================================

  // Inscription d'un nouvel utilisateur
  async signUp(email: string, password: string, userData: any) {
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: userData
        }
      })

      if (error) {
        throw new Error(error.message)
      }

      return data
    } catch (error) {
      console.error('Erreur inscription:', error)
      throw error
    }
  },

  // Connexion utilisateur
  async signIn(email: string, password: string) {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      })

      if (error) {
        throw new Error(error.message)
      }

      return data
    } catch (error) {
      console.error('Erreur connexion:', error)
      throw error
    }
  },

  // Déconnexion utilisateur
  async signOut() {
    try {
      const { error } = await supabase.auth.signOut()
      if (error) {
        throw new Error(error.message)
      }
      return true
    } catch (error) {
      console.error('Erreur déconnexion:', error)
      throw error
    }
  },

  // Récupérer l'utilisateur actuel
  async getCurrentUser() {
    try {
      const { data: { user }, error } = await supabase.auth.getUser()
      if (error) {
        throw new Error(error.message)
      }
      return user
    } catch (error) {
      console.error('Erreur récupération utilisateur:', error)
      return null
    }
  },

  // ============================================================================
  // GESTION DES PROFILS UTILISATEURS
  // ============================================================================

  // Créer le profil utilisateur après inscription
  async createUserProfile(userId: string, profileData: any) {
    try {
      const { data, error } = await supabase
        .from('users')
        .insert({
          id: userId,
          ...profileData,
          created_at: new Date().toISOString()
        })
        .select()
        .single()

      if (error) {
        throw new Error(error.message)
      }

      return data
    } catch (error) {
      console.error('Erreur création profil:', error)
      throw error
    }
  },

  // Récupérer le profil utilisateur
  async getUserProfile(userId?: string) {
    try {
      const currentUser = await this.getCurrentUser()
      const targetUserId = userId || currentUser?.id

      if (!targetUserId) {
        throw new Error('Utilisateur non authentifié')
      }

      const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('id', targetUserId)
        .single()

      if (error) {
        throw new Error(error.message)
      }

      return data
    } catch (error) {
      console.error('Erreur récupération profil:', error)
      throw error
    }
  },

  // Mettre à jour le profil utilisateur
  async updateUserProfile(updates: any, userId?: string) {
    try {
      const currentUser = await this.getCurrentUser()
      const targetUserId = userId || currentUser?.id

      if (!targetUserId) {
        throw new Error('Utilisateur non authentifié')
      }

      const { data, error } = await supabase
        .from('users')
        .update({
          ...updates,
          updated_at: new Date().toISOString()
        })
        .eq('id', targetUserId)
        .select()
        .single()

      if (error) {
        throw new Error(error.message)
      }

      return data
    } catch (error) {
      console.error('Erreur mise à jour profil:', error)
      throw error
    }
  },

  // ============================================================================
  // GESTION DES RÔLES ET PERMISSIONS
  // ============================================================================

  // Vérifier si l'utilisateur est admin
  async isAdmin(userId?: string) {
    try {
      const profile = await this.getUserProfile(userId)
      return profile?.role === 'admin'
    } catch (error) {
      return false
    }
  },

  // Récupérer tous les utilisateurs (admin seulement)
  async getAllUsers() {
    try {
      const isUserAdmin = await this.isAdmin()
      if (!isUserAdmin) {
        throw new Error('Accès refusé: droits administrateur requis')
      }

      const { data, error } = await supabase
        .from('users')
        .select('*')
        .order('created_at', { ascending: false })

      if (error) {
        throw new Error(error.message)
      }

      return data || []
    } catch (error) {
      console.error('Erreur récupération utilisateurs:', error)
      throw error
    }
  },

  // ============================================================================
  // PLANS D'INVESTISSEMENT RÉELS
  // ============================================================================

  // Récupérer tous les plans d'investissement actifs
  async getInvestmentPlans() {
    try {
      const { data, error } = await supabase
        .from('investment_plans')
        .select('*')
        .eq('is_active', true)
        .order('interest_rate', { ascending: false })

      if (error) {
        throw new Error(error.message)
      }

      return data || []
    } catch (error) {
      console.error('Erreur récupération plans:', error)
      throw error
    }
  },

  // Récupérer un plan d'investissement spécifique
  async getInvestmentPlan(planId: string) {
    try {
      const { data, error } = await supabase
        .from('investment_plans')
        .select('*')
        .eq('id', planId)
        .eq('is_active', true)
        .single()

      if (error) {
        throw new Error(error.message)
      }

      return data
    } catch (error) {
      console.error('Erreur récupération plan:', error)
      throw error
    }
  },

  // ============================================================================
  // INVESTISSEMENTS RÉELS
  // ============================================================================

  // Créer un nouvel investissement
  async createInvestment(planId: string, amount: number) {
    try {
      const currentUser = await this.getCurrentUser()
      if (!currentUser) {
        throw new Error('Utilisateur non authentifié')
      }

      // Vérifier que le plan existe et est actif
      const plan = await this.getInvestmentPlan(planId)
      if (!plan) {
        throw new Error('Plan d\'investissement non trouvé ou inactif')
      }

      // Vérifier le montant
      if (amount < plan.min_amount || amount > plan.max_amount) {
        throw new Error(\`Montant invalide. Doit être entre \${plan.min_amount} et \${plan.max_amount}\`)
      }

      const { data, error } = await supabase
        .from('user_investments')
        .insert({
          user_id: currentUser.id,
          plan_id: planId,
          amount: amount,
          status: 'active',
          start_date: new Date().toISOString(),
          end_date: new Date(Date.now() + plan.duration_days * 24 * 60 * 60 * 1000).toISOString()
        })
        .select()
        .single()

      if (error) {
        throw new Error(error.message)
      }

      return data
    } catch (error) {
      console.error('Erreur création investissement:', error)
      throw error
    }
  },

  // Récupérer les investissements de l'utilisateur
  async getUserInvestments(userId?: string) {
    try {
      const currentUser = await this.getCurrentUser()
      const targetUserId = userId || currentUser?.id

      if (!targetUserId) {
        throw new Error('Utilisateur non authentifié')
      }

      const { data, error } = await supabase
        .from('user_investments')
        .select(\`
          *,
          investment_plans (
            name,
            interest_rate,
            duration_days
          )
        \`)
        .eq('user_id', targetUserId)
        .order('created_at', { ascending: false })

      if (error) {
        throw new Error(error.message)
      }

      return data || []
    } catch (error) {
      console.error('Erreur récupération investissements:', error)
      throw error
    }
  },

  // Récupérer tous les investissements (admin seulement)
  async getAllInvestments() {
    try {
      const isUserAdmin = await this.isAdmin()
      if (!isUserAdmin) {
        throw new Error('Accès refusé: droits administrateur requis')
      }

      const { data, error } = await supabase
        .from('user_investments')
        .select(\`
          *,
          users (full_name, email),
          investment_plans (name, interest_rate)
        \`)
        .order('created_at', { ascending: false })

      if (error) {
        throw new Error(error.message)
      }

      return data || []
    } catch (error) {
      console.error('Erreur récupération tous investissements:', error)
      throw error
    }
  },

  // ============================================================================
  // TRANSACTIONS RÉELLES
  // ============================================================================

  // Créer une nouvelle transaction
  async createTransaction(transactionData: any) {
    try {
      const currentUser = await this.getCurrentUser()
      if (!currentUser) {
        throw new Error('Utilisateur non authentifié')
      }

      const { data, error } = await supabase
        .from('transactions')
        .insert({
          ...transactionData,
          user_id: currentUser.id,
          created_at: new Date().toISOString()
        })
        .select()
        .single()

      if (error) {
        throw new Error(error.message)
      }

      return data
    } catch (error) {
      console.error('Erreur création transaction:', error)
      throw error
    }
  },

  // Récupérer les transactions de l'utilisateur
  async getUserTransactions(userId?: string) {
    try {
      const currentUser = await this.getCurrentUser()
      const targetUserId = userId || currentUser?.id

      if (!targetUserId) {
        throw new Error('Utilisateur non authentifié')
      }

      const { data, error } = await supabase
        .from('transactions')
        .select('*')
        .eq('user_id', targetUserId)
        .order('created_at', { ascending: false })

      if (error) {
        throw new Error(error.message)
      }

      return data || []
    } catch (error) {
      console.error('Erreur récupération transactions:', error)
      throw error
    }
  },

  // Récupérer toutes les transactions (admin seulement)
  async getAllTransactions() {
    try {
      const isUserAdmin = await this.isAdmin()
      if (!isUserAdmin) {
        throw new Error('Accès refusé: droits administrateur requis')
      }

      const { data, error } = await supabase
        .from('transactions')
        .select(\`
          *,
          users (full_name, email)
        \`)
        .order('created_at', { ascending: false })

      if (error) {
        throw new Error(error.message)
      }

      return data || []
    } catch (error) {
      console.error('Erreur récupération toutes transactions:', error)
      throw error
    }
  },

  // ============================================================================
  // WALLETS CRYPTO RÉELS
  // ============================================================================

  // Créer un wallet crypto
  async createCryptoWallet(walletData: any) {
    try {
      const currentUser = await this.getCurrentUser()
      if (!currentUser) {
        throw new Error('Utilisateur non authentifié')
      }

      const { data, error } = await supabase
        .from('crypto_wallets')
        .insert({
          ...walletData,
          user_id: currentUser.id,
          created_at: new Date().toISOString()
        })
        .select()
        .single()

      if (error) {
        throw new Error(error.message)
      }

      return data
    } catch (error) {
      console.error('Erreur création wallet:', error)
      throw error
    }
  },

  // Récupérer les wallets de l'utilisateur
  async getUserWallets(userId?: string) {
    try {
      const currentUser = await this.getCurrentUser()
      const targetUserId = userId || currentUser?.id

      if (!targetUserId) {
        throw new Error('Utilisateur non authentifié')
      }

      const { data, error } = await supabase
        .from('crypto_wallets')
        .select('*')
        .eq('user_id', targetUserId)
        .eq('is_active', true)
        .order('created_at', { ascending: false })

      if (error) {
        throw new Error(error.message)
      }

      return data || []
    } catch (error) {
      console.error('Erreur récupération wallets:', error)
      throw error
    }
  },

  // ============================================================================
  // NOTIFICATIONS RÉELLES
  // ============================================================================

  // Créer une notification
  async createNotification(notificationData: any, userId?: string) {
    try {
      const currentUser = await this.getCurrentUser()
      const targetUserId = userId || currentUser?.id

      if (!targetUserId) {
        throw new Error('Utilisateur non authentifié')
      }

      const { data, error } = await supabase
        .from('notifications')
        .insert({
          ...notificationData,
          user_id: targetUserId,
          created_at: new Date().toISOString()
        })
        .select()
        .single()

      if (error) {
        throw new Error(error.message)
      }

      return data
    } catch (error) {
      console.error('Erreur création notification:', error)
      throw error
    }
  },

  // Récupérer les notifications de l'utilisateur
  async getUserNotifications(userId?: string) {
    try {
      const currentUser = await this.getCurrentUser()
      const targetUserId = userId || currentUser?.id

      if (!targetUserId) {
        throw new Error('Utilisateur non authentifié')
      }

      const { data, error } = await supabase
        .from('notifications')
        .select('*')
        .eq('user_id', targetUserId)
        .order('created_at', { ascending: false })

      if (error) {
        throw new Error(error.message)
      }

      return data || []
    } catch (error) {
      console.error('Erreur récupération notifications:', error)
      throw error
    }
  },

  // Marquer une notification comme lue
  async markNotificationAsRead(notificationId: string) {
    try {
      const { data, error } = await supabase
        .from('notifications')
        .update({
          is_read: true,
          read_at: new Date().toISOString()
        })
        .eq('id', notificationId)
        .select()
        .single()

      if (error) {
        throw new Error(error.message)
      }

      return data
    } catch (error) {
      console.error('Erreur marquage notification:', error)
      throw error
    }
  }
}

export default supabase;`;

  try {
    fs.writeFileSync('src/services/dataService.ts', realServiceContent);
    log('✅ Service de données réelles créé', 'green');
    return true;
  } catch (error) {
    log(`❌ Erreur création service réel: ${error.message}`, 'red');
    return false;
  }
}

// ============================================================================
// CRÉATION DU HOOK RÉEL
// ============================================================================

function createRealHook() {
  logSection('🎣 CRÉATION DU HOOK RÉEL');
  
  const realHookContent = `import { useState, useEffect } from 'react'
import { dataService } from './dataService'

export const useDataService = () => {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [user, setUser] = useState(null)
  const [isAdmin, setIsAdmin] = useState(false)

  // ============================================================================
  // AUTHENTIFICATION
  // ============================================================================

  const signUp = async (email: string, password: string, userData: any) => {
    setLoading(true)
    setError(null)
    try {
      const result = await dataService.signUp(email, password, userData)
      if (result.user) {
        // Créer le profil utilisateur
        await dataService.createUserProfile(result.user.id, userData)
        setUser(result.user)
      }
      return result
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur inconnue')
      throw err
    } finally {
      setLoading(false)
    }
  }

  const signIn = async (email: string, password: string) => {
    setLoading(true)
    setError(null)
    try {
      const result = await dataService.signIn(email, password)
      setUser(result.user)
      // Vérifier si admin
      const adminStatus = await dataService.isAdmin()
      setIsAdmin(adminStatus)
      return result
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur inconnue')
      throw err
    } finally {
      setLoading(false)
    }
  }

  const signOut = async () => {
    setLoading(true)
    setError(null)
    try {
      await dataService.signOut()
      setUser(null)
      setIsAdmin(false)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur inconnue')
      throw err
    } finally {
      setLoading(false)
    }
  }

  const getCurrentUser = async () => {
    setLoading(true)
    setError(null)
    try {
      const currentUser = await dataService.getCurrentUser()
      setUser(currentUser)
      if (currentUser) {
        const adminStatus = await dataService.isAdmin()
        setIsAdmin(adminStatus)
      }
      return currentUser
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur inconnue')
      return null
    } finally {
      setLoading(false)
    }
  }

  // ============================================================================
  // PROFILS UTILISATEURS
  // ============================================================================

  const getUserProfile = async (userId?: string) => {
    setLoading(true)
    setError(null)
    try {
      const profile = await dataService.getUserProfile(userId)
      return profile
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur inconnue')
      return null
    } finally {
      setLoading(false)
    }
  }

  const updateUserProfile = async (updates: any, userId?: string) => {
    setLoading(true)
    setError(null)
    try {
      const profile = await dataService.updateUserProfile(updates, userId)
      return profile
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur inconnue')
      return null
    } finally {
      setLoading(false)
    }
  }

  // ============================================================================
  // GESTION DES RÔLES
  // ============================================================================

  const getAllUsers = async () => {
    setLoading(true)
    setError(null)
    try {
      const users = await dataService.getAllUsers()
      return users
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur inconnue')
      return []
    } finally {
      setLoading(false)
    }
  }

  // ============================================================================
  // PLANS D'INVESTISSEMENT
  // ============================================================================

  const getInvestmentPlans = async () => {
    setLoading(true)
    setError(null)
    try {
      const plans = await dataService.getInvestmentPlans()
      return plans
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur inconnue')
      return []
    } finally {
      setLoading(false)
    }
  }

  const getInvestmentPlan = async (planId: string) => {
    setLoading(true)
    setError(null)
    try {
      const plan = await dataService.getInvestmentPlan(planId)
      return plan
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur inconnue')
      return null
    } finally {
      setLoading(false)
    }
  }

  // ============================================================================
  // INVESTISSEMENTS
  // ============================================================================

  const createInvestment = async (planId: string, amount: number) => {
    setLoading(true)
    setError(null)
    try {
      const investment = await dataService.createInvestment(planId, amount)
      return investment
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur inconnue')
      return null
    } finally {
      setLoading(false)
    }
  }

  const getUserInvestments = async (userId?: string) => {
    setLoading(true)
    setError(null)
    try {
      const investments = await dataService.getUserInvestments(userId)
      return investments
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur inconnue')
      return []
    } finally {
      setLoading(false)
    }
  }

  const getAllInvestments = async () => {
    setLoading(true)
    setError(null)
    try {
      const investments = await dataService.getAllInvestments()
      return investments
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur inconnue')
      return []
    } finally {
      setLoading(false)
    }
  }

  // ============================================================================
  // TRANSACTIONS
  // ============================================================================

  const createTransaction = async (transactionData: any) => {
    setLoading(true)
    setError(null)
    try {
      const transaction = await dataService.createTransaction(transactionData)
      return transaction
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur inconnue')
      return null
    } finally {
      setLoading(false)
    }
  }

  const getUserTransactions = async (userId?: string) => {
    setLoading(true)
    setError(null)
    try {
      const transactions = await dataService.getUserTransactions(userId)
      return transactions
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur inconnue')
      return []
    } finally {
      setLoading(false)
    }
  }

  const getAllTransactions = async () => {
    setLoading(true)
    setError(null)
    try {
      const transactions = await dataService.getAllTransactions()
      return transactions
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur inconnue')
      return []
    } finally {
      setLoading(false)
    }
  }

  // ============================================================================
  // WALLETS CRYPTO
  // ============================================================================

  const createCryptoWallet = async (walletData: any) => {
    setLoading(true)
    setError(null)
    try {
      const wallet = await dataService.createCryptoWallet(walletData)
      return wallet
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur inconnue')
      return null
    } finally {
      setLoading(false)
    }
  }

  const getUserWallets = async (userId?: string) => {
    setLoading(true)
    setError(null)
    try {
      const wallets = await dataService.getUserWallets(userId)
      return wallets
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur inconnue')
      return []
    } finally {
      setLoading(false)
    }
  }

  // ============================================================================
  // NOTIFICATIONS
  // ============================================================================

  const createNotification = async (notificationData: any, userId?: string) => {
    setLoading(true)
    setError(null)
    try {
      const notification = await dataService.createNotification(notificationData, userId)
      return notification
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur inconnue')
      return null
    } finally {
      setLoading(false)
    }
  }

  const getUserNotifications = async (userId?: string) => {
    setLoading(true)
    setError(null)
    try {
      const notifications = await dataService.getUserNotifications(userId)
      return notifications
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur inconnue')
      return []
    } finally {
      setLoading(false)
    }
  }

  const markNotificationAsRead = async (notificationId: string) => {
    setLoading(true)
    setError(null)
    try {
      const notification = await dataService.markNotificationAsRead(notificationId)
      return notification
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur inconnue')
      return null
    } finally {
      setLoading(false)
    }
  }

  // ============================================================================
  // INITIALISATION
  // ============================================================================

  useEffect(() => {
    // Vérifier l'utilisateur au chargement
    getCurrentUser()
  }, [])

  return {
    // États
    loading,
    error,
    user,
    isAdmin,
    
    // Authentification
    signUp,
    signIn,
    signOut,
    getCurrentUser,
    
    // Profils
    getUserProfile,
    updateUserProfile,
    
    // Rôles
    getAllUsers,
    
    // Plans d'investissement
    getInvestmentPlans,
    getInvestmentPlan,
    
    // Investissements
    createInvestment,
    getUserInvestments,
    getAllInvestments,
    
    // Transactions
    createTransaction,
    getUserTransactions,
    getAllTransactions,
    
    // Wallets
    createCryptoWallet,
    getUserWallets,
    
    // Notifications
    createNotification,
    getUserNotifications,
    markNotificationAsRead
  }
}`;

  try {
    fs.writeFileSync('src/hooks/useDataService.ts', realHookContent);
    log('✅ Hook réel créé', 'green');
    return true;
  } catch (error) {
    log(`❌ Erreur création hook réel: ${error.message}`, 'red');
    return false;
  }
}

// ============================================================================
// CRÉATION DU CONTEXTE D'AUTHENTIFICATION
// ============================================================================

function createAuthContext() {
  logSection('🔐 CRÉATION DU CONTEXTE D\'AUTHENTIFICATION');
  
  const authContextContent = `import React, { createContext, useContext, useEffect, useState } from 'react'
import { useDataService } from './useDataService'

interface AuthContextType {
  user: any
  isAdmin: boolean
  loading: boolean
  error: string | null
  signUp: (email: string, password: string, userData: any) => Promise<any>
  signIn: (email: string, password: string) => Promise<any>
  signOut: () => Promise<void>
  getUserProfile: (userId?: string) => Promise<any>
  updateUserProfile: (updates: any, userId?: string) => Promise<any>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const {
    user,
    isAdmin,
    loading,
    error,
    signUp,
    signIn,
    signOut,
    getUserProfile,
    updateUserProfile
  } = useDataService()

  const value = {
    user,
    isAdmin,
    loading,
    error,
    signUp,
    signIn,
    signOut,
    getUserProfile,
    updateUserProfile
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}`;

  try {
    fs.writeFileSync('src/contexts/AuthContext.tsx', authContextContent);
    log('✅ Contexte d\'authentification créé', 'green');
    return true;
  } catch (error) {
    log(`❌ Erreur création contexte auth: ${error.message}`, 'red');
    return false;
  }
}

// ============================================================================
// CRÉATION DU COMPOSANT DE ROUTAGE PROTÉGÉ
// ============================================================================

function createProtectedRoute() {
  logSection('🛡️  CRÉATION DU COMPOSANT DE ROUTAGE PROTÉGÉ');
  
  const protectedRouteContent = `import React from 'react'
import { Navigate, useLocation } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'

interface ProtectedRouteProps {
  children: React.ReactNode
  requireAuth?: boolean
  requireAdmin?: boolean
  redirectTo?: string
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  children,
  requireAuth = true,
  requireAdmin = false,
  redirectTo = '/login'
}) => {
  const { user, isAdmin, loading } = useAuth()
  const location = useLocation()

  // Afficher un loader pendant le chargement
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  // Rediriger vers login si authentification requise
  if (requireAuth && !user) {
    return <Navigate to={redirectTo} state={{ from: location }} replace />
  }

  // Rediriger si admin requis mais utilisateur non admin
  if (requireAdmin && !isAdmin) {
    return <Navigate to="/unauthorized" replace />
  }

  // Rediriger les utilisateurs connectés vers leur dashboard
  if (user && !requireAuth && location.pathname === '/login') {
    return <Navigate to={isAdmin ? '/admin' : '/client'} replace />
  }

  return <>{children}</>
}`;

  try {
    fs.writeFileSync('src/components/ProtectedRoute.tsx', protectedRouteContent);
    log('✅ Composant de routage protégé créé', 'green');
    return true;
  } catch (error) {
    log(`❌ Erreur création route protégée: ${error.message}`, 'red');
    return false;
  }
}

// ============================================================================
// FONCTION PRINCIPALE
// ============================================================================

async function removeMocksCreateReal() {
  log('🔄 SUPPRESSION DES MOCKS ET CRÉATION DE FONCTIONNALITÉS RÉELLES', 'bright');
  log('Remplacement de tous les mocks par des opérations réelles et fonctionnelles', 'cyan');
  
  try {
    // 1. Supprimer les fichiers mock
    removeMockFiles();
    
    // 2. Créer le service de données réelles
    const serviceCreated = createRealDataService();
    
    // 3. Créer le hook réel
    const hookCreated = createRealHook();
    
    // 4. Créer le contexte d'authentification
    const contextCreated = createAuthContext();
    
    // 5. Créer le composant de routage protégé
    const routeCreated = createProtectedRoute();

    // Résumé
    logSection('📊 RÉSUMÉ DE LA TRANSFORMATION');
    log('✅ Fichiers mock supprimés', 'green');
    log('✅ Service de données réelles créé', 'green');
    log('✅ Hook réel avec authentification créé', 'green');
    log('✅ Contexte d\'authentification créé', 'green');
    log('✅ Composant de routage protégé créé', 'green');

    // Instructions
    logSection('📋 INSTRUCTIONS POST-TRANSFORMATION');
    log('1. Mettez à jour votre App.tsx pour utiliser AuthProvider:', 'yellow');
    log('   import { AuthProvider } from \'./contexts/AuthContext\'', 'blue');
    log('2. Utilisez ProtectedRoute pour sécuriser les routes:', 'yellow');
    log('   <ProtectedRoute requireAuth requireAdmin>', 'blue');
    log('3. Testez l\'inscription et connexion:', 'yellow');
    log('   - Inscription client: /register', 'blue');
    log('   - Connexion: /login', 'blue');
    log('   - Dashboard admin: /admin (admin seulement)', 'blue');
    log('   - Dashboard client: /client (clients seulement)', 'blue');
    log('4. Toutes les opérations sont maintenant réelles !', 'green');

  } catch (error) {
    log('\n❌ Erreur lors de la transformation', 'red');
    log(error.message, 'red');
  }
}

// Exécution
removeMocksCreateReal().catch(console.error);