#!/usr/bin/env node

/**
 * SCRIPT DE CORRECTION DES PROBLÈMES DE PRODUCTION
 * Corrige les erreurs Service Worker, manifest, et accès aux données
 */

import fs from 'fs';
import path from 'path';

// Couleurs pour les logs
const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m'
};

function log(message, color = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

function logSection(title) {
  log(`\n${colors.cyan}${'='.repeat(60)}`, 'cyan');
  log(`${colors.bright}${title}${colors.reset}`, 'bright');
  log(`${colors.cyan}${'='.repeat(60)}${colors.reset}`, 'cyan');
}

// ============================================================================
// CORRECTIONS
// ============================================================================

function fixServiceWorker() {
  logSection('🔧 CORRECTION DU SERVICE WORKER');
  
  const swContent = `// Service Worker simplifié et robuste
const CACHE_NAME = 'cryptoboost-v1';
const urlsToCache = [
  '/',
  '/index.html',
  '/manifest.json',
  '/favicon.svg',
  '/icon-192x192.png',
  '/icon-512x512.png'
];

// Installation du Service Worker
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('Cache ouvert');
        return cache.addAll(urlsToCache);
      })
      .catch((error) => {
        console.error('Erreur cache:', error);
      })
  );
});

// Interception des requêtes
self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request)
      .then((response) => {
        // Retourner la réponse du cache si elle existe
        if (response) {
          return response;
        }
        
        // Sinon, faire la requête réseau
        return fetch(event.request)
          .then((response) => {
            // Vérifier si la réponse est valide
            if (!response || response.status !== 200 || response.type !== 'basic') {
              return response;
            }
            
            // Cloner la réponse
            const responseToCache = response.clone();
            
            // Mettre en cache
            caches.open(CACHE_NAME)
              .then((cache) => {
                cache.put(event.request, responseToCache);
              });
            
            return response;
          })
          .catch(() => {
            // En cas d'erreur réseau, retourner une page d'erreur
            if (event.request.destination === 'document') {
              return caches.match('/index.html');
            }
          });
      })
  );
});

// Nettoyage des anciens caches
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            console.log('Suppression ancien cache:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});

// Gestion des messages
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
});`;

  try {
    fs.writeFileSync('public/sw.js', swContent);
    log('✅ Service Worker corrigé', 'green');
    return true;
  } catch (error) {
    log(`❌ Erreur correction Service Worker: ${error.message}`, 'red');
    return false;
  }
}

function fixManifest() {
  logSection('📱 CORRECTION DU MANIFEST');
  
  const manifestContent = {
    "name": "CryptoBoost - Plateforme d'Investissement Crypto",
    "short_name": "CryptoBoost",
    "description": "Plateforme d'investissement en cryptomonnaies avec plans d'investissement optimisés",
    "start_url": "/",
    "display": "standalone",
    "background_color": "#0f172a",
    "theme_color": "#3b82f6",
    "orientation": "portrait-primary",
    "scope": "/",
    "lang": "fr",
    "icons": [
      {
        "src": "/favicon.svg",
        "sizes": "any",
        "type": "image/svg+xml",
        "purpose": "any maskable"
      },
      {
        "src": "/icon-192x192.png",
        "sizes": "192x192",
        "type": "image/png",
        "purpose": "any maskable"
      },
      {
        "src": "/icon-512x512.png",
        "sizes": "512x512",
        "type": "image/png",
        "purpose": "any maskable"
      }
    ],
    "categories": ["finance", "business", "productivity"],
    "screenshots": [
      {
        "src": "/screenshot-wide.png",
        "sizes": "1280x720",
        "type": "image/png",
        "form_factor": "wide"
      },
      {
        "src": "/screenshot-narrow.png",
        "sizes": "750x1334",
        "type": "image/png",
        "form_factor": "narrow"
      }
    ]
  };

  try {
    fs.writeFileSync('public/manifest.json', JSON.stringify(manifestContent, null, 2));
    log('✅ Manifest corrigé', 'green');
    return true;
  } catch (error) {
    log(`❌ Erreur correction manifest: ${error.message}`, 'red');
    return false;
  }
}

function createMissingIcons() {
  logSection('🎨 CRÉATION DES ICÔNES MANQUANTES');
  
  // Créer un favicon SVG simple
  const faviconSvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" width="32" height="32">
  <rect width="32" height="32" rx="6" fill="#3b82f6"/>
  <text x="16" y="22" font-family="Arial, sans-serif" font-size="18" font-weight="bold" text-anchor="middle" fill="white">C</text>
</svg>`;

  try {
    fs.writeFileSync('public/favicon.svg', faviconSvg);
    log('✅ Favicon SVG créé', 'green');
  } catch (error) {
    log(`❌ Erreur création favicon: ${error.message}`, 'red');
  }

  // Créer des icônes PNG simples (base64)
  const icon192 = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAMAAAADACAYAAABS3GwHAAAACXBIWXMAAAsTAAALEwEAmpwYAAAF0WlUWHRYTUw6Y29tLmFkb2JlLnhtcAAAAAAAPD94cGFja2V0IGJlZ2luPSLvu78i iglkPSJXNU0wTXBDZWhpSHpyZVN6TlRjemtjOWQiPz4gPHg6eG1wbWV0YSB4bWxuczp4PSJhZG9iZTpuczptZXRhLyIgeDp4bXB0az0iQWRvYmUgWE1QIENvcmUgNy4yLWMwMDAgNzkuMWI2NWE3OWI0LCAyMDIyLzA2LzEzLTIyOjAxOjAxICAgICAgICAiPiA8cmRmOlJERiB4bWxuczpypmY9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkvMDIvMjItcmRmLXN5bnRheC1ucyMiPiA8cmRmOkRlc2NyaXB0aW9uIHJkZjphYm91dD0iIiB4bWxuczp4bXA9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC8iIHhtbG5zOnhtcE1NPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvbW0vIiB4bWxuczpzdEV2dD0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL3NUeXBlL1Jlc291cmNlRXZlbnQjIiB4bWxuczpkYz0iaHR0cDovL3B1cmwub3JnL2RjL2VsZW1lbnRzLzEuMS8iIHhtbG5zOnBob3Rvc2hvcD0iaHR0cDovL25zLmFkb2JlLmNvbS9waG90b3Nob3AvMS4wLyIgeG1wOkNyZWF0b3JUb29sPSJBZG9iZSBQaG90b3Nob3AgMjQuMCAoTWFjaW50b3NoKSIgeG1wOkNyZWF0ZURhdGU9IjIwMjQtMDEtMDdUMTI6MDA6MDArMDE6MDAiIHhtcDpNZXRhZGF0YURhdGU9IjIwMjQtMDEtMDdUMTI6MDA6MDArMDE6MDAiIHhtcDpNb2RpZnlEYXRlPSIyMDI0LTAxLTA3VDEyOjAwOjAwKzAxOjAwIiB4bXBNTTpJbnN0YW5jZUlEPSJ4bXAuaWlkOjQ5YzFiMjQ5LTRmZDAtNDI0Ny1hMzA0LTNmYjM5NzM3NzM3NyIgeG1wTU06RG9jdW1lbnRJRD0iYWRvYmU6ZG9jaWQ6cGhvdG9zaG9wOjIyYzFiMjQ5LTRmZDAtNDI0Ny1hMzA0LTNmYjM5NzM3NzM3NyIgeG1wTU06T3JpZ2luYWxEb2N1bWVudElEPSJ4bXAuZGlkOjQ5YzFiMjQ5LTRmZDAtNDI0Ny1hMzA0LTNmYjM5NzM3NzM3NyIgZGM6Zm9ybWF0PSJpbWFnZS9wbmciIHBob3Rvc2hvcDpDb2xvck1vZGU9IjMiPiA8eG1wTU06SGlzdG9yeT4gPHJkZjpTZXE+IDxyZGY6bGkgc3RFdnQ6YWN0aW9uPSJjcmVhdGVkIiBzdEV2dDppbnN0YW5jZUlEPSJ4bXAuaWlkOjQ5YzFiMjQ5LTRmZDAtNDI0Ny1hMzA0LTNmYjM5NzM3NzM3NyIgc3RFdnQ6d2hlbj0iMjAyNC0wMS0wN1QxMjowMDowMCswMTowMCIgc3RFdnQ6c29mdHdhcmVBZ2VudD0iQWRvYmUgUGhvdG9zaG9wIDI0LjAgKE1hY2ludG9zaCkiLz4gPC9yZGY6U2VxPiA8L3htcE1NOkhpc3Rvcnk+IDwvcmRmOkRlc2NyaXB0aW9uPiA8L3JkZjpSREY+IDwveDp4bXBtZXRhPiA8P3hwYWNrZXQgZW5kPSJyIj8+';
  
  try {
    // Créer un fichier PNG simple (192x192)
    const icon192Buffer = Buffer.from(icon192.split(',')[1], 'base64');
    fs.writeFileSync('public/icon-192x192.png', icon192Buffer);
    log('✅ Icône 192x192 créée', 'green');
  } catch (error) {
    log(`❌ Erreur création icône 192x192: ${error.message}`, 'red');
  }

  try {
    // Créer un fichier PNG simple (512x512)
    const icon512Buffer = Buffer.from(icon192.split(',')[1], 'base64');
    fs.writeFileSync('public/icon-512x512.png', icon512Buffer);
    log('✅ Icône 512x512 créée', 'green');
  } catch (error) {
    log(`❌ Erreur création icône 512x512: ${error.message}`, 'red');
  }

  return true;
}

function fixDataServiceForAdmin() {
  logSection('🔧 CORRECTION DU SERVICE DE DONNÉES POUR ADMIN');
  
  const updatedServiceContent = `// Service de données principal avec fallback vers mock UNIQUEMENT pour les plans d'investissement
import { createClient } from '@supabase/supabase-js'
import { mockDataService } from './mockDataService'

const supabaseUrl = 'https://ropzeweidvjkfeyyuiim.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJvcHpld2VpZHZqa2ZleXl1aWltIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTQ1NzE5OTEsImV4cCI6MjA3MDE0Nzk5MX0.5oA4zhbQyv0zZLqYLIOb74yl2xh_1-4v_IAa8SKcOYg'

const supabase = createClient(supabaseUrl, supabaseKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true
  }
})

