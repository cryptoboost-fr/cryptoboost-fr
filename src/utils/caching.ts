/**
 * Advanced Caching Strategies for CryptoBoost
 * Implements multiple caching layers for optimal performance
 */

// Cache configuration
interface CacheConfig {
  ttl: number; // Time to live in milliseconds
  maxSize: number; // Maximum number of entries
  strategy: 'lru' | 'fifo' | 'lfu'; // Cache eviction strategy
}

// Cache entry interface
interface CacheEntry<T> {
  data: T;
  timestamp: number;
  accessCount: number;
  lastAccessed: number;
}

// Advanced cache implementation
class AdvancedCache<T> {
  private cache = new Map<string, CacheEntry<T>>();
  private config: CacheConfig;

  constructor(config: Partial<CacheConfig> = {}) {
    this.config = {
      ttl: 5 * 60 * 1000, // 5 minutes default
      maxSize: 100,
      strategy: 'lru',
      ...config
    };
  }

  set(key: string, data: T, customTTL?: number): void {
    const now = Date.now();
    
    // Remove expired entries before adding new one
    this.cleanup();
    
    // If cache is full, evict based on strategy
    if (this.cache.size >= this.config.maxSize) {
      this.evict();
    }

    this.cache.set(key, {
      data,
      timestamp: now,
      accessCount: 0,
      lastAccessed: now
    });
  }

  get(key: string): T | null {
    const entry = this.cache.get(key);
    if (!entry) return null;

    const now = Date.now();
    
    // Check if expired
    if (now - entry.timestamp > this.config.ttl) {
      this.cache.delete(key);
      return null;
    }

    // Update access statistics
    entry.accessCount++;
    entry.lastAccessed = now;
    
    return entry.data;
  }

  has(key: string): boolean {
    return this.get(key) !== null;
  }

  delete(key: string): boolean {
    return this.cache.delete(key);
  }

  clear(): void {
    this.cache.clear();
  }

  size(): number {
    return this.cache.size;
  }

  // Remove expired entries
  private cleanup(): void {
    const now = Date.now();
    for (const [key, entry] of this.cache.entries()) {
      if (now - entry.timestamp > this.config.ttl) {
        this.cache.delete(key);
      }
    }
  }

  // Evict entries based on strategy
  private evict(): void {
    if (this.cache.size === 0) return;

    let keyToEvict: string;

    switch (this.config.strategy) {
      case 'lru': // Least Recently Used
        keyToEvict = this.findLRU();
        break;
      case 'lfu': // Least Frequently Used
        keyToEvict = this.findLFU();
        break;
      case 'fifo': // First In, First Out
      default:
        keyToEvict = this.cache.keys().next().value;
        break;
    }

    this.cache.delete(keyToEvict);
  }

  private findLRU(): string {
    let oldestKey = '';
    let oldestTime = Date.now();

    for (const [key, entry] of this.cache.entries()) {
      if (entry.lastAccessed < oldestTime) {
        oldestTime = entry.lastAccessed;
        oldestKey = key;
      }
    }

    return oldestKey;
  }

  private findLFU(): string {
    let leastUsedKey = '';
    let leastCount = Infinity;

    for (const [key, entry] of this.cache.entries()) {
      if (entry.accessCount < leastCount) {
        leastCount = entry.accessCount;
        leastUsedKey = key;
      }
    }

    return leastUsedKey;
  }

  // Get cache statistics
  getStats() {
    const now = Date.now();
    let totalAccess = 0;
    let expiredCount = 0;

    for (const entry of this.cache.values()) {
      totalAccess += entry.accessCount;
      if (now - entry.timestamp > this.config.ttl) {
        expiredCount++;
      }
    }

    return {
      size: this.cache.size,
      maxSize: this.config.maxSize,
      totalAccess,
      expiredCount,
      hitRate: totalAccess > 0 ? (this.cache.size / totalAccess) * 100 : 0
    };
  }
}

// Specialized caches for different data types
export const userDataCache = new AdvancedCache<any>({
  ttl: 10 * 60 * 1000, // 10 minutes for user data
  maxSize: 50,
  strategy: 'lru'
});

export const transactionCache = new AdvancedCache<any>({
  ttl: 2 * 60 * 1000, // 2 minutes for transaction data
  maxSize: 100,
  strategy: 'lru'
});

export const staticDataCache = new AdvancedCache<any>({
  ttl: 30 * 60 * 1000, // 30 minutes for static data
  maxSize: 200,
  strategy: 'lfu'
});

// Browser storage cache with compression
class BrowserStorageCache {
  private prefix: string;
  private storage: Storage;

  constructor(prefix: string = 'cb_cache_', useSessionStorage: boolean = false) {
    this.prefix = prefix;
    this.storage = useSessionStorage ? sessionStorage : localStorage;
  }

