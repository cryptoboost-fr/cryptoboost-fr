import { useAuthStore } from '@/store/auth';
import { useCallback } from 'react';
import type { LoginForm, RegisterForm } from '@/types';

/**
 * Hook d'authentification qui expose les fonctionnalités du store auth
 * Compatible avec les composants existants qui importent useAuth
 */
export const useAuth = () => {
  const {
    user,
    session,
    loading,
    error,
    signIn,
    signUp,
    signOut,
    refreshUser,
    clearError
  } = useAuthStore();

  // Alias pour compatibilité avec les composants existants
  const login = useCallback(async (credentials: LoginForm) => {
    return await signIn(credentials);
  }, [signIn]);

  const register = useCallback(async (userData: RegisterForm) => {
    return await signUp(userData);
  }, [signUp]);

  const logout = useCallback(async () => {
    await signOut();
  }, [signOut]);

  // Propriétés dérivées pour compatibilité
  const isLoading = loading;
  const isAuthenticated = !!user;
  const isAdmin = user?.role === 'admin';

  return {
    // État de base
    user,
    session,
    loading,
    isLoading,
    error,
    
    // États dérivés
    isAuthenticated,
    isAdmin,
    
    // Actions
    login,
    register,
    logout,
    signIn,
    signUp,
    signOut,
    refreshUser,
    clearError
  };
};

export default useAuth;
