import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Users,
  Activity,
  DollarSign,
  TrendingUp,
  RefreshCw,
  AlertTriangle,
  CheckCircle,
  Clock,
  BarChart3,
  Settings,
  FileText
} from 'lucide-react';
import { adminApi } from '@/lib/supabase';
import { Button } from '@/components/ui/Button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';

interface AdminDashboardStats {
  totalUsers: number;
  activeUsers: number;
  totalTransactions: number;
  pendingTransactions: number;
  totalVolume: number;
  totalRevenue: number;
  totalInvestments: number;
  activeInvestments: number;
  recentActivity: Array<{
    id: string;
    type: string;
    description: string;
    timestamp: string;
    status: string;
  }>;
}

export const AdminDashboard: React.FC = () => {
  const navigate = useNavigate();
  const [stats, setStats] = useState<AdminDashboardStats>({
    totalUsers: 0,
    activeUsers: 0,
    totalTransactions: 0,
    pendingTransactions: 0,
    totalVolume: 0,
    totalRevenue: 0,
    totalInvestments: 0,
    activeInvestments: 0,
    recentActivity: []
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadAdminDashboardData = async () => {
      try {
        setLoading(true);

        // Charger les statistiques admin
        const dashboardStats = await adminApi.getDashboardStats();

        // Charger tous les utilisateurs pour calculer les stats
        const allUsers = await adminApi.getAllUsers();
        const activeUsers = allUsers.filter(user => user.status === 'active').length;

        // Charger toutes les transactions pour calculer les stats
        const allTransactions = await adminApi.getAllTransactions();
        const pendingTransactions = allTransactions.filter(tx => tx.status === 'pending').length;
        const totalVolume = allTransactions
          .filter(tx => tx.status === 'completed')
          .reduce((sum, tx) => sum + tx.amount, 0);

        // Calculer les revenus (supposons 2% de commission)
        const totalRevenue = totalVolume * 0.02;

        // Charger les investissements pour les stats
        const allInvestments = await adminApi.getAllInvestments();
        const activeInvestments = allInvestments.filter(inv => inv.status === 'active').length;

        // Créer l'activité récente à partir des transactions récentes
        const recentActivity = allTransactions
          .slice(0, 5)
          .map(tx => ({
            id: tx.id,
            type: tx.type,
            description: `Transaction ${tx.type} de ${formatCurrency(tx.amount)}`,
            timestamp: tx.created_at,
            status: tx.status
          }));

        setStats({
          totalUsers: allUsers.length,
          activeUsers,
          totalTransactions: allTransactions.length,
          pendingTransactions,
          totalVolume,
          totalRevenue,
          totalInvestments: allInvestments.length,
          activeInvestments,
          recentActivity
        });

      } catch (error) {
        // Admin dashboard data loading error - details removed for security
        // En cas d'erreur, utiliser des données par défaut
        setStats(prev => ({
          ...prev,
          recentActivity: [
            {
              id: '1',
              type: 'info',
              description: 'Erreur de chargement des données',
              timestamp: new Date().toISOString(),
              status: 'error'
            }
          ]
        }));
      } finally {
        setLoading(false);
      }
    };

    loadAdminDashboardData();
  }, []);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'EUR'
    }).format(amount);
  };

  const formatNumber = (num: number) => {
    return new Intl.NumberFormat('fr-FR').format(num);
  };

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'deposit':
        return <TrendingUp className="w-4 h-4 text-green-500" />;
      case 'withdrawal':
        return <TrendingUp className="w-4 h-4 text-red-500 rotate-180" />;
      case 'investment':
        return <BarChart3 className="w-4 h-4 text-blue-500" />;
      default:
        return <Activity className="w-4 h-4 text-gray-500" />;
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'pending':
        return <Clock className="w-4 h-4 text-yellow-500" />;
      case 'failed':
        return <AlertTriangle className="w-4 h-4 text-red-500" />;
      default:
        return <Activity className="w-4 h-4 text-gray-500" />;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-red-900 to-gray-900 p-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-center h-64">
            <RefreshCw className="w-8 h-8 text-red-500 animate-spin" />
            <span className="ml-2 text-white">Chargement des données administrateur...</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen-mobile bg-gradient-to-br from-gray-900 via-red-900 to-gray-900 p-4 sm:p-6 lg:p-8 mobile-safe-area">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="space-y-6"
        >
          {/* Enhanced Admin Header */}
          <Card className="bg-gradient-to-r from-red-600/20 to-orange-600/20 backdrop-blur-lg border-red-500/30 shadow-2xl">
            <CardContent className="p-4 sm:p-6 lg:p-8">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
                <div className="space-y-2">
                  <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white">
                    Dashboard Admin
                  </h1>
                  <p className="text-red-200 text-sm sm:text-base">
                    Vue d'ensemble de la plateforme • Contrôle total
                  </p>
                  <div className="flex items-center space-x-2 text-xs text-red-300">
                    <div className="w-2 h-2 bg-red-400 rounded-full animate-pulse"></div>
                    <span>Système opérationnel • {new Date().toLocaleTimeString('fr-FR')}</span>
                  </div>
                </div>
                <div className="flex flex-col sm:flex-row gap-2">
                  <Button
                    onClick={() => navigate('/admin/settings')}
                    variant="outline"
                    size="mobile"
                    className="text-white border-white/30 hover:bg-white/10 backdrop-blur-sm"
                    mobileOptimized={true}
                  >
                    <Settings className="w-4 h-4 mr-2" />
                    Paramètres
                  </Button>
                  <Button
                    onClick={() => window.location.reload()}
                    variant="outline"
                    size="mobile"
                    className="text-white border-white/30 hover:bg-white/10 backdrop-blur-sm"
                    mobileOptimized={true}
                  >
                    <RefreshCw className="w-4 h-4 mr-2" />
                    Actualiser
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Enhanced Admin Statistics */}
          <div className="mobile-dashboard-grid gap-4 sm:gap-6">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              <Card className="bg-gradient-to-br from-red-600/20 to-red-700/20 border-red-500/30 hover:border-red-400/50 transition-all duration-300 hover:shadow-xl hover:shadow-red-500/20 group">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-white group-hover:text-red-200 transition-colors">
                    Utilisateurs
                  </CardTitle>
                  <div className="p-2 bg-red-500/20 rounded-lg group-hover:bg-red-500/30 transition-colors">
                    <Users className="h-4 w-4 text-red-400" />
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="text-xl sm:text-2xl font-bold text-red-200 group-hover:text-white transition-colors">
                    {formatNumber(stats.totalUsers)}
                  </div>
                  <p className="text-xs text-red-300 mt-1">
                    {stats.activeUsers} actifs
                  </p>
                  <div className="mt-2 h-1 bg-red-500/20 rounded-full overflow-hidden">
                    <motion.div
                      className="h-full bg-gradient-to-r from-red-400 to-red-600"
                      initial={{ width: 0 }}
                      animate={{ width: `${Math.min(100, (stats.activeUsers / stats.totalUsers) * 100)}%` }}
                      transition={{ duration: 1, delay: 0.5 }}
                    />
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-orange-600/20 border-orange-500/30">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-white">Transactions</CardTitle>
                  <Activity className="h-4 w-4 text-orange-400" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-orange-200">
                    {formatNumber(stats.totalTransactions)}
                  </div>
                  <p className="text-xs text-orange-300">
                    {stats.pendingTransactions} en attente
                  </p>
                </CardContent>
              </Card>

              <Card className="bg-yellow-600/20 border-yellow-500/30">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-white">Volume Total</CardTitle>
                  <DollarSign className="h-4 w-4 text-yellow-400" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-yellow-200">
                    {formatCurrency(stats.totalVolume)}
                  </div>
                  <p className="text-xs text-yellow-300">
                    {stats.activeInvestments} investissements actifs
                  </p>
                </CardContent>
              </Card>

              <Card className="bg-pink-600/20 border-pink-500/30">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-white">Revenus</CardTitle>
                  <TrendingUp className="h-4 w-4 text-pink-400" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-pink-200">
                    {formatCurrency(stats.totalRevenue)}
                  </div>
                  <p className="text-xs text-pink-300">
                    Commission 2%
                  </p>
                </CardContent>
              </Card>
            </motion.div>
          </div>

          {/* Actions rapides */}
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-white mb-4">Actions administrateur</h2>
              <div className="flex flex-wrap gap-4">
                <Button
                  onClick={() => navigate('/admin/users')}
                  className="bg-red-600 hover:bg-red-700 text-white"
                >
                  <Users className="w-4 h-4 mr-2" />
                  Gérer utilisateurs
                </Button>
                <Button
                  onClick={() => navigate('/admin/transactions')}
                  className="bg-orange-600 hover:bg-orange-700 text-white"
                >
                  <Activity className="w-4 h-4 mr-2" />
                  Voir transactions
                </Button>
                <Button
                  onClick={() => navigate('/admin/plans')}
                  className="bg-yellow-600 hover:bg-yellow-700 text-white"
                >
                  <BarChart3 className="w-4 h-4 mr-2" />
                  Configurer plans
                </Button>
                <Button
                  onClick={() => navigate('/admin/logs')}
                  variant="outline"
                  className="text-white border-white/20 hover:bg-white/10"
                >
                  <FileText className="w-4 h-4 mr-2" />
                  Logs système
                </Button>
                <Button
                  onClick={() => navigate('/admin/settings')}
                  variant="outline"
                  className="text-white border-white/20 hover:bg-white/10"
                >
                  <Settings className="w-4 h-4 mr-2" />
                  Paramètres
                </Button>
              </div>
            </div>

            {/* Activité récente */}
            {stats.recentActivity.length > 0 && (
              <div>
                <h3 className="text-xl font-bold text-white mb-4">Activité récente</h3>
                <div className="space-y-2">
                  {stats.recentActivity.map((activity) => (
                    <div
                      key={activity.id}
                      className="flex items-center justify-between p-3 bg-white/5 rounded-lg"
                    >
                      <div className="flex items-center space-x-3">
                        {getActivityIcon(activity.type)}
                        <div>
                          <p className="text-white font-medium">
                            {activity.description}
                          </p>
                          <p className="text-gray-400 text-sm">
                            {new Date(activity.timestamp).toLocaleString('fr-FR')}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        {getStatusIcon(activity.status)}
                        <span className="text-gray-400 text-sm capitalize">
                          {activity.status}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
        </motion.div>
      </div>
    </div>
  );
};