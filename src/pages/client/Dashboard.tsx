import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  TrendingUp,
  Wallet,
  ArrowUpRight,
  ArrowDownRight,
  RefreshCw,
  DollarSign,
  Activity,
  Target
} from 'lucide-react';
import { useAuthStore } from '@/store/auth';
import { userApi, supabase } from '@/lib/supabase';
import { UserInvestment, Transaction } from '@/types';
import { Button } from '@/components/ui/Button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';

interface DashboardStats {
  totalBalance: number;
  totalProfit: number;
  totalInvested: number;
  transactionCount: number;
  activeInvestments: number;
  pendingTransactions: number;
}

export const Dashboard: React.FC = () => {
  const { user } = useAuthStore();
  const navigate = useNavigate();
  const [stats, setStats] = useState<DashboardStats>({
    totalBalance: 0,
    totalProfit: 0,
    totalInvested: 0,
    transactionCount: 0,
    activeInvestments: 0,
    pendingTransactions: 0
  });
  const [loading, setLoading] = useState(true);
  const [recentTransactions, setRecentTransactions] = useState<Transaction[]>([]);

  useEffect(() => {
    const loadDashboardData = async () => {
      if (!user?.id) return;

      try {
        setLoading(true);

        // Charger les investissements de l'utilisateur
        const userInvestments = await userApi.getUserInvestments(user.id);

        // Charger les transactions de l'utilisateur
        const userTransactions = await userApi.getUserTransactions(user.id);

        // Calculer les statistiques
        const totalInvested = userInvestments.reduce((sum, inv) => sum + inv.amount, 0);
        const totalProfit = userInvestments.reduce((sum, inv) => {
          const profit = inv.current_value ? inv.current_value - inv.amount : 0;
          return sum + profit;
        }, 0);
        const totalBalance = totalInvested + totalProfit;

        const activeInvestments = userInvestments.filter(inv => inv.status === 'active').length;
        const pendingTransactions = userTransactions.filter(tx => tx.status === 'pending').length;

        setStats({
          totalBalance,
          totalProfit,
          totalInvested,
          transactionCount: userTransactions.length,
          activeInvestments,
          pendingTransactions
        });

        // Garder les 5 dernières transactions
        setRecentTransactions(userTransactions.slice(0, 5));

      } catch (error) {
        // Dashboard data loading error - details removed for security
      } finally {
        setLoading(false);
      }
    };

    loadDashboardData();
  }, [user?.id]);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'EUR'
    }).format(amount);
  };

  const getTransactionIcon = (type: string) => {
    switch (type) {
      case 'deposit':
        return <ArrowDownRight className="w-4 h-4 text-green-500" />;
      case 'withdrawal':
        return <ArrowUpRight className="w-4 h-4 text-red-500" />;
      default:
        return <Activity className="w-4 h-4 text-blue-500" />;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-gray-900 p-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-center h-64">
            <RefreshCw className="w-8 h-8 text-blue-500 animate-spin" />
            <span className="ml-2 text-white">Chargement de vos données...</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen-mobile bg-gradient-to-br from-gray-900 via-blue-900 to-gray-900 p-4 sm:p-6 lg:p-8 mobile-safe-area">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="space-y-6"
        >
          {/* Enhanced Header Card */}
          <Card className="bg-gradient-to-r from-crypto-primary/20 to-crypto-secondary/20 backdrop-blur-lg border-crypto-primary/30 shadow-2xl">
            <CardContent className="p-4 sm:p-6 lg:p-8">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
                <div className="space-y-2">
                  <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white">
                    Dashboard Client
                  </h1>
                  <p className="text-blue-200 text-sm sm:text-base">
                    Bienvenue, {user?.full_name || user?.email}
                  </p>
                  <div className="flex items-center space-x-2 text-xs text-blue-300">
                    <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                    <span>Connecté • Dernière mise à jour: {new Date().toLocaleTimeString('fr-FR')}</span>
                  </div>
                </div>
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
            </CardContent>
          </Card>

          {/* Enhanced Statistics Cards */}
          <div className="mobile-dashboard-grid gap-4 sm:gap-6">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              <Card className="bg-gradient-to-br from-blue-600/20 to-blue-700/20 border-blue-500/30 hover:border-blue-400/50 transition-all duration-300 hover:shadow-xl hover:shadow-blue-500/20 group">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-white group-hover:text-blue-200 transition-colors">
                    Solde Total
                  </CardTitle>
                  <div className="p-2 bg-blue-500/20 rounded-lg group-hover:bg-blue-500/30 transition-colors">
                    <Wallet className="h-4 w-4 text-blue-400" />
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="text-xl sm:text-2xl font-bold text-blue-200 group-hover:text-white transition-colors">
                    {formatCurrency(stats.totalBalance)}
                  </div>
                  <p className="text-xs text-blue-300 mt-1">
                    Investissements + Profits
                  </p>
                  <div className="mt-2 h-1 bg-blue-500/20 rounded-full overflow-hidden">
                    <motion.div
                      className="h-full bg-gradient-to-r from-blue-400 to-blue-600"
                      initial={{ width: 0 }}
                      animate={{ width: '100%' }}
                      transition={{ duration: 1, delay: 0.5 }}
                    />
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <Card className="bg-gradient-to-br from-green-600/20 to-green-700/20 border-green-500/30 hover:border-green-400/50 transition-all duration-300 hover:shadow-xl hover:shadow-green-500/20 group">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-white group-hover:text-green-200 transition-colors">
                    Profits
                  </CardTitle>
                  <div className="p-2 bg-green-500/20 rounded-lg group-hover:bg-green-500/30 transition-colors">
                    <TrendingUp className="h-4 w-4 text-green-400" />
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="text-xl sm:text-2xl font-bold text-green-200 group-hover:text-white transition-colors">
                    {formatCurrency(stats.totalProfit)}
                  </div>
                  <p className="text-xs text-green-300 mt-1">
                    {stats.totalProfit >= 0 ? '+' : ''}{((stats.totalProfit / (stats.totalInvested || 1)) * 100).toFixed(1)}%
                  </p>
                  <div className="mt-2 h-1 bg-green-500/20 rounded-full overflow-hidden">
                    <motion.div
                      className="h-full bg-gradient-to-r from-green-400 to-green-600"
                      initial={{ width: 0 }}
                      animate={{ width: `${Math.min(100, (stats.totalProfit / 1000) * 100)}%` }}
                      transition={{ duration: 1, delay: 0.7 }}
                    />
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.3 }}
            >
              <Card className="bg-gradient-to-br from-purple-600/20 to-purple-700/20 border-purple-500/30 hover:border-purple-400/50 transition-all duration-300 hover:shadow-xl hover:shadow-purple-500/20 group">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-white group-hover:text-purple-200 transition-colors">
                    Investissements
                  </CardTitle>
                  <div className="p-2 bg-purple-500/20 rounded-lg group-hover:bg-purple-500/30 transition-colors">
                    <Target className="h-4 w-4 text-purple-400" />
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="text-xl sm:text-2xl font-bold text-purple-200 group-hover:text-white transition-colors">
                    {stats.activeInvestments}
                  </div>
                  <p className="text-xs text-purple-300 mt-1">
                    {formatCurrency(stats.totalInvested)} investis
                  </p>
                  <div className="mt-2 h-1 bg-purple-500/20 rounded-full overflow-hidden">
                    <motion.div
                      className="h-full bg-gradient-to-r from-purple-400 to-purple-600"
                      initial={{ width: 0 }}
                      animate={{ width: `${Math.min(100, (stats.activeInvestments / 10) * 100)}%` }}
                      transition={{ duration: 1, delay: 0.9 }}
                    />
                  </div>
                </CardContent>
              </Card>
            </motion.div>

              <Card className="bg-orange-600/20 border-orange-500/30">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-white">Transactions</CardTitle>
                  <Activity className="h-4 w-4 text-orange-400" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-orange-200">
                    {stats.transactionCount}
                  </div>
                  <p className="text-xs text-orange-300">
                    {stats.pendingTransactions} en attente
                  </p>
                </CardContent>
              </Card>
            </div>

          {/* Enhanced Action Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            <Card className="bg-white/10 backdrop-blur-lg border-white/20 shadow-xl">
              <CardHeader>
                <CardTitle className="text-white text-lg sm:text-xl">Actions Rapides</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
                  <Button
                    onClick={() => navigate('/client/plans')}
                    size="mobile"
                    className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white shadow-lg hover:shadow-xl transition-all duration-300 group"
                    mobileOptimized={true}
                  >
                    <Target className="w-4 h-4 mr-2 group-hover:scale-110 transition-transform" />
                    <span className="font-medium">Investir</span>
                  </Button>
                  <Button
                    onClick={() => navigate('/client/wallet')}
                    size="mobile"
                    className="bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white shadow-lg hover:shadow-xl transition-all duration-300 group"
                    mobileOptimized={true}
                  >
                    <Wallet className="w-4 h-4 mr-2 group-hover:scale-110 transition-transform" />
                    <span className="font-medium">Wallet</span>
                  </Button>
                  <Button
                    onClick={() => navigate('/client/exchange')}
                    size="mobile"
                    className="bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 text-white shadow-lg hover:shadow-xl transition-all duration-300 group"
                    mobileOptimized={true}
                  >
                    <RefreshCw className="w-4 h-4 mr-2 group-hover:rotate-180 transition-transform duration-500" />
                    <span className="font-medium">Échanger</span>
                  </Button>
                  <Button
                    onClick={() => navigate('/client/history')}
                    variant="outline"
                    size="mobile"
                    className="text-white border-white/30 hover:bg-white/10 backdrop-blur-sm shadow-lg hover:shadow-xl transition-all duration-300 group"
                    mobileOptimized={true}
                  >
                    <Activity className="w-4 h-4 mr-2 group-hover:scale-110 transition-transform" />
                    <span className="font-medium">Historique</span>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Enhanced Recent Transactions */}
          {recentTransactions.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.6 }}
            >
              <Card className="bg-white/10 backdrop-blur-lg border-white/20 shadow-xl">
                <CardHeader className="flex flex-row items-center justify-between">
                  <CardTitle className="text-white text-lg sm:text-xl">Transactions Récentes</CardTitle>
                  <Button
                    onClick={() => navigate('/client/history')}
                    variant="ghost"
                    size="sm"
                    className="text-blue-300 hover:text-white hover:bg-white/10"
                  >
                    Voir tout
                  </Button>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {recentTransactions.map((transaction, index) => (
                      <motion.div
                        key={transaction.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.3, delay: index * 0.1 }}
                        className="flex items-center justify-between p-4 bg-white/5 rounded-xl hover:bg-white/10 transition-all duration-200 group cursor-pointer mobile-card"
                        onClick={() => navigate('/client/history')}
                      >
                        <div className="flex items-center space-x-3">
                          <div className="p-2 bg-white/10 rounded-lg group-hover:bg-white/20 transition-colors">
                            {getTransactionIcon(transaction.type)}
                          </div>
                          <div>
                            <p className="text-white font-medium text-sm sm:text-base">
                              {transaction.type === 'deposit' ? 'Dépôt' :
                               transaction.type === 'withdrawal' ? 'Retrait' :
                               transaction.type}
                            </p>
                            <p className="text-gray-400 text-xs sm:text-sm">
                              {new Date(transaction.created_at).toLocaleDateString('fr-FR')}
                            </p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className={`font-bold text-sm sm:text-base ${
                            transaction.type === 'deposit' ? 'text-green-400' : 'text-red-400'
                          }`}>
                            {transaction.type === 'deposit' ? '+' : '-'}{formatCurrency(transaction.amount)}
                          </p>
                          <p className="text-gray-400 text-xs sm:text-sm capitalize">
                            {transaction.status}
                          </p>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )}
        </motion.div>
      </div>
    </div>
  );
};