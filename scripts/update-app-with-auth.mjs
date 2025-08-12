#!/usr/bin/env node

/**
 * SCRIPT DE MISE À JOUR APP.TSX AVEC AUTHENTIFICATION
 * Intègre l'AuthProvider et les routes protégées
 */

import fs from 'fs';

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
// MISE À JOUR APP.TSX
// ============================================================================

function updateAppWithAuth() {
  logSection('🔧 MISE À JOUR APP.TSX AVEC AUTHENTIFICATION');
  
  const appContent = `import React from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider } from './contexts/AuthContext'
import { ProtectedRoute } from './components/ProtectedRoute'
import { Toaster } from './components/ui/toaster'

// Pages publiques
import Home from './pages/Home'
import Login from './pages/Login'
import Register from './pages/Register'

// Pages protégées - Client
import ClientDashboard from './pages/ClientDashboard'
import ClientProfile from './pages/ClientProfile'
import ClientInvestments from './pages/ClientInvestments'
import ClientTransactions from './pages/ClientTransactions'
import ClientWallets from './pages/ClientWallets'

// Pages protégées - Admin
import AdminDashboard from './pages/AdminDashboard'
import AdminUsers from './pages/AdminUsers'
import AdminTransactions from './pages/AdminTransactions'
import AdminInvestments from './pages/AdminInvestments'
import AdminPlans from './pages/AdminPlans'
import AdminLogs from './pages/AdminLogs'

// Composants
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import LoadingSpinner from './components/LoadingSpinner'

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-gray-900">
          <Navbar />
          <main className="flex-1">
            <Routes>
              {/* Routes publiques */}
              <Route path="/" element={<Home />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              
              {/* Routes protégées - Client */}
              <Route 
                path="/client" 
                element={
                  <ProtectedRoute requireAuth>
                    <ClientDashboard />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/client/profile" 
                element={
                  <ProtectedRoute requireAuth>
                    <ClientProfile />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/client/investments" 
                element={
                  <ProtectedRoute requireAuth>
                    <ClientInvestments />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/client/transactions" 
                element={
                  <ProtectedRoute requireAuth>
                    <ClientTransactions />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/client/wallets" 
                element={
                  <ProtectedRoute requireAuth>
                    <ClientWallets />
                  </ProtectedRoute>
                } 
              />
              
              {/* Routes protégées - Admin */}
              <Route 
                path="/admin" 
                element={
                  <ProtectedRoute requireAuth requireAdmin>
                    <AdminDashboard />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/admin/users" 
                element={
                  <ProtectedRoute requireAuth requireAdmin>
                    <AdminUsers />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/admin/transactions" 
                element={
                  <ProtectedRoute requireAuth requireAdmin>
                    <AdminTransactions />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/admin/investments" 
                element={
                  <ProtectedRoute requireAuth requireAdmin>
                    <AdminInvestments />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/admin/plans" 
                element={
                  <ProtectedRoute requireAuth requireAdmin>
                    <AdminPlans />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/admin/logs" 
                element={
                  <ProtectedRoute requireAuth requireAdmin>
                    <AdminLogs />
                  </ProtectedRoute>
                } 
              />
              
              {/* Route par défaut - redirection basée sur le rôle */}
              <Route 
                path="*" 
                element={
                  <ProtectedRoute requireAuth={false}>
                    <Navigate to="/" replace />
                  </ProtectedRoute>
                } 
              />
            </Routes>
          </main>
          <Footer />
          <Toaster />
        </div>
      </Router>
    </AuthProvider>
  )
}

export default App`;

  try {
    fs.writeFileSync('src/App.tsx', appContent);
    log('✅ App.tsx mis à jour avec AuthProvider', 'green');
    return true;
  } catch (error) {
    log(`❌ Erreur mise à jour App.tsx: ${error.message}`, 'red');
    return false;
  }
}

// ============================================================================
// CRÉATION DE PAGES MANQUANTES
// ============================================================================

