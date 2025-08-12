/**
 * Database Query Optimization Utilities
 * Provides optimized query patterns and caching for Supabase
 */

import { supabase } from '@/lib/supabase';
import { performanceTracker } from './performance';

// Query cache with TTL
class QueryCache {
  private cache = new Map<string, { data: any; timestamp: number; ttl: number }>();
  private defaultTTL = 5 * 60 * 1000; // 5 minutes

  set(key: string, data: any, ttl: number = this.defaultTTL) {
    this.cache.set(key, {
      data,
      timestamp: Date.now(),
      ttl
    });
  }

  get(key: string): any | null {
    const cached = this.cache.get(key);
    if (!cached) return null;

    if (Date.now() - cached.timestamp > cached.ttl) {
      this.cache.delete(key);
      return null;
    }

    return cached.data;
  }

  clear() {
    this.cache.clear();
  }

  // Clean expired entries
  cleanup() {
    const now = Date.now();
    for (const [key, value] of this.cache.entries()) {
      if (now - value.timestamp > value.ttl) {
        this.cache.delete(key);
      }
    }
  }
}

export const queryCache = new QueryCache();

// Optimized query builder
export class OptimizedQuery {
  private table: string;
  private selectFields: string = '*';
  private filters: Array<{ column: string; operator: string; value: any }> = [];
  private orderBy: { column: string; ascending: boolean } | null = null;
  private limitValue: number | null = null;
  private offsetValue: number | null = null;

  constructor(table: string) {
    this.table = table;
  }

  select(fields: string) {
    this.selectFields = fields;
    return this;
  }

  eq(column: string, value: any) {
    this.filters.push({ column, operator: 'eq', value });
    return this;
  }

  neq(column: string, value: any) {
    this.filters.push({ column, operator: 'neq', value });
    return this;
  }

  gt(column: string, value: any) {
    this.filters.push({ column, operator: 'gt', value });
    return this;
  }

  gte(column: string, value: any) {
    this.filters.push({ column, operator: 'gte', value });
    return this;
  }

  lt(column: string, value: any) {
    this.filters.push({ column, operator: 'lt', value });
    return this;
  }

  lte(column: string, value: any) {
    this.filters.push({ column, operator: 'lte', value });
    return this;
  }

  like(column: string, pattern: string) {
    this.filters.push({ column, operator: 'like', value: pattern });
    return this;
  }

  in(column: string, values: any[]) {
    this.filters.push({ column, operator: 'in', value: values });
    return this;
  }

  order(column: string, ascending: boolean = true) {
    this.orderBy = { column, ascending };
    return this;
  }

  limit(count: number) {
    this.limitValue = count;
    return this;
  }

  offset(count: number) {
    this.offsetValue = count;
    return this;
  }

  // Generate cache key for this query
  private getCacheKey(): string {
    return JSON.stringify({
      table: this.table,
      select: this.selectFields,
      filters: this.filters,
      order: this.orderBy,
      limit: this.limitValue,
      offset: this.offsetValue
    });
  }

  // Execute query with caching
  async execute(useCache: boolean = true, cacheTTL: number = 300000) {
    const cacheKey = this.getCacheKey();
    
    // Check cache first
    if (useCache) {
      const cached = queryCache.get(cacheKey);
      if (cached) {
        return { data: cached, error: null, fromCache: true };
      }
    }

    // Build and execute query
    let query = supabase.from(this.table).select(this.selectFields);

    // Apply filters
    for (const filter of this.filters) {
      query = (query as any)[filter.operator](filter.column, filter.value);
    }

    // Apply ordering
    if (this.orderBy) {
      query = query.order(this.orderBy.column, { ascending: this.orderBy.ascending });
    }

    // Apply pagination
    if (this.limitValue !== null) {
      query = query.limit(this.limitValue);
    }
    if (this.offsetValue !== null) {
      query = query.range(this.offsetValue, this.offsetValue + (this.limitValue || 10) - 1);
    }

    // Execute with performance tracking
    const result = await performanceTracker.measureApiCall(
      `query-${this.table}`,
      () => query
    );

    // Cache successful results
    if (useCache && !result.error && result.data) {
      queryCache.set(cacheKey, result.data, cacheTTL);
    }

    return { ...result, fromCache: false };
  }
}

