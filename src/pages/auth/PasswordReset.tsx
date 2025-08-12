import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Mail, ArrowLeft, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card';
import { useToast } from '@/components/ui/toaster';
import { supabase } from '@/lib/supabase';

export const PasswordReset = () => {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isEmailSent, setIsEmailSent] = useState(false);
  const [error, setError] = useState('');
  const { toast } = useToast();

  const validateEmail = (email: string): boolean => {
    return /\S+@\S+\.\S+/.test(email);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email) {
      setError('L\'email est obligatoire');
      return;
    }
    
    if (!validateEmail(email)) {
      setError('Format d\'email invalide');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/auth/reset-password`,
      });

      if (error) {
        setError('Erreur lors de l\'envoi de l\'email');
        toast('Erreur lors de l\'envoi de l\'email', 'error');
      } else {
        setIsEmailSent(true);
        toast('Email de réinitialisation envoyé', 'success');
      }
    } catch (err) {
      console.error('Password reset error:', err);
      setError('Une erreur inattendue s\'est produite');
      toast('Une erreur inattendue s\'est produite', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
    if (error) {
      setError('');
    }
  };

  if (isEmailSent) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 via-blue-900 to-gray-900 p-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-md"
        >
          <Card className="border-0 shadow-2xl bg-white/95 backdrop-blur-sm">
            <CardHeader className="text-center pb-6">
              <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
                <CheckCircle className="w-8 h-8 text-green-600" />
              </div>
              <CardTitle className="text-2xl font-bold text-gray-900">
                Email envoyé !
              </CardTitle>
              <CardDescription className="text-gray-600">
                Vérifiez votre boîte email pour réinitialiser votre mot de passe
              </CardDescription>
            </CardHeader>
            <CardContent className="text-center">
              <p className="text-sm text-gray-600 mb-6">
                Nous avons envoyé un lien de réinitialisation à <strong>{email}</strong>
              </p>
              <div className="space-y-4">
                <Button asChild variant="outline" className="w-full">
                  <Link to="/login">
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Retour à la connexion
                  </Link>
                </Button>
                <Button 
                  variant="ghost" 
                  onClick={() => {
                    setIsEmailSent(false);
                    setEmail('');
                  }}
                  className="w-full"
                >
                  Renvoyer l'email
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 via-blue-900 to-gray-900 p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md"
      >
        <Card className="border-0 shadow-2xl bg-white/95 backdrop-blur-sm">
          <CardHeader className="text-center pb-6">
            <CardTitle id="reset-title" className="text-2xl font-bold text-gray-900">
              Réinitialiser le mot de passe
            </CardTitle>
            <CardDescription className="text-gray-600">
              Entrez votre email pour recevoir un lien de réinitialisation
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4" noValidate role="form" aria-labelledby="reset-title">
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
                    value={email}
                    onChange={handleInputChange}
                    required
                    autoComplete="email"
                    className="pl-10"
                    aria-invalid={!!error}
                    aria-describedby={error ? "email-error" : undefined}
                  />
                </div>
                {error && (
                  <div 
                    id="email-error" 
                    className="text-sm text-red-600 mt-1" 
                    role="alert"
                    aria-live="polite"
                  >
                    {error}
                  </div>
                )}
              </div>

              <Button
                type="submit"
                variant="gradient"
                className="w-full"
                disabled={isLoading}
                aria-describedby={isLoading ? "loading-text" : undefined}
              >
                {isLoading ? (
                  <div className="flex items-center space-x-2">
                    <div 
                      className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"
                      role="status"
                      aria-hidden="true"
                    ></div>
                    <span id="loading-text">Envoi en cours...</span>
                  </div>
                ) : (
                  'Envoyer le lien de réinitialisation'
                )}
              </Button>
            </form>

            <div className="mt-6 text-center">
              <Button asChild variant="ghost" size="sm">
                <Link to="/login" className="text-sm">
                  <ArrowLeft className="w-4 h-4 mr-1" />
                  Retour à la connexion
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
};
