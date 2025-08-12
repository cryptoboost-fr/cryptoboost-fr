import React, { useEffect, Suspense } from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import { ProtectedRoute } from './components/ProtectedRoute'
import { ToastProvider } from './components/ui/toaster'
import { initializeAuth } from './store/auth'
import { initializeNavigationOptimizations } from './utils/navigationOptimization'
import { initializeCaching } from './utils/caching'
import { initializeQueryOptimization } from './utils/queryOptimization'

// Layouts (keep as direct imports for critical rendering path)
import { PublicHeader } from './components/layout/PublicHeader'
import { PublicFooter } from './components/layout/PublicFooter'

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
const Home = React.lazy(() => import('./pages/public/Home').then(module => ({ default: module.Home })));
const About = React.lazy(() => import('./pages/public/About').then(module => ({ default: module.About })));
const Contact = React.lazy(() => import('./pages/public/Contact').then(module => ({ default: module.Contact })));
const Terms = React.lazy(() => import('./pages/public/Terms').then(module => ({ default: module.Terms })));
const Privacy = React.lazy(() => import('./pages/public/Privacy').then(module => ({ default: module.Privacy })));
const PublicPlans = React.lazy(() => import('./pages/public/Plans').then(module => ({ default: module.Plans })));
const Faq = React.lazy(() => import('./pages/public/Faq').then(module => ({ default: module.Faq })));
const Help = React.lazy(() => import('./pages/public/Help').then(module => ({ default: module.Help })));
const Blog = React.lazy(() => import('./pages/public/Blog').then(module => ({ default: module.Blog })));
const Status = React.lazy(() => import('./pages/public/Status').then(module => ({ default: module.Status })));
const Api = React.lazy(() => import('./pages/public/Api').then(module => ({ default: module.Api })));
const Careers = React.lazy(() => import('./pages/public/Careers').then(module => ({ default: module.Careers })));
const Press = React.lazy(() => import('./pages/public/Press').then(module => ({ default: module.Press })));
const Licenses = React.lazy(() => import('./pages/public/Licenses').then(module => ({ default: module.Licenses })));
const Cookies = React.lazy(() => import('./pages/public/Cookies').then(module => ({ default: module.Cookies })));

// Auth pages - Critical path optimization
const Register = React.lazy(() => import('./pages/auth/Register').then(module => ({ default: module.Register })));
const PasswordReset = React.lazy(() => import('./pages/auth/PasswordReset').then(module => ({ default: module.PasswordReset })));

// Client pages - Grouped by feature for optimal chunking
const ClientDashboard = React.lazy(() => import('./pages/client/Dashboard').then(module => ({ default: module.Dashboard })));
const ClientProfile = React.lazy(() => import('./pages/client/Profile').then(module => ({ default: module.Profile })));
const ClientInvestments = React.lazy(() => import('./pages/client/Plans').then(module => ({ default: module.Plans })));
const ClientTransactions = React.lazy(() => import('./pages/client/History').then(module => ({ default: module.History })));
const ClientWallets = React.lazy(() => import('./pages/client/Wallet').then(module => ({ default: module.Wallet })));
const ClientNotifications = React.lazy(() => import('./pages/client/Notifications').then(module => ({ default: module.Notifications })));
const ClientExchange = React.lazy(() => import('./pages/client/Exchange').then(module => ({ default: module.Exchange })));

// Admin pages - Grouped by administrative function
const AdminDashboard = React.lazy(() => import('./pages/admin/Dashboard').then(module => ({ default: module.AdminDashboard })));
const Users = React.lazy(() => import('./pages/admin/Users').then(module => ({ default: module.Users })));
const Transactions = React.lazy(() => import('./pages/admin/Transactions').then(module => ({ default: module.Transactions })));
const InvestmentPlans = React.lazy(() => import('./pages/admin/InvestmentPlans').then(module => ({ default: module.InvestmentPlans })));
const SystemLogs = React.lazy(() => import('./pages/admin/SystemLogs').then(module => ({ default: module.SystemLogs })));
const CryptoWallets = React.lazy(() => import('./pages/admin/CryptoWallets').then(module => ({ default: module.CryptoWallets })));
const Settings = React.lazy(() => import('./pages/admin/Settings').then(module => ({ default: module.Settings })));

function App() {
  // Initialize authentication and performance optimizations on app start
  useEffect(() => {
    // Initialize core systems
    initializeAuth();

    // Initialize performance optimizations
    initializeNavigationOptimizations();
    initializeCaching();
    initializeQueryOptimization();
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
              <Route path="/login" element={<Navigate to="/login-alt.html" replace />} />
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
                  <ClientDashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/client/profile"
              element={
                <ProtectedRoute requireAuth={true}>
                  <ClientProfile />
                </ProtectedRoute>
              }
            />
            <Route
              path="/client/plans"
              element={
                <ProtectedRoute requireAuth={true}>
                  <ClientInvestments />
                </ProtectedRoute>
              }
            />
            <Route
              path="/client/investments"
              element={
                <ProtectedRoute requireAuth={true}>
                  <ClientInvestments />
                </ProtectedRoute>
              }
            />
            <Route
              path="/client/history"
              element={
                <ProtectedRoute requireAuth={true}>
                  <ClientTransactions />
                </ProtectedRoute>
              }
            />
            <Route
              path="/client/transactions"
              element={
                <ProtectedRoute requireAuth={true}>
                  <ClientTransactions />
                </ProtectedRoute>
              }
            />
            <Route
              path="/client/wallet"
              element={
                <ProtectedRoute requireAuth={true}>
                  <ClientWallets />
                </ProtectedRoute>
              }
            />
            <Route
              path="/client/wallets"
              element={
                <ProtectedRoute requireAuth={true}>
                  <ClientWallets />
                </ProtectedRoute>
              }
            />
            <Route
              path="/client/notifications"
              element={
                <ProtectedRoute requireAuth={true}>
                  <ClientNotifications />
                </ProtectedRoute>
              }
            />
            <Route
              path="/client/exchange"
              element={
                <ProtectedRoute requireAuth={true}>
                  <ClientExchange />
                </ProtectedRoute>
              }
            />

            {/* Routes protégées - Admin */}
            <Route
              path="/admin"
              element={
                <ProtectedRoute requireAuth={true} requireAdmin={true}>
                  <AdminDashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/users"
              element={
                <ProtectedRoute requireAuth={true} requireAdmin={true}>
                  <Users />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/transactions"
              element={
                <ProtectedRoute requireAuth={true} requireAdmin={true}>
                  <Transactions />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/investments"
              element={
                <ProtectedRoute requireAuth={true} requireAdmin={true}>
                  <InvestmentPlans />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/plans"
              element={
                <ProtectedRoute requireAuth={true} requireAdmin={true}>
                  <InvestmentPlans />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/logs"
              element={
                <ProtectedRoute requireAuth={true} requireAdmin={true}>
                  <SystemLogs />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/wallets"
              element={
                <ProtectedRoute requireAuth={true} requireAdmin={true}>
                  <CryptoWallets />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/settings"
              element={
                <ProtectedRoute requireAuth={true} requireAdmin={true}>
                  <Settings />
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