// Factory function for creating optimized queries
export const createOptimizedQuery = (table: string) => new OptimizedQuery(table);

// Batch query utility for multiple related queries
export const batchQueries = async (queries: Array<() => Promise<any>>) => {
  const startTime = performance.now();
  
  try {
    const results = await Promise.allSettled(queries.map(query => query()));
    const endTime = performance.now();
    
    if (process.env.NODE_ENV === 'development') {
      console.log(`Batch queries completed in ${(endTime - startTime).toFixed(2)}ms`);
    }
    
    return results.map(result => 
      result.status === 'fulfilled' ? result.value : { error: result.reason }
    );
  } catch (error) {
    const endTime = performance.now();
    
    if (process.env.NODE_ENV === 'development') {
      console.error(`Batch queries failed in ${(endTime - startTime).toFixed(2)}ms`, error);
    }
    
    throw error;
  }
};

// Optimized pagination utility
export const createPaginatedQuery = (
  table: string,
  pageSize: number = 20,
  selectFields: string = '*'
) => {
  return {
    async getPage(page: number, filters: any = {}) {
      const offset = (page - 1) * pageSize;
      
      const query = createOptimizedQuery(table)
        .select(selectFields)
        .limit(pageSize)
        .offset(offset);

      // Apply filters
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== '') {
          query.eq(key, value);
        }
      });

      return await query.execute();
    },

    async getCount(filters: any = {}) {
      const query = createOptimizedQuery(table)
        .select('count', { count: 'exact' });

      // Apply same filters for accurate count
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== '') {
          query.eq(key, value);
        }
      });

      const result = await query.execute();
      return result.data?.[0]?.count || 0;
    }
  };
};

// Real-time subscription optimizer
export const createOptimizedSubscription = (
  table: string,
  callback: (payload: any) => void,
  filters?: any
) => {
  let subscription: any = null;

  const subscribe = () => {
    let channel = supabase
      .channel(`${table}-changes`)
      .on('postgres_changes', 
        { 
          event: '*', 
          schema: 'public', 
          table: table,
          filter: filters ? Object.entries(filters).map(([key, value]) => `${key}=eq.${value}`).join(',') : undefined
        }, 
        (payload) => {
          // Invalidate cache for this table
          queryCache.clear();
          callback(payload);
        }
      )
      .subscribe();

    subscription = channel;
    return channel;
  };

  const unsubscribe = () => {
    if (subscription) {
      subscription.unsubscribe();
      subscription = null;
    }
  };

  return { subscribe, unsubscribe };
};

// Performance monitoring for queries
export const monitorQueryPerformance = () => {
  // Cleanup cache periodically
  setInterval(() => {
    queryCache.cleanup();
  }, 60000); // Every minute

  // Monitor memory usage
  if (process.env.NODE_ENV === 'development') {
    setInterval(() => {
      if ('memory' in performance) {
        const memory = (performance as any).memory;
        if (memory.usedJSHeapSize > 50 * 1024 * 1024) { // 50MB
          console.warn('High memory usage detected:', memory.usedJSHeapSize / 1024 / 1024, 'MB');
        }
      }
    }, 30000); // Every 30 seconds
  }
};

// Initialize query optimization
export const initializeQueryOptimization = () => {
  monitorQueryPerformance();
  
  // Preload critical data
  if (typeof window !== 'undefined') {
    // Preload investment plans (commonly accessed)
    createOptimizedQuery('investment_plans')
      .select('id, name, min_amount, max_amount, duration_days, expected_return')
      .eq('is_active', true)
      .execute(true, 600000); // Cache for 10 minutes
  }
};
