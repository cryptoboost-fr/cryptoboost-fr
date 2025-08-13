/**
 * Navigation Speed Optimization Utilities
 * Enhances route transitions and component performance without changing UI
 */

import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

// Route preloading manager
class RoutePreloader {
  private static instance: RoutePreloader;
  private preloadedRoutes = new Set<string>();
  private preloadPromises = new Map<string, Promise<any>>();

  static getInstance(): RoutePreloader {
    if (!RoutePreloader.instance) {
      RoutePreloader.instance = new RoutePreloader();
    }
    return RoutePreloader.instance;
  }

  // Preload a route component
  async preloadRoute(routePath: string): Promise<void> {
    if (this.preloadedRoutes.has(routePath)) {
      return;
    }

    if (this.preloadPromises.has(routePath)) {
      return this.preloadPromises.get(routePath);
    }

    const preloadPromise = this.getRouteImport(routePath);
    this.preloadPromises.set(routePath, preloadPromise);

    try {
      await preloadPromise;
      this.preloadedRoutes.add(routePath);
    } catch (error) {
      console.warn(`Failed to preload route: ${routePath}`, error);
    } finally {
      this.preloadPromises.delete(routePath);
    }
  }

  // Get the import function for a route
  private getRouteImport(routePath: string): Promise<any> {
    const routeMap: Record<string, () => Promise<any>> = {
      // Client routes
      '/client/dashboard': () => import('../pages/client/Dashboard'),
      '/client/profile': () => import('../pages/client/Profile'),
      '/client/plans': () => import('../pages/client/Plans'),
      '/client/history': () => import('../pages/client/History'),
      '/client/wallet': () => import('../pages/client/Wallet'),
      '/client/notifications': () => import('../pages/client/Notifications'),
      '/client/exchange': () => import('../pages/client/Exchange'),
      
      // Admin routes
      '/admin/dashboard': () => import('../pages/admin/Dashboard'),
      '/admin/users': () => import('../pages/admin/Users'),
      '/admin/transactions': () => import('../pages/admin/Transactions'),
      '/admin/plans': () => import('../pages/admin/InvestmentPlans'),
      '/admin/logs': () => import('../pages/admin/SystemLogs'),
      '/admin/wallets': () => import('../pages/admin/CryptoWallets'),
      '/admin/settings': () => import('../pages/admin/Settings'),
      
      // Auth routes
      '/register': () => import('../pages/auth/Register'),
      '/password-reset': () => import('../pages/auth/PasswordReset'),
      
      // Public routes
      '/about': () => import('../pages/public/About'),
      '/contact': () => import('../pages/public/Contact'),
      '/terms': () => import('../pages/public/Terms'),
      '/privacy': () => import('../pages/public/Privacy'),
    };

    const importFn = routeMap[routePath];
    if (!importFn) {
      return Promise.reject(new Error(`Unknown route: ${routePath}`));
    }

    return importFn();
  }

  // Preload likely next routes based on current route
  preloadLikelyRoutes(currentRoute: string): void {
    const likelyRoutes: Record<string, string[]> = {
      '/': ['/register', '/about', '/contact'],
      '/register': ['/client/dashboard'],
      '/client/dashboard': ['/client/plans', '/client/wallet', '/client/history'],
      '/client/plans': ['/client/wallet', '/client/dashboard'],
      '/client/wallet': ['/client/exchange', '/client/history'],
      '/admin/dashboard': ['/admin/users', '/admin/transactions', '/admin/settings'],
      '/admin/users': ['/admin/dashboard', '/admin/transactions'],
      '/admin/transactions': ['/admin/users', '/admin/dashboard'],
    };

    const routes = likelyRoutes[currentRoute] || [];
    routes.forEach(route => {
      // Preload with a small delay to not block current page
      setTimeout(() => this.preloadRoute(route), 100);
    });
  }

  // Clear preloaded routes (for memory management)
  clearPreloaded(): void {
    this.preloadedRoutes.clear();
    this.preloadPromises.clear();
  }
}

export const routePreloader = RoutePreloader.getInstance();

// Hook for optimized navigation
export const useOptimizedNavigation = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [isNavigating, setIsNavigating] = React.useState(false);

  // Preload likely routes when location changes
  React.useEffect(() => {
    routePreloader.preloadLikelyRoutes(location.pathname);
  }, [location.pathname]);

  // Optimized navigate function with preloading
  const optimizedNavigate = React.useCallback(async (to: string, options?: any) => {
    setIsNavigating(true);
    
    try {
      // Preload the target route if not already loaded
      await routePreloader.preloadRoute(to);
      
      // Navigate with a small delay to ensure smooth transition
      setTimeout(() => {
        navigate(to, options);
        setIsNavigating(false);
      }, 50);
    } catch (error) {
      // Fallback to normal navigation
      navigate(to, options);
      setIsNavigating(false);
    }
  }, [navigate]);

  return { optimizedNavigate, isNavigating };
};

