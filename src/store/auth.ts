import { create } from 'zustand';
import { subscribeWithSelector } from 'zustand/middleware';
import { supabase, userApi, checkSupabaseConnection } from '@/lib/supabase';
import { userDataCache } from '@/utils/caching';
import type { User, AuthState, LoginForm, RegisterForm } from '@/types';

interface AuthStore extends AuthState {
  // Actions
  signIn: (credentials: LoginForm) => Promise<{ error?: string; user?: User }>;
  signUp: (userData: RegisterForm) => Promise<{ error?: string }>;
  signOut: () => Promise<void>;
  refreshUser: () => Promise<void>;
  clearError: () => void;
}

export const useAuthStore = create<AuthStore>()(
  subscribeWithSelector((set, get) => ({
  user: null,
  session: null,
  loading: true,
  error: null,

  signIn: async (credentials: LoginForm) => {
    set({ loading: true, error: null });

    try {
      // Login attempt initiated - email removed for security
      
      // Vérification de la connexion Supabase
      const connectionCheck = await checkSupabaseConnection();
      if (!connectionCheck) {
        // Supabase connection issue
        set({ error: 'Problème de connexion au serveur', loading: false });
        return { error: 'Problème de connexion au serveur' };
      }
      
      const { data, error } = await supabase.auth.signInWithPassword({
        email: credentials.email,
        password: credentials.password,
      });

      if (error) {
        // Supabase authentication error - details removed for security
        let errorMessage = error.message;
        
        // Traduction des erreurs courantes
        if (error.message.includes('Invalid login credentials')) {
          errorMessage = 'Email ou mot de passe incorrect';
        } else if (error.message.includes('Email not confirmed')) {
          errorMessage = 'Veuillez confirmer votre email avant de vous connecter';
        } else if (error.message.includes('Too many requests')) {
          errorMessage = 'Trop de tentatives. Veuillez réessayer plus tard';
        }
        
        set({ error: errorMessage, loading: false });
        return { error: errorMessage };
      }

      // Supabase authentication successful - email removed for security

      if (data.user?.email) {
        console.log('🔍 Recherche du profil utilisateur...');
        let user = await userApi.getUserByEmail(data.user.email);
        
        // Auto-création du profil s'il n'existe pas (première connexion / confirmation email)
        if (!user) {
          console.warn('ℹ️ Aucun profil trouvé, création automatique...');
          
          // Désactiver temporairement RLS pour la création du profil
          try {
            user = await userApi.createUser({
              id: data.user.id,
              email: data.user.email,
              full_name: data.user.user_metadata?.full_name || data.user.email.split('@')[0],
              role: 'client',
              status: 'active',
              total_invested: 0,
              total_profit: 0,
            } as Partial<User>);
          } catch (error) {
            console.error('❌ Erreur création profil automatique:', error);
            // Continuer sans profil pour l'instant
          }
        }
        
        if (!user) {
          // User profile not found or not created
          set({ error: 'Erreur lors de la récupération du profil utilisateur', loading: false });
          return { error: 'Erreur lors de la récupération du profil utilisateur' };
        }
        
        // User profile retrieved successfully - details removed for security
        set({ 
          user, 
          session: data.session, 
          loading: false,
          error: null 
        });
        
        return { user };
      }

      set({ error: 'Aucun utilisateur trouvé', loading: false });
      return { error: 'Aucun utilisateur trouvé' };
    } catch (error) {
      console.error('💥 Erreur inattendue lors de la connexion:', error);
      const errorMessage = error instanceof Error ? error.message : 'Une erreur inattendue s\'est produite';
      set({ error: errorMessage, loading: false });
      return { error: errorMessage };
    }
  },

  signUp: async (userData: RegisterForm) => {
    set({ loading: true, error: null });

    try {
      // Registration process initiated - email removed for security
      
      // Vérification de la connexion Supabase
      const connectionCheck = await checkSupabaseConnection();
      if (!connectionCheck) {
        console.error('❌ Problème de connexion à Supabase');
        set({ error: 'Problème de connexion au serveur', loading: false });
        return { error: 'Problème de connexion au serveur' };
      }
      
      // Check password length
      if (userData.password.length < 8) {
        // Password too short - length removed for security
        set({ error: 'Le mot de passe doit contenir au moins 8 caractères', loading: false });
        return { error: 'Le mot de passe doit contenir au moins 8 caractères' };
      }

      // Check if passwords match
      if (userData.password !== userData.confirm_password) {
        // Password mismatch detected
        set({ error: 'Les mots de passe ne correspondent pas', loading: false });
        return { error: 'Les mots de passe ne correspondent pas' };
      }

      // Vérifier si l'email existe déjà
      const existingUser = await userApi.getUserByEmail(userData.email);
      if (existingUser) {
        // Email already in use - email removed for security
        set({ error: 'Un compte avec cet email existe déjà', loading: false });
        return { error: 'Un compte avec cet email existe déjà' };
      }

      console.log('✅ Validation client OK, envoi à Supabase...');
      
      const { data, error } = await supabase.auth.signUp({
        email: userData.email,
        password: userData.password,
        options: {
          emailRedirectTo: undefined, // Désactive la redirection email explicite
          data: {
            full_name: userData.full_name,
          }
        }
      });

      if (error) {
        console.error('❌ Erreur Supabase signUp:', error);
        let errorMessage = error.message;
        
        // Traduction des erreurs courantes
        if (error.message.includes('User already registered')) {
          errorMessage = 'Un compte avec cet email existe déjà';
        } else if (error.message.includes('Password should be at least')) {
          errorMessage = 'Le mot de passe doit contenir au moins 8 caractères';
        } else if (error.message.includes('Invalid email')) {
          errorMessage = 'Format d\'email invalide';
        }
        
        set({ error: errorMessage, loading: false });
        return { error: errorMessage };
      }

      // Supabase registration successful - email removed for security

      // Si la confirmation email est activée, data.session peut être null.
      // Dans ce cas, on attend la confirmation: la création du profil se fera à la première session active.
      if (!data.session) {
        // Registration pending email confirmation - profile creation deferred
        set({ loading: false, error: null });
        return {};
      }

      if (data.user) {
        // Creating user profile
        
        // Create user profile
        const user = await userApi.createUser({
          id: data.user.id,
          email: userData.email,
          full_name: userData.full_name,
          role: 'client',
          status: 'active',
          total_invested: 0,
          total_profit: 0,
        });

        if (user) {
          // Client profile created successfully - name removed for security
          set({ 
            user, 
            session: data.session, 
            loading: false,
            error: null 
          });
        } else {
          // User profile not created but connection successful
          // Créer un profil temporaire pour permettre la connexion
          const tempUser = {
            id: data.user.id,
            email: data.user.email,
            full_name: data.user.user_metadata?.full_name || data.user.email.split('@')[0],
            role: 'client' as const,
            status: 'active' as const,
            total_invested: 0,
            total_profit: 0,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
          };
          
          set({ 
            user: tempUser, 
            session: data.session, 
            loading: false,
            error: null 
          });
        }
      }

      return {};
    } catch (error) {
      // Unexpected error during registration - details removed for security
      const errorMessage = error instanceof Error ? error.message : 'Une erreur inattendue s\'est produite';
      set({ error: errorMessage, loading: false });
      return { error: errorMessage };
    }
  },

  signOut: async () => {
    set({ loading: true });

    try {
      await supabase.auth.signOut();
      set({ 
        user: null, 
        session: null, 
        loading: false,
        error: null 
      });
    } catch (error) {
      console.error('Error signing out:', error);
      set({ loading: false });
    }
  },

  refreshUser: async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (session?.user?.email) {
        let user = await userApi.getUserByEmail(session.user.email);
        // Auto-create profile if missing after first login/confirmation
        if (!user) {
          user = await userApi.createUser({
            id: session.user.id,
            email: session.user.email,
            full_name: session.user.user_metadata?.full_name || session.user.email.split('@')[0],
            role: 'client',
            status: 'active',
            total_invested: 0,
            total_profit: 0,
          } as Partial<User>);
        }
        set({         user, session, loading: false });
      } else {
        set({ user: null, session: null, loading: false });
      }
    } catch (error) {
      console.error('Error refreshing user:', error);
      set({ user: null, session: null, loading: false });
    }
  },

  clearError: () => {
    set({ error: null });
  },
})));

