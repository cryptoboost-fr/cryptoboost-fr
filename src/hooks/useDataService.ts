import { useState, useEffect } from 'react'
import { dataService } from '../services/dataService'

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
}