// Component mounting optimization
export const useOptimizedMount = (componentName: string) => {
  const [isMounted, setIsMounted] = React.useState(false);
  const mountStartTime = React.useRef<number>(0);

  React.useEffect(() => {
    mountStartTime.current = performance.now();
    setIsMounted(true);

    return () => {
      const mountTime = performance.now() - mountStartTime.current;
      if (process.env.NODE_ENV === 'development' && mountTime > 100) {
        console.warn(`Slow mount: ${componentName} (${mountTime.toFixed(2)}ms)`);
      }
    };
  }, [componentName]);

  return isMounted;
};

// State management optimization
export const useOptimizedState = <T>(
  initialState: T,
  equalityFn?: (prev: T, next: T) => boolean
) => {
  const [state, setState] = React.useState(initialState);
  const previousState = React.useRef(initialState);

  const optimizedSetState = React.useCallback((newState: T | ((prev: T) => T)) => {
    setState(prevState => {
      const nextState = typeof newState === 'function' 
        ? (newState as (prev: T) => T)(prevState)
        : newState;

      // Use custom equality function or shallow comparison
      const isEqual = equalityFn 
        ? equalityFn(prevState, nextState)
        : Object.is(prevState, nextState);

      if (isEqual) {
        return prevState; // Prevent unnecessary re-renders
      }

      previousState.current = prevState;
      return nextState;
    });
  }, [equalityFn]);

  return [state, optimizedSetState, previousState.current] as const;
};

// Memory usage optimization
export const useMemoryOptimization = (componentName: string) => {
  const cleanupFunctions = React.useRef<Array<() => void>>([]);

  const addCleanup = React.useCallback((cleanupFn: () => void) => {
    cleanupFunctions.current.push(cleanupFn);
  }, []);

  React.useEffect(() => {
    return () => {
      // Execute all cleanup functions
      cleanupFunctions.current.forEach(cleanup => {
        try {
          cleanup();
        } catch (error) {
          console.warn(`Cleanup error in ${componentName}:`, error);
        }
      });
      cleanupFunctions.current = [];
    };
  }, [componentName]);

  return { addCleanup };
};

// Intersection observer optimization for lazy loading
export const useOptimizedIntersection = (
  callback: (isIntersecting: boolean) => void,
  options: IntersectionObserverInit = {}
) => {
  const elementRef = React.useRef<HTMLElement>(null);
  const observerRef = React.useRef<IntersectionObserver | null>(null);

  React.useEffect(() => {
    const element = elementRef.current;
    if (!element) return;

    observerRef.current = new IntersectionObserver(
      ([entry]) => callback(entry.isIntersecting),
      {
        threshold: 0.1,
        rootMargin: '50px',
        ...options
      }
    );

    observerRef.current.observe(element);

    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
  }, [callback, options]);

  return elementRef;
};

// Prefetch critical data for faster navigation
export const usePrefetchCriticalData = () => {
  const prefetchUserData = React.useCallback(async () => {
    // Prefetch user profile and basic data
    try {
      const promises = [
        import('../store/auth').then(module => module.useAuthStore.getState().user),
        // Add other critical data prefetching here
      ];
      
      await Promise.allSettled(promises);
    } catch (error) {
      console.warn('Failed to prefetch critical data:', error);
    }
  }, []);

  React.useEffect(() => {
    // Prefetch on app initialization
    const timer = setTimeout(prefetchUserData, 1000);
    return () => clearTimeout(timer);
  }, [prefetchUserData]);

  return { prefetchUserData };
};

// Initialize navigation optimizations
let navigationIntervals: NodeJS.Timeout[] = [];
let navigationTimeouts: NodeJS.Timeout[] = [];

export const initializeNavigationOptimizations = () => {
  // Clear existing intervals and timeouts to prevent duplicates
  navigationIntervals.forEach(interval => clearInterval(interval));
  navigationTimeouts.forEach(timeout => clearTimeout(timeout));
  navigationIntervals = [];
  navigationTimeouts = [];

  // Preload critical routes on app start
  const preloadTimeout = setTimeout(() => {
    routePreloader.preloadRoute('/client');
    routePreloader.preloadRoute('/admin');
  }, 2000);
  navigationTimeouts.push(preloadTimeout);

  // Set up memory cleanup
  const memoryCleanupInterval = setInterval(() => {
    if ('memory' in performance) {
      const memory = (performance as any).memory;
      if (memory.usedJSHeapSize > 100 * 1024 * 1024) { // 100MB
        routePreloader.clearPreloaded();
      }
    }
  }, 300000); // Every 5 minutes
  navigationIntervals.push(memoryCleanupInterval);
};

// Cleanup function for navigation optimizations
export const cleanupNavigationOptimizations = () => {
  navigationIntervals.forEach(interval => clearInterval(interval));
  navigationTimeouts.forEach(timeout => clearTimeout(timeout));
  navigationIntervals = [];
  navigationTimeouts = [];
};
