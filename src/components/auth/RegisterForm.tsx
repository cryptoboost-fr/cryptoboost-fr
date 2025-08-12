/**
 * Composant de formulaire d'inscription - CryptoBoost
 */

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Eye, EyeOff, Mail, Lock, User, Loader2, Check } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { Label } from '../ui/Label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/Card';
import { Alert, AlertDescription } from '../ui/Alert';
import { Checkbox } from '../ui/Checkbox';

export const RegisterForm: React.FC = () => {
  const { register, isLoading, error, clearError } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [acceptTerms, setAcceptTerms] = useState(false);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: ''
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    if (error) clearError();
  };

  const validateForm = () => {
    if (!formData.firstName || !formData.lastName || !formData.email || !formData.password) {
      return 'Tous les champs sont requis';
    }
    if (formData.password !== formData.confirmPassword) {
      return 'Les mots de passe ne correspondent pas';
    }
    if (formData.password.length < 6) {
      return 'Le mot de passe doit contenir au moins 6 caractères';
    }
    if (!acceptTerms) {
      return 'Vous devez accepter les conditions d\'utilisation';
    }
    return null;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const validationError = validateForm();
    if (validationError) {
      return;
    }

    await register({
      firstName: formData.firstName,
      lastName: formData.lastName,
      email: formData.email,
      password: formData.password,
      confirmPassword: formData.password
    });
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const toggleConfirmPasswordVisibility = () => {
    setShowConfirmPassword(!showConfirmPassword);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="w-full max-w-md"
    >
      <Card className="border-0 shadow-lg">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold text-center">
            Créer un compte
          </CardTitle>
          <CardDescription className="text-center">
            Rejoignez CryptoBoost et commencez votre aventure
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <Alert variant="destructive">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="firstName">Prénom</Label>
                <div className="relative">
                  <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="firstName"
                    name="firstName"
                    type="text"
                    placeholder="Prénom"
                    value={formData.firstName}
                    onChange={handleChange}
                    className="pl-10"
                    required
                    disabled={isLoading}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="lastName">Nom</Label>
                <div className="relative">
                  <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="lastName"
                    name="lastName"
                    type="text"
                    placeholder="Nom"
                    value={formData.lastName}
                    onChange={handleChange}
                    className="pl-10"
                    required
                    disabled={isLoading}
                  />
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="votre@email.com"
                  value={formData.email}
                  onChange={handleChange}
                  className="pl-10"
                  required
                  disabled={isLoading}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Mot de passe</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  id="password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Votre mot de passe"
                  value={formData.password}
                  onChange={handleChange}
                  className="pl-10 pr-10"
                  required
                  disabled={isLoading}
                />
                <button
                  type="button"
                  onClick={togglePasswordVisibility}
                  className="absolute right-3 top-3 text-muted-foreground hover:text-foreground"
                  disabled={isLoading}
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </button>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="confirmPassword">Confirmer le mot de passe</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  id="confirmPassword"
                  name="confirmPassword"
                  type={showConfirmPassword ? 'text' : 'password'}
                  placeholder="Confirmez votre mot de passe"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  className="pl-10 pr-10"
                  required
                  disabled={isLoading}
                />
                <button
                  type="button"
                  onClick={toggleConfirmPasswordVisibility}
                  className="absolute right-3 top-3 text-muted-foreground hover:text-foreground"
                  disabled={isLoading}
                >
                  {showConfirmPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </button>
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <Checkbox
                id="terms"
                checked={acceptTerms}
                onCheckedChange={(checked) => setAcceptTerms(checked as boolean)}
                disabled={isLoading}
              />
              <Label htmlFor="terms" className="text-sm">
                J'accepte les{' '}
                <a href="/terms" className="text-primary hover:underline">
                  conditions d'utilisation
                </a>{' '}
                et la{' '}
                <a href="/privacy" className="text-primary hover:underline">
                  politique de confidentialité
                </a>
              </Label>
            </div>

            <Button
              type="submit"
              className="w-full"
              disabled={isLoading || !acceptTerms}
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Création en cours...
                </>
              ) : (
                <>
                  <Check className="mr-2 h-4 w-4" />
                  Créer mon compte
                </>
              )}
            </Button>
          </form>

          <div className="mt-6 text-center text-sm">
            <p className="text-muted-foreground">
              Déjà un compte ?{' '}
              <a href="/login-alt.html" className="text-primary hover:underline font-medium">
                Se connecter
              </a>
            </p>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};