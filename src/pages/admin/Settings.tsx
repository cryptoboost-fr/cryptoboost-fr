import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  Settings as SettingsIcon,
  Save,
  Shield,
  Bell,
  Globe,
  Database,
  Key,
  Users,
  DollarSign,
  RefreshCw,
  CheckCircle
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { adminApi } from '@/lib/supabase';
import { useToast } from '@/components/ui/toaster';

export const Settings = () => {
  const { toast } = useToast();
  const [settings, setSettings] = useState({
    siteName: 'CryptoBoost',
    siteDescription: 'Plateforme de trading automatisé',
    maintenanceMode: false,
    registrationEnabled: true,
    emailNotifications: true,
    maxInvestmentAmount: 10000,
    minInvestmentAmount: 50,
    transactionFee: 0.1,
    supportEmail: 'support@cryptoboost.world'
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // Charger les paramètres au montage du composant
  useEffect(() => {
    const loadSettings = async () => {
      try {
        setLoading(true);
        const data = await adminApi.getSettings();
        if (data) {
          setSettings(data);
        }
      } catch (error) {
        console.error('Erreur lors du chargement des paramètres:', error);
        toast('Erreur lors du chargement des paramètres', 'error');
      } finally {
        setLoading(false);
      }
    };

    loadSettings();
  }, [toast]);

  const handleSave = async () => {
    try {
      setSaving(true);
      const success = await adminApi.updateSettings(settings);

      if (success) {
        toast('Paramètres sauvegardés avec succès !', 'success');
      } else {
        toast('Erreur lors de la sauvegarde des paramètres', 'error');
      }
    } catch (error) {
      console.error('Erreur lors de la sauvegarde:', error);
      toast('Erreur lors de la sauvegarde des paramètres', 'error');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-center h-64">
          <RefreshCw className="w-8 h-8 text-blue-500 animate-spin" />
          <span className="ml-2">Chargement des paramètres...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Paramètres</h1>
            <p className="text-muted-foreground">
              Configurez les paramètres de la plateforme
            </p>
          </div>
          <Button
            onClick={handleSave}
            disabled={saving || loading}
            className="min-w-[140px]"
          >
            {saving ? (
              <>
                <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                Sauvegarde...
              </>
            ) : (
              <>
                <Save className="w-4 h-4 mr-2" />
                Sauvegarder
              </>
            )}
          </Button>
        </div>
      </motion.div>

      {/* General Settings */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
      >
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Globe className="w-5 h-5" />
              <span>Paramètres Généraux</span>
            </CardTitle>
            <CardDescription>
              Configuration générale de la plateforme
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium">Nom du site</label>
                <Input
                  value={settings.siteName}
                  onChange={(e) => setSettings(prev => ({ ...prev, siteName: e.target.value }))}
                />
              </div>
              <div>
                <label className="text-sm font-medium">Description</label>
                <Input
                  value={settings.siteDescription}
                  onChange={(e) => setSettings(prev => ({ ...prev, siteDescription: e.target.value }))}
                />
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="maintenanceMode"
                checked={settings.maintenanceMode}
                onChange={(e) => setSettings(prev => ({ ...prev, maintenanceMode: e.target.checked }))}
                className="rounded"
              />
              <label htmlFor="maintenanceMode" className="text-sm font-medium">
                Mode maintenance
              </label>
            </div>
            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="registrationEnabled"
                checked={settings.registrationEnabled}
                onChange={(e) => setSettings(prev => ({ ...prev, registrationEnabled: e.target.checked }))}
                className="rounded"
              />
              <label htmlFor="registrationEnabled" className="text-sm font-medium">
                Inscriptions autorisées
              </label>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Financial Settings */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <DollarSign className="w-5 h-5" />
              <span>Paramètres Financiers</span>
            </CardTitle>
            <CardDescription>
              Configuration des montants et frais
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="text-sm font-medium">Montant minimum (€)</label>
                <Input
                  type="number"
                  value={settings.minInvestmentAmount}
                  onChange={(e) => setSettings(prev => ({ ...prev, minInvestmentAmount: parseFloat(e.target.value) }))}
                />
              </div>
              <div>
                <label className="text-sm font-medium">Montant maximum (€)</label>
                <Input
                  type="number"
                  value={settings.maxInvestmentAmount}
                  onChange={(e) => setSettings(prev => ({ ...prev, maxInvestmentAmount: parseFloat(e.target.value) }))}
                />
              </div>
              <div>
                <label className="text-sm font-medium">Frais de transaction (%)</label>
                <Input
                  type="number"
                  step="0.1"
                  value={settings.transactionFee}
                  onChange={(e) => setSettings(prev => ({ ...prev, transactionFee: parseFloat(e.target.value) }))}
                />
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Support Settings */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.3 }}
      >
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Users className="w-5 h-5" />
              <span>Support Client</span>
            </CardTitle>
            <CardDescription>
              Informations de contact du support
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium">Email support</label>
                <Input
                  type="email"
                  value={settings.supportEmail}
                  onChange={(e) => setSettings(prev => ({ ...prev, supportEmail: e.target.value }))}
                />
              </div>

            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Notification Settings */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.4 }}
      >
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Bell className="w-5 h-5" />
              <span>Notifications</span>
            </CardTitle>
            <CardDescription>
              Configuration des notifications
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="emailNotifications"
                checked={settings.emailNotifications}
                onChange={(e) => setSettings(prev => ({ ...prev, emailNotifications: e.target.checked }))}
                className="rounded"
              />
              <label htmlFor="emailNotifications" className="text-sm font-medium">
                Notifications par email
              </label>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}; 