// Initialize auth state
export const initializeAuth = () => {
  const { refreshUser } = useAuthStore.getState();
  
  // Get initial session
  refreshUser();

  // Listen for auth changes
  supabase.auth.onAuthStateChange(async (event, session) => {
    // Auth state changed - event details removed for security
    
    if (session?.user?.email) {
      // Ensure profile exists when session becomes active (e.g., after email confirmation)
      let user = await userApi.getUserByEmail(session.user.email);
      if (!user) {
        user = await userApi.createUser({
          id: session.user.id,
          email: session.user.email,
          full_name: session.user.user_metadata?.full_name || session.user.email.split('@')[0],
          role: 'client',
          status: 'active',
          total_invested: 0,
          total_profit: 0,
        } as Partial<User>);
      }
      useAuthStore.setState({ user, session, loading: false });
    } else {
      useAuthStore.setState({ user: null, session: null, loading: false });
    }
  });
};

// Performance-optimized auth hooks
export const useOptimizedAuth = () => {
  // Subscribe only to specific auth state changes
  const user = useAuthStore(state => state.user);
  const loading = useAuthStore(state => state.loading);
  const error = useAuthStore(state => state.error);

  return { user, loading, error };
};

export const useAuthActions = () => {
  // Memoize auth actions to prevent unnecessary re-renders
  return React.useMemo(() => ({
    signIn: useAuthStore.getState().signIn,
    signUp: useAuthStore.getState().signUp,
    signOut: useAuthStore.getState().signOut,
    refreshUser: useAuthStore.getState().refreshUser,
    clearError: useAuthStore.getState().clearError
  }), []);
};

// React import for hooks
import React from 'react';