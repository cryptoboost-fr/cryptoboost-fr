import React, { useState } from 'react';
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  Menu, 
  X, 
  Home, 
  Wallet, 
  TrendingUp, 
  ArrowLeftRight, 
  History, 
  Bell,
  LogOut,
  Settings,
  Zap
} from 'lucide-react';
import { useAuthStore } from '@/store/auth';
import { useToast } from '@/components/ui/toaster';
import { utils } from '@/lib/supabase';

export const ClientLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { user, signOut } = useAuthStore();
  const { toast } = useToast();

  const navigation = [
    { 
      name: 'Dashboard', 
      href: '/client/dashboard', 
      icon: Home,
      description: 'Vue d\'ensemble de vos investissements'
    },
    { 
      name: 'Wallet', 
      href: '/client/wallet', 
      icon: Wallet,
      description: 'Gérer vos dépôts et retraits'
    },
    { 
      name: 'Plans', 
      href: '/client/plans', 
      icon: TrendingUp,
      description: 'Investir dans des plans automatisés'
    },
    { 
      name: 'Exchange', 
      href: '/client/exchange', 
      icon: ArrowLeftRight,
      description: 'Convertir vos cryptos'
    },
    { 
      name: 'Historique', 
      href: '/client/history', 
      icon: History,
      description: 'Suivi de vos transactions'
    },
    { 
      name: 'Notifications', 
      href: '/client/notifications', 
      icon: Bell,
      description: 'Vos notifications'
    },
  ];

  const handleSignOut = async () => {
    try {
      await signOut();
      toast('Déconnexion réussie', 'success');
      navigate('/');
    } catch (error) {
      toast('Erreur lors de la déconnexion', 'error');
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm lg:hidden mobile-nav-overlay"
          onClick={() => setSidebarOpen(false)}
          aria-hidden="true"
        />
      )}

      {/* Sidebar */}
      <motion.div
        initial={{ x: -300 }}
        animate={{ x: sidebarOpen ? 0 : -300 }}
        transition={{ type: 'spring', damping: 25, stiffness: 200 }}
        className={`fixed inset-y-0 left-0 z-50 w-72 max-w-[85vw] bg-card border-r border-border lg:translate-x-0 lg:static lg:inset-0 lg:w-64 mobile-safe-area ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-border">
            <Link to="/client/dashboard" className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-r from-crypto-primary to-crypto-secondary rounded-lg flex items-center justify-center">
                <Zap className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold text-gradient">CryptoBoost</span>
            </Link>
            <button
              onClick={() => setSidebarOpen(false)}
              className="lg:hidden touch-target p-2 rounded-md text-muted-foreground hover:text-foreground hover:bg-accent transition-all duration-200 active:scale-95"
              aria-label="Fermer le menu"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* User Info */}
          <div className="p-6 border-b border-border">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-r from-crypto-primary to-crypto-secondary rounded-full flex items-center justify-center">
                <span className="text-white font-semibold">
                  {user?.full_name?.charAt(0) || 'U'}
                </span>
              </div>
              <div>
                <p className="font-medium text-foreground">{user?.full_name}</p>
                <p className="text-sm text-muted-foreground">{user?.email}</p>
              </div>
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex-1 p-4 space-y-1" role="navigation" aria-label="Navigation principale du dashboard">
            {navigation.map((item) => {
              const isActive = location.pathname === item.href;
              return (
                <Link
                  key={item.name}
                  to={item.href}
                  onClick={() => setSidebarOpen(false)}
                  className={`group flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 ${
                    isActive
                      ? 'bg-gradient-to-r from-crypto-primary to-crypto-secondary text-white shadow-lg shadow-crypto-primary/25'
                      : 'text-muted-foreground hover:text-foreground hover:bg-accent/50 hover:shadow-md'
                  }`}
                  aria-current={isActive ? 'page' : undefined}
                >
                  <div className={`p-1.5 rounded-lg transition-all duration-200 ${
                    isActive 
                      ? 'bg-white/20' 
                      : 'bg-muted/50 group-hover:bg-muted'
                  }`}>
                    <item.icon className="w-4 h-4" aria-hidden="true" />
                  </div>
                  <div className="flex-1">
                    <span className="font-semibold text-sm">{item.name}</span>
                    <p className={`text-xs mt-0.5 ${
                      isActive ? 'text-white/80' : 'text-muted-foreground'
                    }`}>
                      {item.description}
                    </p>
                  </div>
                </Link>
              );
            })}
          </nav>

          {/* Footer */}
          <div className="p-4 border-t border-border space-y-2">
            <Link
              to="/client/profile"
              onClick={() => setSidebarOpen(false)}
              className="flex items-center space-x-3 px-4 py-3 rounded-xl text-muted-foreground hover:text-foreground hover:bg-accent/50 transition-all duration-200 group"
            >
              <div className="p-1.5 rounded-lg bg-muted/50 group-hover:bg-muted transition-all duration-200">
                <Settings className="w-4 h-4" />
              </div>
              <div>
                <span className="font-semibold text-sm">Profil</span>
                <p className="text-xs text-muted-foreground">Gérer votre compte</p>
              </div>
            </Link>
            <button
              onClick={handleSignOut}
              className="flex items-center space-x-3 px-4 py-3 rounded-xl text-muted-foreground hover:text-red-600 hover:bg-red-50 transition-all duration-200 w-full group"
            >
              <div className="p-1.5 rounded-lg bg-muted/50 group-hover:bg-red-100 transition-all duration-200">
                <LogOut className="w-4 h-4" />
              </div>
              <div>
                <span className="font-semibold text-sm">Déconnexion</span>
                <p className="text-xs text-muted-foreground">Quitter la session</p>
              </div>
            </button>
          </div>
        </div>
      </motion.div>

      {/* Main Content */}
      <div className="lg:pl-64">
        {/* Top Bar */}
        <div className="sticky top-0 z-30 bg-background/95 backdrop-blur-md border-b border-border shadow-sm">
          <div className="flex items-center justify-between px-4 sm:px-6 lg:px-8 h-16">
            <button
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden touch-target p-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-accent transition-all duration-200 active:scale-95"
              aria-label="Ouvrir le menu"
              aria-expanded={sidebarOpen}
            >
              <Menu className="w-6 h-6" />
            </button>

            <div className="flex items-center space-x-6">
              <div className="hidden sm:flex items-center space-x-6">
                <div className="flex items-center space-x-2 px-3 py-1.5 bg-green-50 rounded-lg">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span className="text-sm font-medium text-green-700">
                    Solde: {utils.formatEUR(user?.total_invested || 0)}
                  </span>
                </div>
                <div className="flex items-center space-x-2 px-3 py-1.5 bg-blue-50 rounded-lg">
                  <TrendingUp className="w-4 h-4 text-blue-600" />
                  <span className="text-sm font-medium text-blue-700">
                    Profit: {utils.formatEUR(user?.total_profit || 0)}
                  </span>
                </div>
              </div>
              
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-gradient-to-r from-crypto-primary to-crypto-secondary rounded-full flex items-center justify-center">
                  <span className="text-white font-semibold text-sm">
                    {user?.full_name?.charAt(0) || 'U'}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Page Content */}
        <main id="main-content" role="main" aria-label="Contenu principal du dashboard client" className="p-4 sm:p-6 lg:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
}; 