function createMissingPages() {
  logSection('📄 CRÉATION DES PAGES MANQUANTES');
  
  const pages = [
    {
      path: 'src/pages/ClientDashboard.tsx',
      content: `import React, { useEffect, useState } from 'react'
import { useAuth } from '../contexts/AuthContext'
import { useDataService } from '../hooks/useDataService'
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card'
import { Button } from '../components/ui/button'
import { useToast } from '../hooks/use-toast'

export default function ClientDashboard() {
  const { user, isAdmin } = useAuth()
  const { getUserProfile, getUserTransactions, getUserInvestments, getUserWallets } = useDataService()
  const { toast } = useToast()
  const [profile, setProfile] = useState(null)
  const [transactions, setTransactions] = useState([])
  const [investments, setInvestments] = useState([])
  const [wallets, setWallets] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadData = async () => {
      try {
        const [profileData, transactionsData, investmentsData, walletsData] = await Promise.all([
          getUserProfile(),
          getUserTransactions(),
          getUserInvestments(),
          getUserWallets()
        ])
        
        setProfile(profileData)
        setTransactions(transactionsData)
        setInvestments(investmentsData)
        setWallets(walletsData)
      } catch (error) {
        toast({
          title: "Erreur",
          description: "Impossible de charger les données",
          variant: "destructive"
        })
      } finally {
        setLoading(false)
      }
    }

    if (user) {
      loadData()
    }
  }, [user])

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-white mb-2">Dashboard Client</h1>
        <p className="text-gray-300">Bienvenue, {profile?.full_name || user?.email}</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <Card className="bg-white/10 backdrop-blur-sm border-white/20">
          <CardHeader>
            <CardTitle className="text-white">Solde Total</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-green-400">
              ${transactions.reduce((sum, t) => sum + (t.amount || 0), 0).toLocaleString()}
            </p>
          </CardContent>
        </Card>

        <Card className="bg-white/10 backdrop-blur-sm border-white/20">
          <CardHeader>
            <CardTitle className="text-white">Investissements Actifs</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-blue-400">
              {investments.filter(i => i.status === 'active').length}
            </p>
          </CardContent>
        </Card>

        <Card className="bg-white/10 backdrop-blur-sm border-white/20">
          <CardHeader>
            <CardTitle className="text-white">Wallets Crypto</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-purple-400">
              {wallets.length}
            </p>
          </CardContent>
        </Card>

        <Card className="bg-white/10 backdrop-blur-sm border-white/20">
          <CardHeader>
            <CardTitle className="text-white">Transactions</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-yellow-400">
              {transactions.length}
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <Card className="bg-white/10 backdrop-blur-sm border-white/20">
          <CardHeader>
            <CardTitle className="text-white">Dernières Transactions</CardTitle>
          </CardHeader>
          <CardContent>
            {transactions.slice(0, 5).map((transaction) => (
              <div key={transaction.id} className="flex justify-between items-center py-2 border-b border-white/10">
                <div>
                  <p className="text-white font-medium">{transaction.type}</p>
                  <p className="text-gray-300 text-sm">{transaction.description}</p>
                </div>
                <div className="text-right">
                  <p className="text-white font-bold">${transaction.amount}</p>
                  <p className="text-gray-300 text-sm">{transaction.status}</p>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card className="bg-white/10 backdrop-blur-sm border-white/20">
          <CardHeader>
            <CardTitle className="text-white">Investissements Actifs</CardTitle>
          </CardHeader>
          <CardContent>
            {investments.filter(i => i.status === 'active').slice(0, 5).map((investment) => (
              <div key={investment.id} className="flex justify-between items-center py-2 border-b border-white/10">
                <div>
                  <p className="text-white font-medium">{investment.investment_plans?.name}</p>
                  <p className="text-gray-300 text-sm">{investment.investment_plans?.interest_rate}%</p>
                </div>
                <div className="text-right">
                  <p className="text-white font-bold">${investment.amount}</p>
                  <p className="text-gray-300 text-sm">{investment.status}</p>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}`
    },
    {
      path: 'src/pages/AdminDashboard.tsx',
      content: `import React, { useEffect, useState } from 'react'
import { useAuth } from '../contexts/AuthContext'
import { useDataService } from '../hooks/useDataService'
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card'
import { useToast } from '../hooks/use-toast'

export default function AdminDashboard() {
  const { user } = useAuth()
  const { getAllUsers, getAllTransactions, getAllInvestments } = useDataService()
  const { toast } = useToast()
  const [users, setUsers] = useState([])
  const [transactions, setTransactions] = useState([])
  const [investments, setInvestments] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadData = async () => {
      try {
        const [usersData, transactionsData, investmentsData] = await Promise.all([
          getAllUsers(),
          getAllTransactions(),
          getAllInvestments()
        ])
        
        setUsers(usersData)
        setTransactions(transactionsData)
        setInvestments(investmentsData)
      } catch (error) {
        toast({
          title: "Erreur",
          description: "Impossible de charger les données",
          variant: "destructive"
        })
      } finally {
        setLoading(false)
      }
    }

    if (user) {
      loadData()
    }
  }, [user])

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  const totalRevenue = transactions.reduce((sum, t) => sum + (t.amount || 0), 0)
  const activeInvestments = investments.filter(i => i.status === 'active')
  const totalInvestments = activeInvestments.reduce((sum, i) => sum + (i.amount || 0), 0)

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-white mb-2">Dashboard Administrateur</h1>
        <p className="text-gray-300">Gestion complète de la plateforme</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <Card className="bg-white/10 backdrop-blur-sm border-white/20">
          <CardHeader>
            <CardTitle className="text-white">Utilisateurs Totaux</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-blue-400">
              {users.length}
            </p>
          </CardContent>
        </Card>

        <Card className="bg-white/10 backdrop-blur-sm border-white/20">
          <CardHeader>
            <CardTitle className="text-white">Revenus Totaux</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-green-400">
              ${totalRevenue.toLocaleString()}
            </p>
          </CardContent>
        </Card>

        <Card className="bg-white/10 backdrop-blur-sm border-white/20">
          <CardHeader>
            <CardTitle className="text-white">Investissements Actifs</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-purple-400">
              ${totalInvestments.toLocaleString()}
            </p>
          </CardContent>
        </Card>

        <Card className="bg-white/10 backdrop-blur-sm border-white/20">
          <CardHeader>
            <CardTitle className="text-white">Transactions</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-yellow-400">
              {transactions.length}
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <Card className="bg-white/10 backdrop-blur-sm border-white/20">
          <CardHeader>
            <CardTitle className="text-white">Utilisateurs Récents</CardTitle>
          </CardHeader>
          <CardContent>
            {users.slice(0, 5).map((user) => (
              <div key={user.id} className="flex justify-between items-center py-2 border-b border-white/10">
                <div>
                  <p className="text-white font-medium">{user.full_name}</p>
                  <p className="text-gray-300 text-sm">{user.email}</p>
                </div>
                <div className="text-right">
                  <span className="px-2 py-1 text-xs rounded-full bg-blue-500 text-white">
                    {user.role}
                  </span>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card className="bg-white/10 backdrop-blur-sm border-white/20">
          <CardHeader>
            <CardTitle className="text-white">Transactions Récentes</CardTitle>
          </CardHeader>
          <CardContent>
            {transactions.slice(0, 5).map((transaction) => (
              <div key={transaction.id} className="flex justify-between items-center py-2 border-b border-white/10">
                <div>
                  <p className="text-white font-medium">{transaction.type}</p>
                  <p className="text-gray-300 text-sm">{transaction.users?.full_name}</p>
                </div>
                <div className="text-right">
                  <p className="text-white font-bold">${transaction.amount}</p>
                  <p className="text-gray-300 text-sm">{transaction.status}</p>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}`
    }
  ]

  let createdCount = 0
  for (const page of pages) {
    try {
      if (!fs.existsSync(page.path)) {
        fs.writeFileSync(page.path, page.content)
        log(`✅ Page créée: ${page.path}`, 'green')
        createdCount++
      } else {
        log(`⚠️  Page existe déjà: ${page.path}`, 'yellow')
      }
    } catch (error) {
      log(`❌ Erreur création ${page.path}: ${error.message}`, 'red')
    }
  }

  return createdCount
}

