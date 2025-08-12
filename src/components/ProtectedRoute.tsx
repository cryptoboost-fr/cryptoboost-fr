import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuthStore } from '@/store/auth';
import { useOptimizedMount, useMemoryOptimization } from '@/utils/navigationOptimization';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requireAuth?: boolean;
  requireAdmin?: boolean;
  redirectTo?: string;
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = React.memo(({
  children,
  requireAuth = false,
  requireAdmin = false,
  redirectTo = '/login'
}) => {
  const { user, loading } = useAuthStore();
  const location = useLocation();

  // Performance optimizations
  const isMounted = useOptimizedMount('ProtectedRoute');
  const { addCleanup } = useMemoryOptimization('ProtectedRoute');

  // Afficher un loader pendant le chargement
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-gray-900">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  // Si l'authentification n'est pas requise, afficher directement
  if (!requireAuth) {
    return <>{children}</>;
  }

  // Rediriger vers login si authentification requise
  if (requireAuth && !user) {
    return <Navigate to={redirectTo} state={{ from: location }} replace />;
  }

  // Rediriger si admin requis mais utilisateur non admin
  if (requireAdmin && user?.role !== 'admin') {
    return <Navigate to="/client" replace />;
  }

  return <>{children}</>;
});