import React, { useEffect, Suspense } from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import { ProtectedRoute } from './components/ProtectedRoute'
import { ToastProvider } from './components/ui/toaster'
import { initializeNavigationOptimizations, cleanupNavigationOptimizations } from './utils/navigationOptimization'
import { initializeCaching, cleanupCaching } from './utils/caching'
import { initializeQueryOptimization, cleanupQueryMonitoring } from './utils/queryOptimization'

// Layouts (keep as direct imports for critical rendering path)
import { PublicHeader } from './components/layout/PublicHeader'
import { PublicFooter } from './components/layout/PublicFooter'
import { ClientLayout } from './components/layout/ClientLayout'
import { AdminLayout } from './components/layout/AdminLayout'

// Performance-optimized loading component
const PageLoader = () => (
  <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 via-blue-900 to-gray-900">
    <div className="text-center space-y-4">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
      <p className="text-white text-sm">Chargement...</p>
    </div>
  </div>
);

// Lazy-loaded pages for optimal performance
// Public pages - Split into separate chunks
const Home = React.lazy(() => import('./pages/public/Home'));
const About = React.lazy(() => import('./pages/public/About'));
const Contact = React.lazy(() => import('./pages/public/Contact'));
const Terms = React.lazy(() => import('./pages/public/Terms'));
const Privacy = React.lazy(() => import('./pages/public/Privacy'));
const PublicPlans = React.lazy(() => import('./pages/public/Plans'));
const Faq = React.lazy(() => import('./pages/public/Faq'));
const Help = React.lazy(() => import('./pages/public/Help'));
const Blog = React.lazy(() => import('./pages/public/Blog'));
const Status = React.lazy(() => import('./pages/public/Status'));
const Api = React.lazy(() => import('./pages/public/Api'));
const Careers = React.lazy(() => import('./pages/public/Careers'));
const Press = React.lazy(() => import('./pages/public/Press'));
const Licenses = React.lazy(() => import('./pages/public/Licenses'));
const Cookies = React.lazy(() => import('./pages/public/Cookies'));

// Auth pages - Critical path optimization
const Login = React.lazy(() => import('./pages/auth/Login'));
const Register = React.lazy(() => import('./pages/auth/Register'));
const PasswordReset = React.lazy(() => import('./pages/auth/PasswordReset'));

// Client pages - Grouped by feature for optimal chunking
const ClientDashboard = React.lazy(() => import('./pages/client/Dashboard'));
const ClientProfile = React.lazy(() => import('./pages/client/Profile'));
const ClientInvestments = React.lazy(() => import('./pages/client/Plans'));
const ClientTransactions = React.lazy(() => import('./pages/client/History'));
const ClientWallets = React.lazy(() => import('./pages/client/Wallet'));
const ClientNotifications = React.lazy(() => import('./pages/client/Notifications'));
const ClientExchange = React.lazy(() => import('./pages/client/Exchange'));

// Admin pages - Grouped by administrative function
const AdminDashboard = React.lazy(() => import('./pages/admin/Dashboard'));
const Users = React.lazy(() => import('./pages/admin/Users'));
const Transactions = React.lazy(() => import('./pages/admin/Transactions'));
const InvestmentPlans = React.lazy(() => import('./pages/admin/InvestmentPlans'));
const SystemLogs = React.lazy(() => import('./pages/admin/SystemLogs'));
const CryptoWallets = React.lazy(() => import('./pages/admin/CryptoWallets'));
const Settings = React.lazy(() => import('./pages/admin/Settings'));

