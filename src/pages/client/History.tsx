import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Download, 
  Upload, 
  ArrowRight,
  Filter,
  Search,
  Calendar,
  CheckCircle,
  Clock,
  XCircle
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { useAuthStore } from '@/store/auth';
import { utils, supabase } from '@/lib/supabase';
import { Transaction, UserInvestment } from '@/types';

export const History = () => {
  const { user } = useAuthStore();
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [investments, setInvestments] = useState<UserInvestment[]>([]);
  const [activeTab, setActiveTab] = useState<'transactions' | 'investments'>('transactions');
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [loading, setLoading] = useState(true);

  // Load from DB
  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        if (user?.id) {
          const [{ data: txs }, { data: invs }] = await Promise.all([
            supabase
              .from('transactions')
              .select('*')
              .eq('user_id', user.id)
              .order('created_at', { ascending: false }),
            supabase
              .from('user_investments')
              .select('*')
              .eq('user_id', user.id)
              .order('created_at', { ascending: false })
          ]);
          setTransactions(txs || []);
          setInvestments(invs || []);
        }
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, [user?.id]);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'approved':
      case 'completed':
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'pending':
      case 'active':
        return <Clock className="w-4 h-4 text-yellow-500" />;
      case 'rejected':
      case 'cancelled':
        return <XCircle className="w-4 h-4 text-red-500" />;
      default:
        return <Clock className="w-4 h-4 text-gray-500" />;
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'approved':
        return 'Approuvé';
      case 'pending':
        return 'En attente';
      case 'rejected':
        return 'Rejeté';
      case 'active':
        return 'Actif';
      case 'completed':
        return 'Terminé';
      case 'cancelled':
        return 'Annulé';
      default:
        return 'Inconnu';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved':
      case 'completed':
        return 'text-green-600 bg-green-100';
      case 'pending':
      case 'active':
        return 'text-yellow-600 bg-yellow-100';
      case 'rejected':
      case 'cancelled':
        return 'text-red-600 bg-red-100';
      default:
        return 'text-gray-600 bg-gray-100';
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-crypto-primary"></div>
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
        <h1 className="text-3xl font-bold">Historique</h1>
        <p className="text-muted-foreground">
          Consultez l'historique de vos transactions et investissements
        </p>
      </motion.div>

      {/* Tabs */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
      >
        <div className="flex space-x-1 bg-gray-100 p-1 rounded-lg">
          <Button
            variant={activeTab === 'transactions' ? 'default' : 'ghost'}
            size="sm"
            onClick={() => setActiveTab('transactions')}
            className="flex-1"
          >
            Transactions
          </Button>
          <Button
            variant={activeTab === 'investments' ? 'default' : 'ghost'}
            size="sm"
            onClick={() => setActiveTab('investments')}
            className="flex-1"
          >
            Investissements
          </Button>
        </div>
      </motion.div>

      {/* Filters */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <Card>
          <CardContent className="pt-6">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <Input
                    placeholder="Rechercher..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
              <div className="flex gap-2">
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="px-3 py-2 border rounded-md text-sm"
                >
                  <option value="all">Tous les statuts</option>
                  <option value="approved">Approuvé</option>
                  <option value="pending">En attente</option>
                  <option value="rejected">Rejeté</option>
                </select>
                <Button variant="outline" size="sm">
                  <Calendar className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Content */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.3 }}
      >
        <Card>
          <CardHeader>
            <CardTitle>
              {activeTab === 'transactions' ? 'Transactions' : 'Investissements'}
            </CardTitle>
            <CardDescription>
              {activeTab === 'transactions' 
                ? 'Historique de vos dépôts et retraits'
                : 'Historique de vos investissements'
              }
            </CardDescription>
          </CardHeader>
          <CardContent>
            {activeTab === 'transactions' ? (
              <div className="space-y-4">
                {transactions.map((transaction) => (
                  <div key={transaction.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center space-x-4">
                      <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                        transaction.type === 'deposit' 
                          ? 'bg-green-100 text-green-600' 
                          : 'bg-orange-100 text-orange-600'
                      }`}>
                        {transaction.type === 'deposit' ? (
                          <Download className="w-5 h-5" />
                        ) : (
                          <Upload className="w-5 h-5" />
                        )}
                      </div>
                      <div>
                        <p className="font-medium capitalize">
                          {transaction.type === 'deposit' ? 'Dépôt' : 'Retrait'} {transaction.crypto_type}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          {utils.formatCryptoAmount(transaction.amount, transaction.crypto_type, transaction.usd_value)}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="flex items-center space-x-2">
                        {getStatusIcon(transaction.status)}
                        <span className={`text-sm font-medium ${getStatusColor(transaction.status)}`}>
                          {getStatusText(transaction.status)}
                        </span>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        {utils.formatDate(transaction.created_at)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="space-y-4">
                {investments.map((investment) => (
                  <div key={investment.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center space-x-4">
                      <div className="w-10 h-10 rounded-lg bg-blue-100 text-blue-600 flex items-center justify-center">
                        <ArrowRight className="w-5 h-5" />
                      </div>
                      <div>
                        <p className="font-medium">Investissement #{investment.id}</p>
                        <p className="text-sm text-muted-foreground">
                          {utils.formatEUR(investment.amount)} • {utils.formatEUR(investment.profit_target)} cible
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="flex items-center space-x-2">
                        {getStatusIcon(investment.status)}
                        <span className={`text-sm font-medium ${getStatusColor(investment.status)}`}>
                          {getStatusText(investment.status)}
                        </span>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        {utils.formatDate(investment.created_at)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}; 