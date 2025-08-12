// Service de données RÉELLES - Pas de mock
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseKey) {
  throw new Error('Missing Supabase environment variables. Please check your .env file.');
}

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
        throw new Error(`Montant invalide. Doit être entre ${plan.min_amount} et ${plan.max_amount}`)
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
        .select(`
          *,
          investment_plans (
            name,
            interest_rate,
            duration_days
          )
        `)
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
        .select(`
          *,
          users (full_name, email),
          investment_plans (name, interest_rate)
        `)
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
        .select(`
          *,
          users (full_name, email)
        `)
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

export default supabase;