  set(key: string, data: any, ttl: number = 5 * 60 * 1000): void {
    try {
      const item = {
        data,
        timestamp: Date.now(),
        ttl
      };
      
      // Compress large objects
      const serialized = JSON.stringify(item);
      this.storage.setItem(this.prefix + key, serialized);
    } catch (error) {
      // Handle storage quota exceeded
      this.cleanup();
      try {
        const item = { data, timestamp: Date.now(), ttl };
        this.storage.setItem(this.prefix + key, JSON.stringify(item));
      } catch {
        // If still failing, clear all cache
        this.clear();
      }
    }
  }

  get(key: string): any | null {
    try {
      const item = this.storage.getItem(this.prefix + key);
      if (!item) return null;

      const parsed = JSON.parse(item);
      const now = Date.now();

      if (now - parsed.timestamp > parsed.ttl) {
        this.storage.removeItem(this.prefix + key);
        return null;
      }

      return parsed.data;
    } catch {
      return null;
    }
  }

  delete(key: string): void {
    this.storage.removeItem(this.prefix + key);
  }

  clear(): void {
    const keys = Object.keys(this.storage);
    keys.forEach(key => {
      if (key.startsWith(this.prefix)) {
        this.storage.removeItem(key);
      }
    });
  }

  // Remove expired entries
  cleanup(): void {
    const keys = Object.keys(this.storage);
    const now = Date.now();

    keys.forEach(key => {
      if (key.startsWith(this.prefix)) {
        try {
          const item = JSON.parse(this.storage.getItem(key) || '');
          if (now - item.timestamp > item.ttl) {
            this.storage.removeItem(key);
          }
        } catch {
          // Remove corrupted entries
          this.storage.removeItem(key);
        }
      }
    });
  }

  // Get storage usage
  getUsage(): { used: number; available: number } {
    let used = 0;
    const keys = Object.keys(this.storage);
    
    keys.forEach(key => {
      if (key.startsWith(this.prefix)) {
        used += (this.storage.getItem(key) || '').length;
      }
    });

    // Estimate available space (5MB typical limit)
    const available = 5 * 1024 * 1024 - used;
    
    return { used, available };
  }
}

// Export cache instances
export const localCache = new BrowserStorageCache('cb_local_');
export const sessionCache = new BrowserStorageCache('cb_session_', true);

// Service Worker cache management
export const swCache = {
  // Cache API responses
  cacheApiResponse: async (url: string, response: Response, ttl: number = 300000) => {
    if ('caches' in window) {
      try {
        const cache = await caches.open('cryptoboost-api-v1');
        const responseClone = response.clone();
        
        // Add TTL header
        const headers = new Headers(responseClone.headers);
        headers.set('sw-cache-ttl', (Date.now() + ttl).toString());
        
        const modifiedResponse = new Response(responseClone.body, {
          status: responseClone.status,
          statusText: responseClone.statusText,
          headers
        });
        
        await cache.put(url, modifiedResponse);
      } catch (error) {
        console.warn('Failed to cache API response:', error);
      }
    }
  },

  // Get cached API response
  getCachedResponse: async (url: string): Promise<Response | null> => {
    if ('caches' in window) {
      try {
        const cache = await caches.open('cryptoboost-api-v1');
        const response = await cache.match(url);
        
        if (response) {
          const ttl = response.headers.get('sw-cache-ttl');
          if (ttl && Date.now() > parseInt(ttl)) {
            await cache.delete(url);
            return null;
          }
          return response;
        }
      } catch (error) {
        console.warn('Failed to get cached response:', error);
      }
    }
    return null;
  },

  // Clear expired cache entries
  clearExpired: async () => {
    if ('caches' in window) {
      try {
        const cache = await caches.open('cryptoboost-api-v1');
        const requests = await cache.keys();
        
        for (const request of requests) {
          const response = await cache.match(request);
          if (response) {
            const ttl = response.headers.get('sw-cache-ttl');
            if (ttl && Date.now() > parseInt(ttl)) {
              await cache.delete(request);
            }
          }
        }
      } catch (error) {
        console.warn('Failed to clear expired cache:', error);
      }
    }
  }
};

// Initialize caching system
export const initializeCaching = () => {
  // Cleanup expired entries on startup
  localCache.cleanup();
  sessionCache.cleanup();
  swCache.clearExpired();

  // Set up periodic cleanup
  setInterval(() => {
    localCache.cleanup();
    sessionCache.cleanup();
    swCache.clearExpired();
  }, 60000); // Every minute

  // Monitor storage usage
  if (process.env.NODE_ENV === 'development') {
    setInterval(() => {
      const usage = localCache.getUsage();
      if (usage.used > 1024 * 1024) { // 1MB
        console.log(`Cache usage: ${(usage.used / 1024 / 1024).toFixed(2)}MB`);
      }
    }, 30000); // Every 30 seconds
  }
};
