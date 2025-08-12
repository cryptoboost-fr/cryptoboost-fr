// Comprehensive Access Control Matrix Implementation and Testing
import { User } from '@/types';

export type UserType = 'unauthenticated' | 'client' | 'admin';
export type RouteType = 'public' | 'client' | 'admin';
export type AccessResult = 'allow' | 'redirect-login' | 'redirect-client';

export interface RouteDefinition {
  path: string;
  type: RouteType;
  requireAuth: boolean;
  requireAdmin: boolean;
  description: string;
}

export interface AccessControlResult {
  userType: UserType;
  routeType: RouteType;
  result: AccessResult;
  toastMessage?: string;
  redirectTo?: string;
}

// Complete route definitions based on App.tsx
export const routeDefinitions: RouteDefinition[] = [
  // Public Routes (no authentication required)
  { path: '/', type: 'public', requireAuth: false, requireAdmin: false, description: 'Home page' },
  { path: '/login', type: 'public', requireAuth: false, requireAdmin: false, description: 'Login page' },
  { path: '/register', type: 'public', requireAuth: false, requireAdmin: false, description: 'Registration page' },
  { path: '/about', type: 'public', requireAuth: false, requireAdmin: false, description: 'About page' },
  { path: '/contact', type: 'public', requireAuth: false, requireAdmin: false, description: 'Contact page' },
  { path: '/terms', type: 'public', requireAuth: false, requireAdmin: false, description: 'Terms of service' },
  { path: '/privacy', type: 'public', requireAuth: false, requireAdmin: false, description: 'Privacy policy' },
  { path: '/plans', type: 'public', requireAuth: false, requireAdmin: false, description: 'Public plans' },
  { path: '/faq', type: 'public', requireAuth: false, requireAdmin: false, description: 'FAQ page' },
  { path: '/help', type: 'public', requireAuth: false, requireAdmin: false, description: 'Help page' },
  { path: '/blog', type: 'public', requireAuth: false, requireAdmin: false, description: 'Blog page' },
  { path: '/status', type: 'public', requireAuth: false, requireAdmin: false, description: 'System status' },
  { path: '/api', type: 'public', requireAuth: false, requireAdmin: false, description: 'API documentation' },
  { path: '/careers', type: 'public', requireAuth: false, requireAdmin: false, description: 'Careers page' },
  { path: '/press', type: 'public', requireAuth: false, requireAdmin: false, description: 'Press releases' },
  
  // Client Routes (authentication required, no admin needed)
  { path: '/client', type: 'client', requireAuth: true, requireAdmin: false, description: 'Client dashboard' },
  { path: '/client/profile', type: 'client', requireAuth: true, requireAdmin: false, description: 'Client profile' },
  { path: '/client/wallet', type: 'client', requireAuth: true, requireAdmin: false, description: 'Client wallet' },
  { path: '/client/plans', type: 'client', requireAuth: true, requireAdmin: false, description: 'Client investment plans' },
  { path: '/client/history', type: 'client', requireAuth: true, requireAdmin: false, description: 'Transaction history' },
  { path: '/client/notifications', type: 'client', requireAuth: true, requireAdmin: false, description: 'Client notifications' },
  { path: '/client/exchange', type: 'client', requireAuth: true, requireAdmin: false, description: 'Crypto exchange' },
  
  // Admin Routes (authentication + admin role required)
  { path: '/admin', type: 'admin', requireAuth: true, requireAdmin: true, description: 'Admin dashboard' },
  { path: '/admin/users', type: 'admin', requireAuth: true, requireAdmin: true, description: 'User management' },
  { path: '/admin/transactions', type: 'admin', requireAuth: true, requireAdmin: true, description: 'Transaction management' },
  { path: '/admin/plans', type: 'admin', requireAuth: true, requireAdmin: true, description: 'Investment plan management' },
  { path: '/admin/crypto-wallets', type: 'admin', requireAuth: true, requireAdmin: true, description: 'Crypto wallet management' },
  { path: '/admin/system-logs', type: 'admin', requireAuth: true, requireAdmin: true, description: 'System logs' },
  { path: '/admin/settings', type: 'admin', requireAuth: true, requireAdmin: true, description: 'System settings' }
];

// Simulate ProtectedRoute logic
export const simulateAccess = (
  route: RouteDefinition,
  user: User | null
): AccessControlResult => {
  const userType: UserType = !user ? 'unauthenticated' : user.role === 'admin' ? 'admin' : 'client';
  
  // Public routes - always allow
  if (!route.requireAuth) {
    return {
      userType,
      routeType: route.type,
      result: 'allow'
    };
  }
  
  // Authentication required but user not logged in
  if (route.requireAuth && !user) {
    return {
      userType,
      routeType: route.type,
      result: 'redirect-login',
      toastMessage: 'Veuillez vous connecter pour accéder à cette page',
      redirectTo: '/login'
    };
  }
  
  // Admin required but user is not admin
  if (route.requireAdmin && user?.role !== 'admin') {
    return {
      userType,
      routeType: route.type,
      result: 'redirect-client',
      toastMessage: 'Accès administrateur requis. Redirection vers votre espace client.',
      redirectTo: '/client'
    };
  }
  
  // Access granted
  return {
    userType,
    routeType: route.type,
    result: 'allow'
  };
};

// Generate complete access control matrix
export const generateAccessControlMatrix = (): {
  [key in UserType]: {
    [key in RouteType]: {
      result: AccessResult;
      toastMessage?: string;
      redirectTo?: string;
      symbol: string;
      description: string;
    }
  }
} => {
  const users = [
    { type: 'unauthenticated' as UserType, user: null },
    { type: 'client' as UserType, user: { id: '1', role: 'client', email: 'client@test.com' } as User },
    { type: 'admin' as UserType, user: { id: '2', role: 'admin', email: 'admin@test.com' } as User }
  ];
  
  const routeTypes: RouteType[] = ['public', 'client', 'admin'];
  
  const matrix = {} as any;
  
  users.forEach(({ type: userType, user }) => {
    matrix[userType] = {};
    
    routeTypes.forEach(routeType => {
      // Get a sample route of this type
      const sampleRoute = routeDefinitions.find(r => r.type === routeType)!;
      const result = simulateAccess(sampleRoute, user);
      
      let symbol = '';
      let description = '';
      
      switch (result.result) {
        case 'allow':
          symbol = '✅';
          description = 'Full Access';
          break;
        case 'redirect-login':
          symbol = '❌';
          description = `→ /login + toast`;
          break;
        case 'redirect-client':
          symbol = '❌';
          description = `→ /client + warning`;
          break;
      }
      
      matrix[userType][routeType] = {
        result: result.result,
        toastMessage: result.toastMessage,
        redirectTo: result.redirectTo,
        symbol,
        description
      };
    });
  });
  
  return matrix;
};
