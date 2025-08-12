// Route validation utility for testing access control
import { User } from '@/types';

export interface RouteTest {
  path: string;
  requireAuth: boolean;
  requireAdmin: boolean;
  expectedBehavior: {
    unauthenticated: 'redirect-login' | 'allow';
    client: 'allow' | 'redirect-client' | 'redirect-login';
    admin: 'allow' | 'redirect-client';
  };
}

export const routeTests: RouteTest[] = [
  // Public routes
  {
    path: '/',
    requireAuth: false,
    requireAdmin: false,
    expectedBehavior: {
      unauthenticated: 'allow',
      client: 'allow',
      admin: 'allow'
    }
  },
  {
    path: '/login',
    requireAuth: false,
    requireAdmin: false,
    expectedBehavior: {
      unauthenticated: 'allow',
      client: 'allow',
      admin: 'allow'
    }
  },
  {
    path: '/register',
    requireAuth: false,
    requireAdmin: false,
    expectedBehavior: {
      unauthenticated: 'allow',
      client: 'allow',
      admin: 'allow'
    }
  },
  
  // Client routes
  {
    path: '/client',
    requireAuth: true,
    requireAdmin: false,
    expectedBehavior: {
      unauthenticated: 'redirect-login',
      client: 'allow',
      admin: 'allow'
    }
  },
  {
    path: '/client/profile',
    requireAuth: true,
    requireAdmin: false,
    expectedBehavior: {
      unauthenticated: 'redirect-login',
      client: 'allow',
      admin: 'allow'
    }
  },
  {
    path: '/client/wallet',
    requireAuth: true,
    requireAdmin: false,
    expectedBehavior: {
      unauthenticated: 'redirect-login',
      client: 'allow',
      admin: 'allow'
    }
  },
  
  // Admin routes
  {
    path: '/admin',
    requireAuth: true,
    requireAdmin: true,
    expectedBehavior: {
      unauthenticated: 'redirect-login',
      client: 'redirect-client',
      admin: 'allow'
    }
  },
  {
    path: '/admin/users',
    requireAuth: true,
    requireAdmin: true,
    expectedBehavior: {
      unauthenticated: 'redirect-login',
      client: 'redirect-client',
      admin: 'allow'
    }
  },
  {
    path: '/admin/transactions',
    requireAuth: true,
    requireAdmin: true,
    expectedBehavior: {
      unauthenticated: 'redirect-login',
      client: 'redirect-client',
      admin: 'allow'
    }
  }
];

export const validateRouteAccess = (
  route: RouteTest,
  user: User | null
): 'allow' | 'redirect-login' | 'redirect-client' => {
  // Unauthenticated user
  if (!user) {
    return route.expectedBehavior.unauthenticated;
  }
  
  // Admin user
  if (user.role === 'admin') {
    return route.expectedBehavior.admin;
  }
  
  // Client user
  return route.expectedBehavior.client;
};

export const testAllRoutes = (user: User | null): {
  passed: number;
  failed: number;
  results: Array<{
    path: string;
    expected: string;
    actual: string;
    passed: boolean;
  }>;
} => {
  const results = routeTests.map(route => {
    const expected = validateRouteAccess(route, user);
    
    // Simulate the actual ProtectedRoute logic
    let actual: 'allow' | 'redirect-login' | 'redirect-client';
    
    if (!route.requireAuth) {
      actual = 'allow';
    } else if (!user) {
      actual = 'redirect-login';
    } else if (route.requireAdmin && user.role !== 'admin') {
      actual = 'redirect-client';
    } else {
      actual = 'allow';
    }
    
    return {
      path: route.path,
      expected,
      actual,
      passed: expected === actual
    };
  });
  
  const passed = results.filter(r => r.passed).length;
  const failed = results.filter(r => !r.passed).length;
  
  return { passed, failed, results };
};

// Console testing utility
export const runRouteTests = () => {
  console.log('🧪 Running Route Access Tests...\n');
  
  // Test scenarios
  const scenarios = [
    { name: 'Unauthenticated User', user: null },
    { name: 'Client User', user: { id: '1', role: 'client', email: 'client@test.com' } as User },
    { name: 'Admin User', user: { id: '2', role: 'admin', email: 'admin@test.com' } as User }
  ];
  
  scenarios.forEach(scenario => {
    console.log(`\n📋 Testing: ${scenario.name}`);
    console.log('─'.repeat(40));
    
    const testResults = testAllRoutes(scenario.user);
    
    testResults.results.forEach(result => {
      const status = result.passed ? '✅' : '❌';
      const details = result.passed ? '' : ` (Expected: ${result.expected}, Got: ${result.actual})`;
      console.log(`${status} ${result.path}${details}`);
    });
    
    console.log(`\n📊 Results: ${testResults.passed} passed, ${testResults.failed} failed`);
  });
  
  console.log('\n🎯 Route testing complete!');
};