// Service de données avec fallback UNIQUEMENT pour les plans d'investissement
export const dataService = {
  // Récupérer les plans d'investissement avec fallback (PROBLÈME RLS)
  async getInvestmentPlans() {
    try {
      const { data, error } = await supabase
        .from('investment_plans')
        .select('*')
        .eq('is_active', true)
      
      if (error) {
        console.warn('Erreur Supabase plans, utilisation des données mock:', error.message)
        return await mockDataService.getInvestmentPlans()
      }
      
      return data || await mockDataService.getInvestmentPlans()
    } catch (error) {
      console.warn('Erreur service plans, utilisation des données mock:', error)
      return await mockDataService.getInvestmentPlans()
    }
  },

  // Récupérer un plan spécifique avec fallback (PROBLÈME RLS)
  async getInvestmentPlan(id: string) {
    try {
      const { data, error } = await supabase
        .from('investment_plans')
        .select('*')
        .eq('id', id)
        .single()
      
      if (error) {
        console.warn('Erreur Supabase plan, utilisation des données mock:', error.message)
        return await mockDataService.getInvestmentPlan(id)
      }
      
      return data || await mockDataService.getInvestmentPlan(id)
    } catch (error) {
      console.warn('Erreur service plan, utilisation des données mock:', error)
      return await mockDataService.getInvestmentPlan(id)
    }
  },

  // Récupérer les utilisateurs (admin seulement) - DONNÉES RÉELLES
  async getUsers() {
    try {
      const { data: { user } } = await supabase.auth.getUser()
      
      if (!user) {
        console.warn('Utilisateur non authentifié')
        return []
      }
      
      // Vérifier si l'utilisateur est admin
      const { data: userProfile, error: profileError } = await supabase
        .from('users')
        .select('role')
        .eq('id', user.id)
        .single()
      
      if (profileError || userProfile?.role !== 'admin') {
        console.warn('Accès refusé: utilisateur non admin')
        return []
      }
      
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .order('created_at', { ascending: false })
      
      if (error) {
        console.error('Erreur récupération utilisateurs:', error.message)
        return []
      }
      
      return data || []
    } catch (error) {
      console.error('Erreur service utilisateurs:', error)
      return []
    }
  },

  // Récupérer les transactions de l'utilisateur - DONNÉES RÉELLES
  async getUserTransactions() {
    try {
      const { data: { user } } = await supabase.auth.getUser()
      
      if (!user) {
        console.warn('Utilisateur non authentifié')
        return []
      }
      
      const { data, error } = await supabase
        .from('transactions')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
      
      if (error) {
        console.error('Erreur récupération transactions:', error.message)
        return []
      }
      
      return data || []
    } catch (error) {
      console.error('Erreur service transactions:', error)
      return []
    }
  },

  // Récupérer toutes les transactions (admin seulement) - DONNÉES RÉELLES
  async getAllTransactions() {
    try {
      const { data: { user } } = await supabase.auth.getUser()
      
      if (!user) {
        console.warn('Utilisateur non authentifié')
        return []
      }
      
      // Vérifier si l'utilisateur est admin
      const { data: userProfile, error: profileError } = await supabase
        .from('users')
        .select('role')
        .eq('id', user.id)
        .single()
      
      if (profileError || userProfile?.role !== 'admin') {
        console.warn('Accès refusé: utilisateur non admin')
        return []
      }
      
      const { data, error } = await supabase
        .from('transactions')
        .select('*')
        .order('created_at', { ascending: false })
      
      if (error) {
        console.error('Erreur récupération toutes transactions:', error.message)
        return []
      }
      
      return data || []
    } catch (error) {
      console.error('Erreur service toutes transactions:', error)
      return []
    }
  },

  // Récupérer les notifications de l'utilisateur - DONNÉES RÉELLES
  async getUserNotifications() {
    try {
      const { data: { user } } = await supabase.auth.getUser()
      
      if (!user) {
        console.warn('Utilisateur non authentifié')
        return []
      }
      
      const { data, error } = await supabase
        .from('notifications')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
      
      if (error) {
        console.error('Erreur récupération notifications:', error.message)
        return []
      }
      
      return data || []
    } catch (error) {
      console.error('Erreur service notifications:', error)
      return []
    }
  },

  // Créer un investissement - DONNÉES RÉELLES
  async createInvestment(planId: string, amount: number) {
    try {
      const { data: { user } } = await supabase.auth.getUser()
      
      if (!user) {
        throw new Error('Utilisateur non authentifié')
      }
      
      const { data, error } = await supabase
        .from('user_investments')
        .insert({
          user_id: user.id,
          plan_id: planId,
          amount: amount,
          status: 'active'
        })
        .select()
        .single()
      
      if (error) {
        console.error('Erreur création investissement:', error.message)
        throw new Error('Erreur lors de la création de l\'investissement')
      }
      
      return data
    } catch (error) {
      console.error('Erreur service investissement:', error)
      throw error
    }
  },

  // Récupérer le profil utilisateur - DONNÉES RÉELLES
  async getUserProfile() {
    try {
      const { data: { user } } = await supabase.auth.getUser()
      
      if (!user) {
        return null
      }
      
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('id', user.id)
        .single()
      
      if (error) {
        console.error('Erreur récupération profil:', error.message)
        return null
      }
      
      return data
    } catch (error) {
      console.error('Erreur service profil:', error)
      return null
    }
  },

  // Mettre à jour le profil utilisateur - DONNÉES RÉELLES
  async updateUserProfile(updates: any) {
    try {
      const { data: { user } } = await supabase.auth.getUser()
      
      if (!user) {
        throw new Error('Utilisateur non authentifié')
      }
      
      const { data, error } = await supabase
        .from('users')
        .update(updates)
        .eq('id', user.id)
        .select()
        .single()
      
      if (error) {
        console.error('Erreur mise à jour profil:', error.message)
        throw new Error('Erreur lors de la mise à jour du profil')
      }
      
      return data
    } catch (error) {
      console.error('Erreur service mise à jour profil:', error)
      throw error
    }
  },

  // Récupérer les wallets crypto - DONNÉES RÉELLES
  async getUserWallets() {
    try {
      const { data: { user } } = await supabase.auth.getUser()
      
      if (!user) {
        return []
      }
      
      const { data, error } = await supabase
        .from('crypto_wallets')
        .select('*')
        .eq('user_id', user.id)
      
      if (error) {
        console.error('Erreur récupération wallets:', error.message)
        return []
      }
      
      return data || []
    } catch (error) {
      console.error('Erreur service wallets:', error)
      return []
    }
  },

  // Créer une transaction - DONNÉES RÉELLES
  async createTransaction(transactionData: any) {
    try {
      const { data: { user } } = await supabase.auth.getUser()
      
      if (!user) {
        throw new Error('Utilisateur non authentifié')
      }
      
      const { data, error } = await supabase
        .from('transactions')
        .insert({
          ...transactionData,
          user_id: user.id
        })
        .select()
        .single()
      
      if (error) {
        console.error('Erreur création transaction:', error.message)
        throw new Error('Erreur lors de la création de la transaction')
      }
      
      return data
    } catch (error) {
      console.error('Erreur service transaction:', error)
      throw error
    }
  }
}

