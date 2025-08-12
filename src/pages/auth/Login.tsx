import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Eye, EyeOff, Mail, Lock, ArrowRight } from 'lucide-react';
import { useAuthStore } from '@/store/auth';
import { useToast } from '@/components/ui/toaster';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card';

export const Login = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<{email?: string; password?: string}>({});
  
  const { signIn } = useAuthStore();
  const { toast } = useToast();
  const navigate = useNavigate();
  const location = useLocation();

  // Get the intended destination from location state
  const from = location.state?.from?.pathname || null;

  const validateForm = () => {
    const newErrors: {email?: string; password?: string} = {};
    
    if (!formData.email) {
      newErrors.email = 'L\'email est obligatoire';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Format d\'email invalide';
    }
    
    if (!formData.password) {
      newErrors.password = 'Le mot de passe est obligatoire';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Le mot de passe doit contenir au moins 6 caractères';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    setIsLoading(true);

    try {
      // Login attempt - sensitive data removed for security
      const result = await signIn(formData);
      
      if (result.error) {
        // Login error - details removed for security
        toast(result.error, 'error');
        setErrors({ password: result.error });
      } else {
        // Login successful - user data retrieved

        // Le user est maintenant retourné directement par signIn
        const user = result.user || useAuthStore.getState().user;
        // User profile retrieved - sensitive data removed for security
        
        if (user) {
          toast('Connexion réussie !', 'success');

          // Redirection intelligente avec gestion des cas limites
          let redirectPath = '/client'; // Default fallback

          if (from) {
            // Si l'utilisateur tentait d'accéder à une page spécifique, vérifier les permissions
            if (from.startsWith('/admin') && user.role === 'admin') {
              redirectPath = from;
            } else if (from.startsWith('/client') && (user.role === 'client' || user.role === 'admin')) {
              redirectPath = from;
            } else if (!from.startsWith('/admin') && !from.startsWith('/client')) {
              // Page publique, rediriger vers la page demandée
              redirectPath = from;
            }
          } else {
            // Redirection par défaut basée sur le rôle
            if (user.role === 'admin') {
              redirectPath = '/admin';
            } else if (user.role === 'client') {
              redirectPath = '/client';
            } else {
              // Rôle non défini ou invalide - redirection par défaut vers client
              console.warn('Rôle utilisateur non défini ou invalide:', user.role);
              toast('Connexion réussie ! Redirection vers l\'espace client.', 'success');
              redirectPath = '/client';
            }
          }

          navigate(redirectPath, { replace: true });
        } else {
          toast('Erreur lors de la récupération du profil utilisateur', 'error');
        }
      }
    } catch (error) {
      // Unexpected error occurred - details removed for security
      toast('Une erreur inattendue s\'est produite', 'error');
      setErrors({ password: 'Erreur de connexion' });
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
    
    // Effacer l'erreur quand l'utilisateur tape
    if (errors[name as keyof typeof errors]) {
      setErrors({
        ...errors,
        [name]: undefined,
      });
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="min-h-screen-mobile flex items-center justify-center p-4 mobile-safe-area bg-gradient-to-br from-gray-900 via-blue-900 to-gray-900"
    >
      <Card className="w-full max-w-md mx-auto border-0 shadow-2xl bg-white/95 backdrop-blur-sm">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold">Connexion</CardTitle>
          <CardDescription>
            Accédez à votre compte CryptoBoost
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4" noValidate role="form" aria-labelledby="login-title">
            <div className="space-y-2">
              <label htmlFor="email" className="text-sm font-medium block">
                Email *
              </label>
              <div className="relative">
                <Mail 
                  className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" 
                  aria-hidden="true"
                />
                <Input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="votre@email.com"
                  value={formData.email}
                  onChange={handleInputChange}
                  required
                  autoComplete="email"
                  className="pl-10"
                  mobileOptimized={true}
                  aria-invalid={!!errors.email}
                  aria-describedby={errors.email ? "email-error" : undefined}
                />
              </div>
              {errors.email && (
                <div 
                  id="email-error" 
                  className="text-sm text-red-600 mt-1" 
                  role="alert"
                  aria-live="polite"
                >
                  {errors.email}
                </div>
              )}
            </div>

            <div className="space-y-2">
              <label htmlFor="password" className="text-sm font-medium block">
                Mot de passe *
              </label>
              <div className="relative">
                <Lock 
                  className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" 
                  aria-hidden="true"
                />
                <Input
                  id="password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Votre mot de passe"
                  value={formData.password}
                  onChange={handleInputChange}
                  required
                  autoComplete="current-password"
                  className="pl-10 pr-10"
                  mobileOptimized={true}
                  aria-invalid={!!errors.password}
                  aria-describedby={errors.password ? "password-error" : "password-help"}
                />
                <button
                  type="button"
                  onClick={togglePasswordVisibility}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 rounded touch-target transition-all duration-200 active:scale-95"
                  aria-label={showPassword ? 'Masquer le mot de passe' : 'Afficher le mot de passe'}
                  tabIndex={0}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              <div id="password-help" className="text-xs text-muted-foreground">
                Minimum 6 caractères
              </div>
              {errors.password && (
                <div 
                  id="password-error" 
                  className="text-sm text-red-600 mt-1" 
                  role="alert"
                  aria-live="polite"
                >
                  {errors.password}
                </div>
              )}
            </div>

            <Button
              type="submit"
              variant="gradient"
              size="mobile"
              className="w-full"
              disabled={isLoading}
              mobileOptimized={true}
              aria-describedby={isLoading ? "loading-text" : undefined}
            >
              {isLoading ? (
                <div className="flex items-center space-x-2">
                  <div 
                    className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"
                    role="status"
                    aria-hidden="true"
                  ></div>
                  <span id="loading-text">Connexion en cours...</span>
                </div>
              ) : (
                <div className="flex items-center space-x-2">
                  <span>Se connecter</span>
                  <ArrowRight className="w-4 h-4" aria-hidden="true" />
                </div>
              )}
            </Button>
          </form>

          <div className="mt-6 text-center space-y-3">
            <p className="text-sm text-muted-foreground">
              <Link
                to="/password-reset"
                className="text-primary hover:underline font-medium focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 rounded"
              >
                Mot de passe oublié ?
              </Link>
            </p>
            <p className="text-sm text-muted-foreground">
              Pas encore de compte ?{' '}
              <Link
                to="/auth/register"
                className="text-primary hover:underline font-medium focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 rounded"
              >
                Créer un compte
              </Link>
            </p>
          </div>

          <div className="mt-6 pt-6 border-t border-border">
            <p className="text-xs text-muted-foreground text-center">
              En vous connectant, vous acceptez nos{' '}
              <Link 
                to="/terms" 
                className="text-primary hover:underline focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 rounded"
              >
                conditions d'utilisation
              </Link>{' '}
              et notre{' '}
              <Link 
                to="/privacy" 
                className="text-primary hover:underline focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 rounded"
              >
                politique de confidentialité
              </Link>
            </p>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}; 