function App() {
  // Initialize performance optimizations on app start
  // Note: Auth is already initialized in main.tsx to avoid duplicate listeners
  useEffect(() => {
    // Initialize performance optimizations
    initializeNavigationOptimizations();
    initializeCaching();
    initializeQueryOptimization();

    // Cleanup function to prevent memory leaks
    return () => {
      cleanupNavigationOptimizations();
      cleanupCaching();
      cleanupQueryMonitoring();
    };
  }, []);

  return (
    <ToastProvider>
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-gray-900">
        <PublicHeader />
        <main className="flex-1">
          <Suspense fallback={<PageLoader />}>
            <Routes>
              {/* Routes publiques */}
              <Route path="/" element={<Home />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/password-reset" element={<PasswordReset />} />
              <Route path="/about" element={<About />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/terms" element={<Terms />} />
              <Route path="/privacy" element={<Privacy />} />
              <Route path="/plans" element={<PublicPlans />} />
              <Route path="/faq" element={<Faq />} />
              <Route path="/help" element={<Help />} />
              <Route path="/blog" element={<Blog />} />
              <Route path="/status" element={<Status />} />
              <Route path="/api" element={<Api />} />
              <Route path="/careers" element={<Careers />} />
              <Route path="/press" element={<Press />} />
              <Route path="/licenses" element={<Licenses />} />
              <Route path="/cookies" element={<Cookies />} />

            {/* Routes protégées - Client */}
            <Route
              path="/client"
              element={
                <ProtectedRoute requireAuth={true}>
                  <ClientLayout>
                    <ClientDashboard />
                  </ClientLayout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/client/profile"
              element={
                <ProtectedRoute requireAuth={true}>
                  <ClientLayout>
                    <ClientProfile />
                  </ClientLayout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/client/plans"
              element={
                <ProtectedRoute requireAuth={true}>
                  <ClientLayout>
                    <ClientInvestments />
                  </ClientLayout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/client/investments"
              element={
                <ProtectedRoute requireAuth={true}>
                  <ClientLayout>
                    <ClientInvestments />
                  </ClientLayout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/client/history"
              element={
                <ProtectedRoute requireAuth={true}>
                  <ClientLayout>
                    <ClientTransactions />
                  </ClientLayout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/client/transactions"
              element={
                <ProtectedRoute requireAuth={true}>
                  <ClientLayout>
                    <ClientTransactions />
                  </ClientLayout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/client/wallet"
              element={
                <ProtectedRoute requireAuth={true}>
                  <ClientLayout>
                    <ClientWallets />
                  </ClientLayout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/client/wallets"
              element={
                <ProtectedRoute requireAuth={true}>
                  <ClientLayout>
                    <ClientWallets />
                  </ClientLayout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/client/notifications"
              element={
                <ProtectedRoute requireAuth={true}>
                  <ClientLayout>
                    <ClientNotifications />
                  </ClientLayout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/client/exchange"
              element={
                <ProtectedRoute requireAuth={true}>
                  <ClientLayout>
                    <ClientExchange />
                  </ClientLayout>
                </ProtectedRoute>
              }
            />

            {/* Routes protégées - Admin */}
            <Route
              path="/admin"
              element={
                <ProtectedRoute requireAuth={true} requireAdmin={true}>
                  <AdminLayout>
                    <AdminDashboard />
                  </AdminLayout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/users"
              element={
                <ProtectedRoute requireAuth={true} requireAdmin={true}>
                  <AdminLayout>
                    <Users />
                  </AdminLayout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/transactions"
              element={
                <ProtectedRoute requireAuth={true} requireAdmin={true}>
                  <AdminLayout>
                    <Transactions />
                  </AdminLayout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/investments"
              element={
                <ProtectedRoute requireAuth={true} requireAdmin={true}>
                  <AdminLayout>
                    <InvestmentPlans />
                  </AdminLayout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/plans"
              element={
                <ProtectedRoute requireAuth={true} requireAdmin={true}>
                  <AdminLayout>
                    <InvestmentPlans />
                  </AdminLayout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/system-logs"
              element={
                <ProtectedRoute requireAuth={true} requireAdmin={true}>
                  <AdminLayout>
                    <SystemLogs />
                  </AdminLayout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/crypto-wallets"
              element={
                <ProtectedRoute requireAuth={true} requireAdmin={true}>
                  <AdminLayout>
                    <CryptoWallets />
                  </AdminLayout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/settings"
              element={
                <ProtectedRoute requireAuth={true} requireAdmin={true}>
                  <AdminLayout>
                    <Settings />
                  </AdminLayout>
                </ProtectedRoute>
              }
            />

            {/* Route par défaut */}
            <Route
              path="*"
              element={<Navigate to="/" replace />}
            />
            </Routes>
          </Suspense>
        </main>
        <PublicFooter />
      </div>
    </ToastProvider>
  )
}

export default App