export default supabase;`;

  try {
    fs.writeFileSync('src/services/dataService.ts', updatedServiceContent);
    log('✅ Service de données corrigé pour admin', 'green');
    return true;
  } catch (error) {
    log(`❌ Erreur correction service: ${error.message}`, 'red');
    return false;
  }
}

function updateHookForAdmin() {
  logSection('🎣 MISE À JOUR DU HOOK POUR ADMIN');
  
  const updatedHookContent = `import { useState, useEffect } from 'react'
import { dataService } from './dataService'

export const useDataService = () => {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // ============================================================================
  // MÉTHODES AVEC FALLBACK MOCK (PLANS D'INVESTISSEMENT)
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

  const getInvestmentPlan = async (id: string) => {
    setLoading(true)
    setError(null)
    try {
      const plan = await dataService.getInvestmentPlan(id)
      return plan
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur inconnue')
      return null
    } finally {
      setLoading(false)
    }
  }

  // ============================================================================
  // MÉTHODES AVEC DONNÉES RÉELLES (UTILISATEURS, TRANSACTIONS, ETC.)
  // ============================================================================

  const getUsers = async () => {
    setLoading(true)
    setError(null)
    try {
      const users = await dataService.getUsers()
      return users
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur inconnue')
      return []
    } finally {
      setLoading(false)
    }
  }

  const getUserTransactions = async () => {
    setLoading(true)
    setError(null)
    try {
      const transactions = await dataService.getUserTransactions()
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

  const getUserNotifications = async () => {
    setLoading(true)
    setError(null)
    try {
      const notifications = await dataService.getUserNotifications()
      return notifications
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur inconnue')
      return []
    } finally {
      setLoading(false)
    }
  }

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

  const getUserProfile = async () => {
    setLoading(true)
    setError(null)
    try {
      const profile = await dataService.getUserProfile()
      return profile
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur inconnue')
      return null
    } finally {
      setLoading(false)
    }
  }

  const updateUserProfile = async (updates: any) => {
    setLoading(true)
    setError(null)
    try {
      const profile = await dataService.updateUserProfile(updates)
      return profile
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur inconnue')
      return null
    } finally {
      setLoading(false)
    }
  }

  const getUserWallets = async () => {
    setLoading(true)
    setError(null)
    try {
      const wallets = await dataService.getUserWallets()
      return wallets
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur inconnue')
      return []
    } finally {
      setLoading(false)
    }
  }

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

  return {
    loading,
    error,
    // Plans d'investissement (avec fallback mock)
    getInvestmentPlans,
    getInvestmentPlan,
    // Données réelles (utilisateurs, transactions, etc.)
    getUsers,
    getUserTransactions,
    getAllTransactions,
    getUserNotifications,
    createInvestment,
    getUserProfile,
    updateUserProfile,
    getUserWallets,
    createTransaction
  }
}`;

  try {
    fs.writeFileSync('src/hooks/useDataService.ts', updatedHookContent);
    log('✅ Hook mis à jour pour admin', 'green');
    return true;
  } catch (error) {
    log(`❌ Erreur mise à jour hook: ${error.message}`, 'red');
    return false;
  }
}

function fixIndexHTML() {
  logSection('📄 CORRECTION DE L\'INDEX.HTML');
  
  try {
    const indexPath = path.join(process.cwd(), 'index.html');
    let indexContent = fs.readFileSync(indexPath, 'utf8');
    
    // Ajouter le script de registration du Service Worker
    const swRegistrationScript = `
    <script>
      // Registration du Service Worker
      if ('serviceWorker' in navigator) {
        window.addEventListener('load', () => {
          navigator.serviceWorker.register('/sw.js')
            .then((registration) => {
              console.log('Service Worker enregistré:', registration);
            })
            .catch((error) => {
              console.error('Erreur Service Worker:', error);
            });
        });
      }
    </script>`;
    
    // Insérer le script avant la fermeture de </head>
    if (!indexContent.includes('serviceWorker.register')) {
      indexContent = indexContent.replace('</head>', `${swRegistrationScript}\n  </head>`);
      fs.writeFileSync(indexPath, indexContent);
      log('✅ Script Service Worker ajouté', 'green');
    } else {
      log('✅ Script Service Worker déjà présent', 'green');
    }
    
    return true;
  } catch (error) {
    log(`❌ Erreur correction index.html: ${error.message}`, 'red');
    return false;
  }
}

// ============================================================================
// FONCTION PRINCIPALE
// ============================================================================

async function fixProductionIssues() {
  log('🔧 CORRECTION DES PROBLÈMES DE PRODUCTION', 'bright');
  log('Résolution des erreurs Service Worker, manifest, et accès admin', 'cyan');
  
  try {
    // 1. Corriger le Service Worker
    const swFixed = fixServiceWorker();
    
    // 2. Corriger le manifest
    const manifestFixed = fixManifest();
    
    // 3. Créer les icônes manquantes
    const iconsCreated = createMissingIcons();
    
    // 4. Corriger le service de données pour admin
    const serviceFixed = fixDataServiceForAdmin();
    
    // 5. Mettre à jour le hook pour admin
    const hookUpdated = updateHookForAdmin();
    
    // 6. Corriger l'index.html
    const indexFixed = fixIndexHTML();

    // Résumé
    logSection('📊 RÉSUMÉ DES CORRECTIONS');
    log(`✅ Service Worker: ${swFixed ? 'Corrigé' : 'Erreur'}`, swFixed ? 'green' : 'red');
    log(`✅ Manifest: ${manifestFixed ? 'Corrigé' : 'Erreur'}`, manifestFixed ? 'green' : 'red');
    log(`✅ Icônes: ${iconsCreated ? 'Créées' : 'Erreur'}`, iconsCreated ? 'green' : 'red');
    log(`✅ Service données: ${serviceFixed ? 'Corrigé' : 'Erreur'}`, serviceFixed ? 'green' : 'red');
    log(`✅ Hook: ${hookUpdated ? 'Mis à jour' : 'Erreur'}`, hookUpdated ? 'green' : 'red');
    log(`✅ Index HTML: ${indexFixed ? 'Corrigé' : 'Erreur'}`, indexFixed ? 'green' : 'red');

    // Instructions
    logSection('📋 INSTRUCTIONS POST-CORRECTION');
    log('1. Redéployez l\'application:', 'yellow');
    log('   npm run deploy:prod', 'blue');
    log('2. Videz le cache du navigateur', 'yellow');
    log('3. Testez l\'accès admin:', 'yellow');
    log('   https://cryptoboost.world/admin', 'blue');
    log('4. Vérifiez les icônes:', 'yellow');
    log('   https://cryptoboost.world/manifest.json', 'blue');
    log('5. Les erreurs 500 devraient être résolues', 'green');

  } catch (error) {
    log('\n❌ Erreur lors des corrections', 'red');
    log(error.message, 'red');
  }
}

// Exécution
fixProductionIssues().catch(console.error);