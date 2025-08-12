import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Menu, 
  X, 
  Shield, 
  TrendingUp, 
  Bot, 
  Settings,
  ChevronDown
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { useAuth } from '@/hooks/useAuth';
import { cn } from '@/lib/utils';

const navigation = [
  { name: 'Accueil', href: '/' },
  { name: 'À propos', href: '/about' },
  { name: 'Fonctionnalités', href: '/features' },
  { name: 'Tarifs', href: '/pricing' },
  { name: 'Contact', href: '/contact' },
];

const features = [
  { name: 'Trading Automatisé', href: '/features#trading', icon: Bot },
  { name: 'Sécurité', href: '/features#security', icon: Shield },
  { name: 'Performance', href: '/features#performance', icon: TrendingUp },
  { name: 'Support', href: '/features#support', icon: Settings },
];

export const PublicHeader = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isFeaturesOpen, setIsFeaturesOpen] = useState(false);
  const location = useLocation();
  const { user, logout } = useAuth();

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error('Erreur lors de la déconnexion:', error);
    }
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-md border-b border-border">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-to-r from-crypto-primary to-crypto-secondary rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">CB</span>
            </div>
            <span className="text-xl font-bold">CryptoBoost</span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            {navigation.map((item) => (
              <Link
                key={item.name}
                to={item.href}
                className={cn(
                  'text-sm font-medium transition-colors hover:text-primary',
                  location.pathname === item.href
                    ? 'text-primary'
                    : 'text-muted-foreground'
                )}
              >
                {item.name}
              </Link>
            ))}

            {/* Features Dropdown */}
            <div className="relative">
              <button
                onClick={() => setIsFeaturesOpen(!isFeaturesOpen)}
                className="flex items-center space-x-1 text-sm font-medium text-muted-foreground hover:text-primary transition-colors"
              >
                <span>Fonctionnalités</span>
                <ChevronDown className="w-4 h-4" />
              </button>
              
              <AnimatePresence>
                {isFeaturesOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="absolute top-full left-0 mt-2 w-64 bg-card border border-border rounded-lg shadow-lg py-2"
                  >
                    {features.map((feature) => (
                      <Link
                        key={feature.name}
                        to={feature.href}
                        onClick={() => setIsFeaturesOpen(false)}
                        className="flex items-center space-x-3 px-4 py-2 text-sm text-muted-foreground hover:text-foreground hover:bg-accent transition-colors"
                      >
                        <feature.icon className="w-4 h-4 text-primary" />
                        <span>{feature.name}</span>
                      </Link>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </nav>

          {/* Auth Buttons */}
          <div className="hidden md:flex items-center space-x-4">
            {user ? (
              <div className="flex items-center space-x-4">
                <Link to={user?.role === 'admin' ? '/admin/dashboard' : '/client/dashboard'}>
                  <Button variant="outline" size="sm">
                    Dashboard
                  </Button>
                </Link>
                <Link to="/client/profile">
                  <Button variant="gradient" size="sm">
                    Mon Compte
                  </Button>
                </Link>
              </div>
            ) : (
              <div className="flex items-center space-x-4">
                <Link to="/login-alt.html">
                  <Button variant="ghost" size="sm">
                    Connexion
                  </Button>
                </Link>
                <Link to="/register">
                  <Button variant="gradient" size="sm">
                    Commencer
                  </Button>
                </Link>
              </div>
            )}
          </div>

          {/* Mobile menu button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden touch-target p-2 rounded-md text-muted-foreground hover:text-foreground hover:bg-accent transition-all duration-200 active:scale-95"
            aria-label={isMenuOpen ? "Fermer le menu" : "Ouvrir le menu"}
            aria-expanded={isMenuOpen}
            aria-controls="mobile-navigation"
          >
            <motion.div
              animate={{ rotate: isMenuOpen ? 180 : 0 }}
              transition={{ duration: 0.2 }}
            >
              {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </motion.div>
          </button>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <>
            {/* Mobile overlay */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 md:hidden"
              onClick={() => setIsMenuOpen(false)}
            />

            {/* Mobile navigation panel */}
            <motion.div
              id="mobile-navigation"
              initial={{ x: '-100%', opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: '-100%', opacity: 0 }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed top-0 left-0 bottom-0 w-80 max-w-[85vw] bg-background border-r border-border z-50 md:hidden mobile-safe-area"
            >
              <div className="flex flex-col h-full">
                {/* Mobile header */}
                <div className="flex items-center justify-between p-4 border-b border-border">
                  <Link to="/" className="flex items-center space-x-2" onClick={() => setIsMenuOpen(false)}>
                    <div className="w-8 h-8 bg-gradient-to-r from-crypto-primary to-crypto-secondary rounded-lg flex items-center justify-center">
                      <span className="text-white font-bold text-sm">CB</span>
                    </div>
                    <span className="text-xl font-bold text-gradient">CryptoBoost</span>
                  </Link>
                  <button
                    onClick={() => setIsMenuOpen(false)}
                    className="touch-target p-2 rounded-md text-muted-foreground hover:text-foreground hover:bg-accent transition-colors"
                    aria-label="Fermer le menu"
                  >
                    <X className="w-6 h-6" />
                  </button>
                </div>

                {/* Mobile navigation links */}
                <nav className="flex-1 p-4 space-y-2">
                  {navigation.map((item) => (
                    <Link
                      key={item.name}
                      to={item.href}
                      onClick={() => setIsMenuOpen(false)}
                      className={cn(
                        'flex items-center space-x-3 px-4 py-3 rounded-xl text-base font-medium transition-all duration-200 touch-target',
                        location.pathname === item.href
                          ? 'text-primary bg-accent shadow-sm'
                          : 'text-muted-foreground hover:text-foreground hover:bg-accent/50'
                      )}
                    >
                      <span>{item.name}</span>
                    </Link>
                  ))}

              {/* Mobile Features */}
              <div className="px-3 py-2">
                <h3 className="text-sm font-medium text-muted-foreground mb-2">Fonctionnalités</h3>
                {features.map((feature) => (
                  <Link
                    key={feature.name}
                    to={feature.href}
                    onClick={() => setIsMenuOpen(false)}
                    className="flex items-center space-x-3 px-3 py-2 rounded-md text-sm text-muted-foreground hover:text-foreground hover:bg-accent"
                  >
                    <feature.icon className="w-4 h-4 text-primary" />
                    <span>{feature.name}</span>
                  </Link>
                ))}
              </div>

              {/* Mobile Auth */}
              <div className="pt-4 border-t border-border">
                {user ? (
                  <div className="space-y-2">
                    <Link to={user?.role === 'admin' ? '/admin/dashboard' : '/client/dashboard'} onClick={() => setIsMenuOpen(false)}>
                      <Button variant="outline" className="w-full">
                        Dashboard
                      </Button>
                    </Link>
                    <Link to="/client/profile" onClick={() => setIsMenuOpen(false)}>
                      <Button variant="gradient" className="w-full">
                        Mon Compte
                      </Button>
                    </Link>
                  </div>
                ) : (
                  <div className="space-y-2">
                    <Link to="/login-alt.html" onClick={() => setIsMenuOpen(false)}>
                      <Button variant="ghost" className="w-full">
                        Connexion
                      </Button>
                    </Link>
                    <Link to="/register" onClick={() => setIsMenuOpen(false)}>
                      <Button variant="gradient" className="w-full">
                        Commencer
                      </Button>
                    </Link>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </header>
  );
};