// ============================================================================
// FONCTION PRINCIPALE
// ============================================================================

async function updateAppWithAuthComplete() {
  log('🔧 MISE À JOUR COMPLÈTE AVEC AUTHENTIFICATION', 'bright');
  log('Intégration de l\'AuthProvider et création des pages manquantes', 'cyan');
  
  try {
    // 1. Mettre à jour App.tsx
    const appUpdated = updateAppWithAuth();
    
    // 2. Créer les pages manquantes
    const pagesCreated = createMissingPages();

    // Résumé
    logSection('📊 RÉSUMÉ DE LA MISE À JOUR');
    log(`✅ App.tsx mis à jour: ${appUpdated ? 'Oui' : 'Non'}`, appUpdated ? 'green' : 'red');
    log(`✅ Pages créées: ${pagesCreated}`, 'green');

    // Instructions
    logSection('📋 INSTRUCTIONS POST-MISE À JOUR');
    log('1. L\'authentification est maintenant intégrée', 'green');
    log('2. Les routes sont protégées par rôle', 'green');
    log('3. Testez l\'application:', 'yellow');
    log('   - Inscription: https://cryptoboost.world/register', 'blue');
    log('   - Connexion: https://cryptoboost.world/login', 'blue');
    log('   - Dashboard client: https://cryptoboost.world/client', 'blue');
    log('   - Dashboard admin: https://cryptoboost.world/admin', 'blue');
    log('4. Chaque rôle a son propre dashboard !', 'green');

  } catch (error) {
    log('\n❌ Erreur lors de la mise à jour', 'red');
    log(error.message, 'red');
  }
}

// Exécution
updateAppWithAuthComplete().catch(console.error);