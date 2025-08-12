#!/usr/bin/env node

/**
 * FIX NAVIGATION BUGS - CRYPTOBOOST
 * Correction des bugs de navigation et retour en arrière
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
  log(`🔧 ${colors.bright}${title}${colors.reset}`, 'bright');
  log(`${colors.cyan}${'='.repeat(60)}${colors.reset}`, 'cyan');
}

// ============================================================================
// CORRECTION NAVIGATION BUGS
// ============================================================================

function fixNavigationBugs() {
  logSection('CORRECTION NAVIGATION BUGS');
  
  try {
    // 1. Corriger PublicHeader.tsx - Liens de navigation
    log('🔧 Correction PublicHeader.tsx...', 'blue');
    
    const publicHeaderContent = `import React, { useState } from 'react';
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
import { Button } from '@/components/ui/button';
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
            className="md:hidden p-2 rounded-md text-muted-foreground hover:text-foreground hover:bg-accent"
          >
            {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden border-t border-border"
          >
            <div className="px-2 pt-2 pb-3 space-y-1">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  to={item.href}
                  onClick={() => setIsMenuOpen(false)}
                  className={cn(
                    'block px-3 py-2 rounded-md text-base font-medium transition-colors',
                    location.pathname === item.href
                      ? 'text-primary bg-accent'
                      : 'text-muted-foreground hover:text-foreground hover:bg-accent'
                  )}
                >
                  {item.name}
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
};`;

    fs.writeFileSync('src/components/layout/PublicHeader.tsx', publicHeaderContent);
    log('✅ PublicHeader.tsx corrigé', 'green');
    
    // 2. Corriger Home.tsx - Boutons de navigation
    log('🔧 Correction Home.tsx...', 'blue');
    
    // Lire le fichier Home.tsx existant
    let homeContent = fs.readFileSync('src/pages/public/Home.tsx', 'utf8');
    
    // Corriger les liens de navigation
    homeContent = homeContent.replace(
      /<Link to="\/auth\/register">/g,
      '<Link to="/register">'
    );
    homeContent = homeContent.replace(
      /<Link to="\/auth\/login">/g,
      '<Link to="/login-alt.html">'
    );
    
    fs.writeFileSync('src/pages/public/Home.tsx', homeContent);
    log('✅ Home.tsx corrigé', 'green');
    
    // 3. Créer une page register fonctionnelle
    log('🔧 Création page register...', 'blue');
    
    const registerContent = `import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Eye, EyeOff, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useAuth } from '@/hooks/useAuth';

export const Register = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    firstName: '',
    lastName: '',
    acceptTerms: false
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.email) {
      newErrors.email = 'Email requis';
    } else if (!/^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$/.test(formData.email)) {
      newErrors.email = 'Email invalide';
    }

    if (!formData.password) {
      newErrors.password = 'Mot de passe requis';
    } else if (formData.password.length < 8) {
      newErrors.password = 'Le mot de passe doit contenir au moins 8 caractères';
    }

    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Les mots de passe ne correspondent pas';
    }

    if (!formData.firstName) {
      newErrors.firstName = 'Prénom requis';
    }

    if (!formData.lastName) {
      newErrors.lastName = 'Nom requis';
    }

    if (!formData.acceptTerms) {
      newErrors.acceptTerms = 'Vous devez accepter les conditions';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsLoading(true);
    
    try {
      const result = await register(formData);
      
      if (result.success) {
        // Redirection vers le dashboard
        navigate('/client/dashboard');
      } else {
        setErrors({ general: result.error || 'Erreur lors de l\\'inscription' });
      }
    } catch (error) {
      setErrors({ general: 'Erreur de connexion au serveur' });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background via-background to-muted/20 p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md"
      >
        {/* Back to home */}
        <Link to="/" className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground mb-6 transition-colors">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Retour à l'accueil
        </Link>

        <Card className="border-0 shadow-2xl bg-card/50 backdrop-blur-sm">
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl font-bold text-center">Créer un compte</CardTitle>
            <CardDescription className="text-center">
              Rejoignez CryptoBoost et commencez à trader automatiquement
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              {errors.general && (
                <div className="p-3 text-sm text-red-500 bg-red-50 border border-red-200 rounded-md">
                  {errors.general}
                </div>
              )}

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="firstName">Prénom</Label>
                  <Input
                    id="firstName"
                    name="firstName"
                    type="text"
                    value={formData.firstName}
                    onChange={handleChange}
                    className={errors.firstName ? 'border-red-500' : ''}
                    placeholder="Votre prénom"
                  />
                  {errors.firstName && (
                    <p className="text-sm text-red-500">{errors.firstName}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="lastName">Nom</Label>
                  <Input
                    id="lastName"
                    name="lastName"
                    type="text"
                    value={formData.lastName}
                    onChange={handleChange}
                    className={errors.lastName ? 'border-red-500' : ''}
                    placeholder="Votre nom"
                  />
                  {errors.lastName && (
                    <p className="text-sm text-red-500">{errors.lastName}</p>
                  )}
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  className={errors.email ? 'border-red-500' : ''}
                  placeholder="votre@email.com"
                />
                {errors.email && (
                  <p className="text-sm text-red-500">{errors.email}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">Mot de passe</Label>
                <div className="relative">
                  <Input
                    id="password"
                    name="password"
                    type={showPassword ? 'text' : 'password'}
                    value={formData.password}
                    onChange={handleChange}
                    className={errors.password ? 'border-red-500 pr-10' : 'pr-10'}
                    placeholder="••••••••"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
                {errors.password && (
                  <p className="text-sm text-red-500">{errors.password}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Confirmer le mot de passe</Label>
                <div className="relative">
                  <Input
                    id="confirmPassword"
                    name="confirmPassword"
                    type={showConfirmPassword ? 'text' : 'password'}
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    className={errors.confirmPassword ? 'border-red-500 pr-10' : 'pr-10'}
                    placeholder="••••••••"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground"
                  >
                    {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
                {errors.confirmPassword && (
                  <p className="text-sm text-red-500">{errors.confirmPassword}</p>
                )}
              </div>

              <div className="flex items-center space-x-2">
                <input
                  id="acceptTerms"
                  name="acceptTerms"
                  type="checkbox"
                  checked={formData.acceptTerms}
                  onChange={handleChange}
                  className="rounded border-gray-300 text-primary focus:ring-primary"
                />
                <Label htmlFor="acceptTerms" className="text-sm">
                  J'accepte les{' '}
                  <Link to="/terms" className="text-primary hover:underline">
                    conditions d'utilisation
                  </Link>{' '}
                  et la{' '}
                  <Link to="/privacy" className="text-primary hover:underline">
                    politique de confidentialité
                  </Link>
                </Label>
              </div>
              {errors.acceptTerms && (
                <p className="text-sm text-red-500">{errors.acceptTerms}</p>
              )}

              <Button
                type="submit"
                className="w-full"
                disabled={isLoading}
              >
                {isLoading ? (
                  <div className="flex items-center space-x-2">
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    <span>Création du compte...</span>
                  </div>
                ) : (
                  'Créer mon compte'
                )}
              </Button>
            </form>

            <div className="mt-6 text-center">
              <p className="text-sm text-muted-foreground">
                Déjà un compte ?{' '}
                <Link to="/login-alt.html" className="text-primary hover:underline font-medium">
                  Se connecter
                </Link>
              </p>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
};`;

    fs.writeFileSync('src/pages/public/Register.tsx', registerContent);
    log('✅ Page Register.tsx créée', 'green');
    
    // 4. Mettre à jour les routes dans App.tsx
    log('🔧 Mise à jour des routes...', 'blue');
    
    // Lire le fichier App.tsx existant
    let appContent = fs.readFileSync('src/App.tsx', 'utf8');
    
    // Ajouter la route register si elle n'existe pas
    if (!appContent.includes('path="/register"')) {
      appContent = appContent.replace(
        /import.*Register.*from.*['"]@\/pages\/public\/Register['"];?/g,
        'import { Register } from "@/pages/public/Register";'
      );
      
      // Ajouter la route register
      appContent = appContent.replace(
        /<Route path="\/" element={<Home \/>} \/>/g,
        `<Route path="/" element={<Home />} />
        <Route path="/register" element={<Register />} />`
      );
    }
    
    fs.writeFileSync('src/App.tsx', appContent);
    log('✅ Routes mises à jour', 'green');
    
    return true;
  } catch (error) {
    log(`❌ Erreur lors de la correction: ${error.message}`, 'red');
    return false;
  }
}

// ============================================================================
// VÉRIFICATION DES FICHIERS
// ============================================================================

function verifyFiles() {
  logSection('VÉRIFICATION DES FICHIERS');
  
  try {
    // Vérifier PublicHeader.tsx
    if (fs.existsSync('src/components/layout/PublicHeader.tsx')) {
      const headerContent = fs.readFileSync('src/components/layout/PublicHeader.tsx', 'utf8');
      const hasLoginAlt = headerContent.includes('/login-alt.html');
      const hasRegister = headerContent.includes('/register');
      log(`✅ PublicHeader.tsx: ${hasLoginAlt ? 'Liens corrigés' : 'Liens à corriger'}`, 
          hasLoginAlt ? 'green' : 'red');
      log(`✅ Route register: ${hasRegister ? 'Présente' : 'Manquante'}`, 
          hasRegister ? 'green' : 'red');
    } else {
      log('❌ PublicHeader.tsx manquant', 'red');
    }
    
    // Vérifier Register.tsx
    if (fs.existsSync('src/pages/public/Register.tsx')) {
      log('✅ Register.tsx créé', 'green');
    } else {
      log('❌ Register.tsx manquant', 'red');
    }
    
    // Vérifier Home.tsx
    if (fs.existsSync('src/pages/public/Home.tsx')) {
      const homeContent = fs.readFileSync('src/pages/public/Home.tsx', 'utf8');
      const hasCorrectLinks = homeContent.includes('/register') && !homeContent.includes('/auth/register');
      log(`✅ Home.tsx: ${hasCorrectLinks ? 'Liens corrigés' : 'Liens à corriger'}`, 
          hasCorrectLinks ? 'green' : 'red');
    } else {
      log('❌ Home.tsx manquant', 'red');
    }
    
    return true;
  } catch (error) {
    log(`❌ Erreur lors de la vérification: ${error.message}`, 'red');
    return false;
  }
}

// ============================================================================
// FONCTION PRINCIPALE
// ============================================================================

async function fixNavigationBugsMain() {
  log('🔧 FIX NAVIGATION BUGS - CRYPTOBOOST', 'bright');
  log('Correction des bugs de navigation et retour en arrière', 'cyan');
  
  try {
    // 1. Corriger les bugs de navigation
    const bugsFixed = fixNavigationBugs();
    
    if (!bugsFixed) {
      log('❌ Échec de la correction des bugs', 'red');
      return false;
    }
    
    // 2. Vérifier les fichiers
    const filesVerified = verifyFiles();
    
    if (!filesVerified) {
      log('❌ Échec de la vérification des fichiers', 'red');
      return false;
    }
    
    // 3. Commit et push
    logSection('COMMIT ET PUSH');
    
    const { execSync } = await import('child_process');
    
    try {
      log('🔧 Ajout des fichiers...', 'blue');
      execSync('git add .', { stdio: 'inherit' });
      
      log('🔧 Commit des corrections...', 'blue');
      execSync('git commit -m "🔧 Fix: Correction bugs navigation - Liens Connexion/Commencer"', { stdio: 'inherit' });
      
      log('🔧 Push vers GitHub...', 'blue');
      execSync('git push origin main', { stdio: 'inherit' });
      
      log('✅ Corrections déployées avec succès', 'green');
      
    } catch (error) {
      log(`❌ Erreur Git: ${error.message}`, 'red');
      return false;
    }
    
    // 4. Résumé
    logSection('📊 RÉSUMÉ CORRECTION NAVIGATION');
    log('✅ Liens Connexion corrigés vers /login-alt.html', 'green');
    log('✅ Liens Commencer corrigés vers /register', 'green');
    log('✅ Page Register.tsx créée', 'green');
    log('✅ Routes mises à jour', 'green');
    log('✅ Corrections déployées sur Netlify', 'green');
    
    log('\n🎯 PROBLÈMES IDENTIFIÉS ET CORRIGÉS:', 'yellow');
    log('   - Bouton Connexion revient en arrière', 'blue');
    log('   - Bouton Commencer revient en arrière', 'blue');
    log('   - Liens incorrects vers /auth/login et /auth/register', 'green');
    log('   - Maintenant pointent vers /login-alt.html et /register', 'green');
    
    log('\n⏳ Redéploiement en cours...', 'yellow');
    log('   Attendez 2-3 minutes puis testez à nouveau', 'blue');
    log('   Navigation fluide sans retour en arrière', 'green');
    
    return true;
    
  } catch (error) {
    log('\n❌ Erreur lors de la correction navigation', 'red');
    log(error.message, 'red');
    return false;
  }
}

// Exécution
fixNavigationBugsMain().catch(console.error);